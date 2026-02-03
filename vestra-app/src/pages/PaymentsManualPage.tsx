import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useWallet } from "../contexts/WalletContext";
import { useSupportedTokens, getDestinationAssetId } from "../hooks/useSupportedTokens";
import { requestQuote, executeIntentTransfer } from "../lib/intents";
import { ROUTES } from "../lib/constants";

/** wNEAR decimals for converting human amount to smallest units. */
const WNEAR_DECIMALS = 24;

function toSmallestUnit(amountHuman: string, decimals: number): string {
  const n = Number(amountHuman);
  if (!Number.isFinite(n) || n < 0) return "0";
  const [whole, frac = ""] = amountHuman.replace(/,/g, "").split(".");
  const fracPadded = frac.slice(0, decimals).padEnd(decimals, "0");
  return (whole === "" ? "0" : whole) + fracPadded;
}

export type ManualPaymentRow = {
  id: string;
  recipient: string;
  chainId: string;
  amount: string;
};

const emptyRow = (): ManualPaymentRow => ({
  id: crypto.randomUUID(),
  recipient: "",
  chainId: "",
  amount: "",
});

export function PaymentsManualPage() {
  const { accountId, isConnected, connect, signAndSendTransaction } = useWallet();
  const { chains, tokens, isLoading: tokensLoading } = useSupportedTokens();
  const [rows, setRows] = useState<ManualPaymentRow[]>(() => [
    { ...emptyRow(), recipient: "0x71C21BF1d32708136C185A0CEBAE72E042733A2", chainId: "eth", amount: "0.01" },
    { ...emptyRow(), recipient: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", chainId: "pol", amount: "0.01" },
  ]);
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<Array<{ rowId: string; ok: boolean; message: string }>>([]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, emptyRow()]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSendResults((prev) => prev.filter((r) => r.rowId !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRows([emptyRow()]);
    setSendResults([]);
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<ManualPaymentRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const validRows = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.recipient.trim() !== "" &&
          r.chainId !== "" &&
          r.amount.trim() !== "" &&
          Number(r.amount) > 0,
      ),
    [rows],
  );

  const totalRecipients = validRows.length;
  const totalAmountDisplay = useMemo(() => {
    const sum = validRows.reduce((acc, r) => acc + Number(r.amount), 0);
    return sum.toFixed(4);
  }, [validRows]);

  const handleSendNow = useCallback(async () => {
    if (!isConnected || !accountId) {
      connect();
      return;
    }
    if (validRows.length === 0) return;
    setSending(true);
    setSendResults([]);
    const results: Array<{ rowId: string; ok: boolean; message: string }> = [];
    for (const row of validRows) {
      const destinationAssetId = getDestinationAssetId(tokens, row.chainId, "USDC") ?? getDestinationAssetId(tokens, row.chainId);
      if (!destinationAssetId) {
        results.push({ rowId: row.id, ok: false, message: "Unsupported chain or token" });
        continue;
      }
      const amountSmallestUnit = toSmallestUnit(row.amount, WNEAR_DECIMALS);
      try {
        const quoteResponse = await requestQuote(
          { recipient: row.recipient.trim(), destinationAssetId, amountSmallestUnit },
          accountId,
        );
        const result = await executeIntentTransfer(
          quoteResponse,
          accountId,
          signAndSendTransaction,
        );
        results.push({
          rowId: row.id,
          ok: result.status === "SUCCESS" || result.status === "PROCESSING" || result.status === "KNOWN_DEPOSIT_TX" || result.status === "PENDING_DEPOSIT",
          message: result.status === "SUCCESS" ? "Sent" : result.status,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transfer failed";
        results.push({ rowId: row.id, ok: false, message });
      }
    }
    setSendResults(results);
    setSending(false);
  }, [isConnected, accountId, connect, validRows, tokens, signAndSendTransaction]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Breadcrumb
              items={[
                { label: "Payments", href: ROUTES.dashboard },
                { label: "New Payment" },
              ]}
            />
            <h1 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] mt-1">
              Payments
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1 font-medium">
              Create and manage your outgoing transfers
            </p>
          </div>
          <Link
            to={ROUTES.paymentsManualInvoice}
            className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-[var(--radius-button)] h-10 px-5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold shadow-[var(--shadow-card)] transition-colors"
          >
            <Icon name="upload_file" size={20} />
            <span className="truncate">Upload Invoice</span>
          </Link>
        </div>
        <div className="mb-8 border-b border-[var(--color-border-dark)] gap-8 flex">
          <span className="flex flex-col items-center justify-center border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] pb-3">
            <p className="text-sm font-bold tracking-tight">New Payment</p>
          </span>
          <Link
            to={ROUTES.paymentsScheduled}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[var(--color-text-muted)] pb-3 hover:text-[var(--color-text-primary)] transition-all"
          >
            <p className="text-sm font-bold tracking-tight">
              Scheduled Payments
            </p>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full min-w-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)]">
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                  Batch Manual Entry
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-dark)]">
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/2">
                        Recipient Address
                      </th>
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/4">
                        Destination Chain
                      </th>
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/4 text-right">
                        Amount (wNEAR)
                      </th>
                      <th scope="col" className="px-6 py-4 w-10" aria-label="Remove row" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-darker)]">
                    {rows.map((row) => {
                      const result = sendResults.find((r) => r.rowId === row.id);
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={row.recipient}
                              onChange={(e) => updateRow(row.id, { recipient: e.target.value })}
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                              placeholder="0x... or destination address"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={row.chainId}
                              onChange={(e) => updateRow(row.id, { chainId: e.target.value })}
                              className="w-full px-3 h-9 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            >
                              <option value="">Select chain</option>
                              {chains.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={row.amount}
                                onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 text-right text-sm font-bold w-24 text-[var(--color-text-primary)]"
                                placeholder="0"
                              />
                              <span className="text-xs font-bold text-[var(--color-text-muted)]">
                                wNEAR
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {result && (
                              <span
                                className={
                                  result.ok
                                    ? "text-green-600 dark:text-green-500 text-xs"
                                    : "text-red-600 dark:text-red-500 text-xs"
                                }
                              >
                                {result.message}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeRow(row.id)}
                              aria-label="Remove row"
                              className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors ml-1"
                            >
                              <Icon name="close" size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 bg-[var(--color-background-darker)]">
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Icon name="add" size={18} />}
                    onClick={addRow}
                  >
                    Add row
                  </Button>
                </div>
                <button
                  type="button"
                  aria-label="Clear all rows"
                  onClick={clearAll}
                  className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                >
                  <Icon name="delete_sweep" size={24} />
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 sticky top-24 shrink-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-[var(--color-text-primary)]">
                Payment Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)]">Total recipients</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {totalRecipients}
                  </span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-[var(--color-text-muted)]">Total amount</span>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-text-primary)]">
                      {totalAmountDisplay} wNEAR
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-[var(--color-border-darker)]">
                  <span className="text-[var(--color-text-muted)]">Network ETA</span>
                  <span className="font-bold text-[var(--color-text-primary)]">~ 2 mins</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full h-12"
                  onClick={handleSendNow}
                  disabled={sending || validRows.length === 0 || tokensLoading}
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : sending
                      ? "Sending…"
                      : "Send Now"}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  leftIcon={<Icon name="calendar_today" size={20} />}
                >
                  Schedule Payment
                </Button>
              </div>
              <div className="mt-6 flex items-start gap-3 p-3 bg-[var(--color-primary)]/10 rounded-lg">
                <Icon
                  name="info"
                  className="text-blue-500 shrink-0"
                  size={20}
                />
                <p className="text-[11px] leading-tight text-blue-300">
                  Transfers use NEAR Intents: you send wNEAR from NEAR; recipients
                  receive tokens on their chosen chain. Connect wallet to send.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
