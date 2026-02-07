# Processing 100s of Intent-Based Transfers – Research & Approaches

This doc outlines constraints and possible approaches for scaling from the current small batch (manual entry, sequential) to **100s of transactions** (e.g. payroll, mass payouts). No implementation – research and suggestions only.

---

## 1. Current flow and constraints

**Today:** Batch Manual Entry (and CSV) processes rows **sequentially**: for each row, `requestQuote` → (sign + send or relayer) → `submitDepositTx` → `getExecutionStatus`. One failure does not stop the loop; results are shown per row.

**Relevant limits:**

| Layer | Constraint |
|-------|------------|
| **Wallet (user signs)** | Signing 100+ txs in the browser is not feasible (UX + time). Wallet Selector is “sign and send” per tx. |
| **Relayer (Pagoda)** | One relayer tx per `SignedDelegateAction`. 100 payments = 100 relayer calls. Rate limits and allowance checks apply; user must produce 100 signed delegate actions (e.g. via FastAuth programmatically, or one “batch sign” if the wallet supports it). |
| **1Click API** | No public bulk endpoint found. Each payment = 1 `getQuote` + 1 `submitDepositTx` + 1 `getExecutionStatus`. Rate limits not documented; assume throttling needed. |
| **NEAR RPC** | Public RPC is heavily rate-limited (~30 req/min). Production uses third-party RPC (e.g. 15–100 RPS depending on provider). Many txs from one IP need throttling or multiple keys. |
| **NEAR chain** | One transaction can contain **multiple actions to the same contract**. So one tx to e.g. `wrap.near` can include many `storage_deposit` + `ft_transfer` (one per deposit address). Whether 1Click treats one txHash as multiple deposits (same hash, different `depositAddress`) must be confirmed with the API. |

**Conclusion:** Scaling to 100s cannot rely on “user signs 100 txs in the UI” or unbounded client-side parallelism without hitting rate limits and UX walls. You need at least one of: **batching (fewer txs)**, **backend processing**, or **controlled concurrency + persistence**.

---

## 2. Suggested approaches

### A. Backend job queue (async batch)

**Idea:** User submits a batch (CSV upload or API): rows stored in your backend. A worker (or cron) processes the list: for each row, get quote → submit via relayer (or a funded backend key) → submitDepositTx → record result. User sees “Processing 200 payments” and can poll status or get a webhook/email when done.

**Pros:**  
- No browser/wallet limit; worker can throttle (e.g. 5–10 concurrent), retry with backoff, and respect 1Click/relayer/RPC limits.  
- Survives tab close; idempotency and audit trail (who, when, which rows succeeded/failed).  
- Fits payroll / scheduled runs (run job at time T).

**Cons:**  
- Requires backend: queue (Redis/Bull, SQS, etc.), worker process, DB for batch + per-row status.  
- Who pays gas? If relayer: need relayer allowance/whitelist for your backend or user-scoped allowances. If backend key: you hold a key that pays gas (and storage); need security and key policy.  
- 1Click: each row still needs its own quote and submitDepositTx (unless 1Click adds a bulk API).

**Best for:** Production-grade 100s of payments, compliance, and reliability. Recommended as the main path for “100s of transactions.”

---

### B. Single on-chain tx with many deposits (batch in one NEAR tx)

**Idea:** All payments use the **same origin token** (e.g. wNEAR). Get N quotes from 1Click (N deposit addresses). Build **one** NEAR transaction to the FT contract with 2N actions: for each quote, `storage_deposit(depositAddress_i)` + `ft_transfer(depositAddress_i, amount_i)`. User signs **once**; relayer (or user) sends one tx. Then call `submitDepositTx` for each (txHash, depositAddress_i, sender).

**Pros:**  
- One signature, one on-chain tx. Best UX and minimal relayer cost if using gasless.  
- NEAR supports this (multiple actions to the same contract).

**Cons:**  
- **1Click semantics:** You must confirm that 1Click accepts the **same** `txHash` for **multiple** `submitDepositTx` calls (one per deposit address). If their system assumes one txHash ↔ one deposit, this fails.  
- Only works when every payment uses the same origin asset (e.g. all wNEAR).  
- Quote expiry: N quotes must still be valid when the single tx is sent (e.g. get quotes, build tx, sign, send within a short window).  
- Transaction size: very large N could hit tx size/gas limits; need a safe N (e.g. 20–50) and possibly chunk into several txs.

**Best for:** Same-token payouts (e.g. all wNEAR), if 1Click supports one-txHash-many-deposits. Validate with 1Click before building.

---

### C. Bounded client-side concurrency (no backend)

**Idea:** Keep everything in the browser but run K payments “in flight” (e.g. K = 5): limit concurrency with a small queue (e.g. `p-limit`). Still one quote + one execute per row, but total time goes down. Persist progress in `localStorage` (or session) so refresh doesn’t lose the batch; show progress (e.g. “47 / 200 done”).

**Pros:**  
- No backend. Easiest to add on top of current flow.  
- Reduces total time vs strict sequential.

**Cons:**  
- Wallet path still requires one sign per tx (or one per chunk if you batch on-chain as in B). So 100 wallet txs = 100 prompts, still not viable.  
- Gasless path: 100 signed delegate actions must be produced (e.g. FastAuth batch sign if available); relayer and 1Click rate limits apply.  
- Tab close / network blip can leave partial state; need clear “resume” or “retry failed” semantics.

**Best for:** Moderate batches (e.g. 20–50) with gasless + FastAuth, and when you don’t want a backend yet. Not sufficient alone for “100s” with wallet-only users.

---

### D. Chunked batches with pause / resume

**Idea:** User defines 200 rows; UI processes in chunks (e.g. 20 per chunk). After each chunk, persist “batch state” (done rows, failed rows, next index) in backend or `localStorage`. User can pause, close tab, and resume later; retry only failed rows.

**Pros:**  
- Better resilience and UX for large batches.  
- Can combine with (A) if state lives in backend, or with (C) if state is client-only.

**Cons:**  
- Quote expiry: rows that waited long might need a fresh quote on resume.  
- Implementation complexity (state machine, idempotency keys per row).

**Best for:** Use together with (A) or (C) when batch size is large.

---

### E. Backend “batch approval” + relayer

**Idea:** User approves a batch once (e.g. one signature or one FastAuth “approve 200 payments”). Backend stores the approved intent; a worker turns each into a relayer call (signed delegate from user or from a backend signer that’s authorized to act for this batch). Relayer pays gas; backend only orchestrates.

**Pros:**  
- Single user approval for the whole batch; execution is server-side with rate limiting and retries.

**Cons:**  
- Requires a way to get 100s of signed delegate actions (batch sign flow or backend signer with user authorization).  
- Relayer must accept many txs (allowances, rate limits).  
- Same 1Click/quote constraints as other approaches.

**Best for:** When you have FastAuth (or similar) that can sign many delegate actions in one user gesture and a relayer that can handle the volume.

---

## 3. Rate limiting and idempotency

- **1Click:** Throttle `getQuote` and `submitDepositTx` (e.g. max N concurrent, or M per second). Use a stable idempotency key per payment if the API supports it so retries don’t double-submit.  
- **Relayer:** Pagoda (or your own) may have per-account or per-IP limits; worker should back off on 429 and retry with jitter.  
- **RPC:** Use a provider with sufficient RPS and throttle from your side to avoid bans.  
- **DB:** Store per-row status (pending / submitted / success / failed) and optionally txHash/depositAddress so you can reconcile and retry only failed rows.

---

## 4. Summary and recommendation

| Approach | Best for | Backend? | One sign for 100s? |
|----------|----------|----------|---------------------|
| **A. Job queue** | Reliable 100s, audit, payroll | Yes | No (worker runs txs) |
| **B. One NEAR tx, many deposits** | Same-token payouts, best UX | No (or optional) | Yes |
| **C. Client concurrency** | 20–50 rows, no backend | No | No (many signs unless B) |
| **D. Chunked pause/resume** | Resilience on top of A or C | Optional | Depends on base flow |
| **E. Batch approval + relayer** | One user approval, server executes | Yes | Yes (conceptually) |

**Recommendation:**

- **Primary path for 100s:** Implement **A (backend job queue)**. User uploads batch (CSV or API); backend enqueues a job; worker processes rows with throttling, retries, and per-row status; user sees progress and final report. Use relayer (or a dedicated relayer key) for gas if you don’t want users to pay; otherwise fund a worker key and enforce strict key policy.
- **Validate B with 1Click:** Ask 1Click whether one `txHash` can be submitted multiple times with different `depositAddress` values (one tx, many deposits). If yes, **B** is a strong complement for same-token batches (e.g. cap N at 30–50 per tx, chunk if needed).
- **Short term without backend:** Add **C** (bounded concurrency + progress + optional `localStorage` resume) to improve current batch UX for smaller N; clarify that “100s” reliably will need A or B.

No implementation was done; this is research and design only.
