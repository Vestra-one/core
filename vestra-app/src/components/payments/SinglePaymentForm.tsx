import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { useWallet } from "../../contexts/WalletContext";
import {
  useSupportedTokens,
  getDestinationAssetId,
  getOriginTokensOnNear,
  getDefaultOriginAssetId,
} from "../../hooks/useSupportedTokens";
import {
  requestQuote,
  executeIntentTransfer,
  executeIntentTransferViaRelayer,
  buildTransferDelegateParams,
} from "../../lib/intents";
import type { QuoteResponse, IntentTransferResult } from "../../lib/intents";
import { validateRecipientAddress } from "../../lib/addressValidation";
import { ROUTES } from "../../lib/constants";
import { reportPaymentStatus } from "../../lib/paymentEvents";
import { UploadInvoiceButton } from "./UploadInvoiceButton";
import type { ParsedInvoiceLine } from "../../lib/invoice-api";
import { getTransactionExplorerUrl } from "../../lib/near-nearblocks";
import { NEAR_NETWORK } from "../../lib/near";
import { toSmallestUnit } from "../../lib/amountUtils";

/** Human-readable label and semantic style for 1Click execution status. */
function formatStatus(status: string): { label: string; className: string } {
  switch (status) {
    case "SUCCESS":
      return { label: "Completed", className: "bg-green-500/20 text-green-600 dark:text-green-400" };
    case "PROCESSING":
      return { label: "Processing", className: "bg-blue-500/20 text-blue-600 dark:text-blue-400" };
    case "KNOWN_DEPOSIT_TX":
    case "PENDING_DEPOSIT":
      return { label: "Pending", className: "bg-amber-500/20 text-amber-600 dark:text-amber-400" };
    default:
      return { label: status.replace(/_/g, " "), className: "bg-[var(--color-surface-dark)] text-[var(--color-text-secondary)]" };
  }
}

/** Reusable tracking card: status badge, tx link, deposit address, copy buttons with feedback. */
function PaymentTrackingCard({
  result,
  explorerUrl,
}: {
  result: IntentTransferResult;
  explorerUrl: string | null;
}) {
  const [copiedField, setCopiedField] = useState<"tx" | "deposit" | null>(null);

  useEffect(() => {
    if (copiedField === null) return;
    const t = setTimeout(() => setCopiedField(null), 2000);
    return () => clearTimeout(t);
  }, [copiedField]);

  const copyTx = useCallback(() => {
    navigator.clipboard.writeText(result.txHash);
    setCopiedField("tx");
  }, [result.txHash]);

  const copyDeposit = useCallback(() => {
    navigator.clipboard.writeText(result.depositAddress);
    setCopiedField("deposit");
  }, [result.depositAddress]);

  const statusInfo = formatStatus(result.status);
  const txDisplay = `${result.txHash.slice(0, 8)}…${result.txHash.slice(-8)}`;
  const depositDisplay = `${result.depositAddress.slice(0, 12)}…`;

  return (
    <div className="mt-6 w-full rounded-xl border border-[var(--color-border-darker)] bg-[var(--color-surface-dark)] p-4 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Tracking</p>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--color-text-muted)] shrink-0">Transaction</span>
          <span className="flex items-center gap-1.5 min-w-0">
            {explorerUrl ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[var(--color-primary)] truncate hover:underline"
                title={result.txHash}
              >
                {txDisplay}
              </a>
            ) : (
              <span className="font-mono text-[var(--color-text-secondary)] truncate" title={result.txHash}>
                {txDisplay}
              </span>
            )}
            <button
              type="button"
              aria-label="Copy transaction hash"
              className="shrink-0 p-1 rounded hover:bg-white/10 text-[var(--color-text-muted)] inline-flex items-center gap-1"
              onClick={copyTx}
            >
              <Icon name="content_copy" size={18} />
              {copiedField === "tx" && <span className="text-xs text-green-500">Copied!</span>}
            </button>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--color-text-muted)] shrink-0">Deposit address</span>
          <span className="flex items-center gap-1.5 min-w-0 font-mono text-[var(--color-text-secondary)] truncate" title={result.depositAddress}>
            {depositDisplay}
            <button
              type="button"
              aria-label="Copy deposit address"
              className="shrink-0 p-1 rounded hover:bg-white/10 text-[var(--color-text-muted)] inline-flex items-center gap-1"
              onClick={copyDeposit}
            >
              <Icon name="content_copy" size={18} />
              {copiedField === "deposit" && <span className="text-xs text-green-500">Copied!</span>}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

type Step = "form" | "sending" | "success" | "error";

/** Stored after a transfer completes; used for tracking UI and reportPaymentStatus. */
export type LastTransferResult = {
  result: IntentTransferResult;
  recipient: string;
  amount: string;
  destinationAssetId: string;
  originSymbol: string;
  chainId: string;
  depositMemo: string;
};

export function SinglePaymentForm() {
  const [searchParams] = useSearchParams();
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const {
    accountId,
    isConnected,
    connect,
    signAndSendTransaction,
    relayerUrl,
    signDelegateActionForMetaTx,
  } = useWallet();
  const { chains, tokens, isLoading: tokensLoading, error: tokensError } = useSupportedTokens();
  const [recipient, setRecipient] = useState(() => searchParams.get("recipient") ?? "");
  const [chainId, setChainId] = useState("");
  const [originTokenAssetId, setOriginTokenAssetId] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationTokenSymbol, setDestinationTokenSymbol] = useState("USDC");
  const [step, setStep] = useState<Step>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  /** When gasless was attempted and failed, store quote so user can retry with wallet (direct). */
  const [lastFailedQuote, setLastFailedQuote] = useState<{
    quoteResponse: QuoteResponse;
    originAssetId: string;
  } | null>(null);
  /** Last transfer result for tracking UI and payment-status reporting (mail/SMS/webhooks). */
  const [lastTransferResult, setLastTransferResult] = useState<LastTransferResult | null>(null);

  useEffect(() => {
    if (step === "success" || step === "error") {
      resultHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  const nearTokens = useMemo(() => getOriginTokensOnNear(tokens), [tokens]);
  const defaultOriginAssetId = useMemo(() => getDefaultOriginAssetId(tokens), [tokens]);
  const effectiveOriginAssetId = originTokenAssetId || defaultOriginAssetId || "";

  const selectedOriginToken = useMemo(
    () => nearTokens.find((t) => t.assetId === effectiveOriginAssetId) ?? nearTokens[0] ?? null,
    [nearTokens, effectiveOriginAssetId],
  );

  const chainTokens = useMemo(
    () => (chainId ? chains.find((c) => c.id === chainId)?.tokens ?? [] : []),
    [chainId, chains],
  );

  const effectiveDestinationSymbol =
    chainId && chainTokens.length > 0
      ? (chainTokens.some(
          (t) => t.symbol.toUpperCase() === destinationTokenSymbol.toUpperCase(),
        )
          ? destinationTokenSymbol
          : chainTokens[0].symbol)
      : destinationTokenSymbol;

  const destinationAssetId =
    chainId
      ? getDestinationAssetId(tokens, chainId, effectiveDestinationSymbol) ??
        getDestinationAssetId(tokens, chainId)
      : null;

  const addressValidation = useMemo(
    () => validateRecipientAddress(recipient, chainId || undefined),
    [recipient, chainId],
  );
  const showAddressFeedback = recipient.trim().length > 0;

  const isValid =
    addressValidation.valid &&
    chainId !== "" &&
    !!selectedOriginToken &&
    amount.trim() !== "" &&
    Number(amount) > 0 &&
    !!destinationAssetId;

  const handleSendNow = useCallback(async () => {
    if (!isConnected || !accountId) {
      connect();
      return;
    }
    if (!isValid || !destinationAssetId || !selectedOriginToken) return;
    setStep("sending");
    setErrorMessage("");
    const amountSmallestUnit = toSmallestUnit(amount, selectedOriginToken.decimals);
    const originAssetId = selectedOriginToken.assetId;
    let quoteResponse: QuoteResponse | undefined;
    try {
      quoteResponse = await requestQuote(
        {
          recipient: recipient.trim(),
          destinationAssetId,
          amountSmallestUnit,
          originAssetId,
        },
        accountId,
      );

      const useGasless =
        relayerUrl &&
        signDelegateActionForMetaTx &&
        accountId;

      const result = useGasless
        ? await (async () => {
            const { receiverId, actions } = buildTransferDelegateParams(
              quoteResponse,
              originAssetId,
            );
            const serialized = await signDelegateActionForMetaTx({
              senderId: accountId,
              receiverId,
              actions,
            });
            return executeIntentTransferViaRelayer(
              quoteResponse,
              accountId,
              serialized,
              relayerUrl,
            );
          })()
        : await executeIntentTransfer(
            quoteResponse,
            accountId,
            signAndSendTransaction,
            originAssetId,
          );

      const ok =
        result.status === "SUCCESS" ||
        result.status === "PROCESSING" ||
        result.status === "KNOWN_DEPOSIT_TX" ||
        result.status === "PENDING_DEPOSIT";
      const depositMemo = quoteResponse.quote.depositMemo ?? "";
      setLastTransferResult({
        result,
        recipient: recipient.trim(),
        amount,
        destinationAssetId,
        originSymbol: selectedOriginToken?.symbol ?? "",
        chainId,
        depositMemo,
      });
      setStep(ok ? "success" : "error");
      if (!ok) setErrorMessage(result.status);
      reportPaymentStatus({
        senderAccountId: accountId,
        recipient: recipient.trim(),
        amount,
        destinationAssetId,
        txHash: result.txHash,
        depositAddress: result.depositAddress,
        depositMemo,
        status: result.status,
        occurredAt: new Date().toISOString(),
        originSymbol: selectedOriginToken?.symbol,
        chainId: chainId || undefined,
      });
    } catch (err) {
      setStep("error");
      setErrorMessage(err instanceof Error ? err.message : "Transfer failed");
      if (
        relayerUrl &&
        signDelegateActionForMetaTx &&
        accountId &&
        quoteResponse !== undefined
      ) {
        setLastFailedQuote({ quoteResponse, originAssetId });
      } else {
        setLastFailedQuote(null);
      }
    }
  }, [
    isConnected,
    accountId,
    connect,
    isValid,
    destinationAssetId,
    selectedOriginToken,
    recipient,
    amount,
    chainId,
    signAndSendTransaction,
    relayerUrl,
    signDelegateActionForMetaTx,
  ]);

  const fillFromInvoice = useCallback(
    (lines: ParsedInvoiceLine[]) => {
      const first = lines[0];
      if (!first) return;
      setRecipient(first.address);
      setAmount(first.amount);
      if (first.currency) setDestinationTokenSymbol(first.currency.toUpperCase());
      if (first.chain) {
        const match = chains.find(
          (c) => c.label.toLowerCase() === first.chain!.toLowerCase(),
        );
        if (match) setChainId(match.id);
      }
      setInvoiceError("");
    },
    [chains],
  );

  const resetForm = useCallback(() => {
    setStep("form");
    setErrorMessage("");
    setInvoiceError("");
    setLastFailedQuote(null);
    setLastTransferResult(null);
    setRecipient("");
    setChainId("");
    setOriginTokenAssetId(defaultOriginAssetId ?? "");
    setAmount("");
    setDestinationTokenSymbol("USDC");
  }, [defaultOriginAssetId]);

  const handleRetryWithWallet = useCallback(async () => {
    if (!lastFailedQuote || !accountId) return;
    setStep("sending");
    setErrorMessage("");
    setLastFailedQuote(null);
    try {
      const result = await executeIntentTransfer(
        lastFailedQuote.quoteResponse,
        accountId,
        signAndSendTransaction,
        lastFailedQuote.originAssetId,
      );
      const ok =
        result.status === "SUCCESS" ||
        result.status === "PROCESSING" ||
        result.status === "KNOWN_DEPOSIT_TX" ||
        result.status === "PENDING_DEPOSIT";
      const depositMemo = lastFailedQuote.quoteResponse.quote.depositMemo ?? "";
      setLastTransferResult({
        result,
        recipient: recipient.trim(),
        amount,
        destinationAssetId: getDestinationAssetId(tokens, chainId, destinationTokenSymbol) ?? "",
        originSymbol: selectedOriginToken?.symbol ?? "",
        chainId,
        depositMemo,
      });
      setStep(ok ? "success" : "error");
      if (!ok) setErrorMessage(result.status);
      reportPaymentStatus({
        senderAccountId: accountId,
        recipient: recipient.trim(),
        amount,
        destinationAssetId: getDestinationAssetId(tokens, chainId, destinationTokenSymbol) ?? "",
        txHash: result.txHash,
        depositAddress: result.depositAddress,
        depositMemo,
        status: result.status,
        occurredAt: new Date().toISOString(),
        originSymbol: selectedOriginToken?.symbol,
        chainId: chainId || undefined,
      });
    } catch (err) {
      setStep("error");
      setErrorMessage(err instanceof Error ? err.message : "Transfer failed");
    }
  }, [lastFailedQuote, accountId, signAndSendTransaction, recipient, amount, chainId, destinationTokenSymbol, tokens, selectedOriginToken]);

  if (step === "sending") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="size-14 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4">
          <Icon name="sync" className="text-[var(--color-primary)] animate-spin" size={32} />
        </div>
        <p className="text-[var(--color-text-primary)] font-semibold">Sending payment…</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">Confirm in your wallet if prompted.</p>
      </div>
    );
  }

  if (step === "success") {
    const explorerUrl = lastTransferResult
      ? getTransactionExplorerUrl(lastTransferResult.result.txHash, NEAR_NETWORK)
      : null;
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-md mx-auto">
        <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <Icon name="check_circle" className="text-green-500" size={32} />
        </div>
        <h3 ref={resultHeadingRef} tabIndex={-1} className="text-lg font-bold text-[var(--color-text-primary)] outline-none">Payment sent</h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          Your transfer is on its way to the destination chain. Track it below.
        </p>
        {lastTransferResult && (
          <PaymentTrackingCard result={lastTransferResult.result} explorerUrl={explorerUrl} />
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            to={`${ROUTES.contacts}?add=${encodeURIComponent(recipient.trim())}&chain=${encodeURIComponent(chainId)}`}
            className="flex-1"
          >
            <Button variant="secondary" className="w-full" leftIcon={<Icon name="person_add" size={20} />}>
              Save to contacts
            </Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={resetForm}>
            Send another
          </Button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    const explorerUrl = lastTransferResult
      ? getTransactionExplorerUrl(lastTransferResult.result.txHash, NEAR_NETWORK)
      : null;
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-md mx-auto">
        <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-red-500" size={32} />
        </div>
        <h3 ref={resultHeadingRef} tabIndex={-1} className="text-lg font-bold text-[var(--color-text-primary)] outline-none">Payment failed</h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">{errorMessage}</p>
        {lastTransferResult && (
          <PaymentTrackingCard result={lastTransferResult.result} explorerUrl={explorerUrl} />
        )}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {lastFailedQuote && (
            <Button onClick={handleRetryWithWallet}>
              Pay with wallet instead (you pay gas)
            </Button>
          )}
          <Button
            variant={lastFailedQuote ? "secondary" : "primary"}
            onClick={() => { setStep("form"); setErrorMessage(""); setLastFailedQuote(null); setLastTransferResult(null); }}
          >
            Try again
          </Button>
          <Button variant="secondary" onClick={resetForm}>New payment</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendNow();
      }}
    >
      {invoiceError && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <Icon name="error" size={20} />
          {invoiceError}
        </div>
      )}
      {tokensError && (
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <p className="font-medium">Could not load supported chains and tokens.</p>
          <p className="mt-1 text-xs opacity-90">
            For mainnet, set VITE_ONE_CLICK_JWT in your environment. Request a JWT from{" "}
            <a
              href="https://partners.near-intents.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              partners.near-intents.org
            </a>
            .
          </p>
        </div>
      )}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Recipient address
          </label>
          <span className="flex items-center gap-2">
            <UploadInvoiceButton
              onParsed={fillFromInvoice}
              onError={setInvoiceError}
              variant="ghost"
              size="sm"
            />
            <a
              href="/sample-invoice.pdf"
              download="sample-invoice.pdf"
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              Sample PDF
            </a>
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Paste or type 0x... or destination address"
            aria-invalid={showAddressFeedback && !addressValidation.valid}
            aria-describedby={showAddressFeedback ? "recipient-address-hint" : undefined}
            className={`w-full px-4 py-3 pr-10 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 ${
              !showAddressFeedback
                ? "border-[var(--color-border-darker)] focus:ring-[var(--color-primary)]"
                : addressValidation.valid
                  ? "border-green-500/50 focus:ring-green-500/50"
                  : "border-red-500/60 focus:ring-red-500/50"
            }`}
          />
          {showAddressFeedback && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
              aria-hidden
            >
              {addressValidation.valid ? (
                <Icon name="check_circle" className="text-green-500" size={22} />
              ) : (
                <Icon name="error" className="text-red-500" size={22} />
              )}
            </span>
          )}
        </div>
        {showAddressFeedback && (
          <p
            id="recipient-address-hint"
            className={`mt-1.5 text-xs flex items-center gap-1.5 ${
              addressValidation.valid
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {addressValidation.valid ? (
              <>
                <Icon name="check_circle" size={14} />
                Valid {addressValidation.format === "evm" ? "EVM" : addressValidation.format === "near" ? "NEAR" : "Solana"} address
              </>
            ) : (
              <>
                <Icon name="error" size={14} />
                {addressValidation.message}
              </>
            )}
          </p>
        )}
      </div>
      {nearTokens.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Pay with (on NEAR)
          </label>
          <select
            value={effectiveOriginAssetId}
            onChange={(e) => setOriginTokenAssetId(e.target.value)}
            className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {nearTokens.map((t) => (
              <option key={t.assetId} value={t.assetId}>
                {t.symbol}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Destination chain
        </label>
        <select
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">Select chain</option>
          {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {chainId && chainTokens.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Receive as (token)
          </label>
          <select
            value={effectiveDestinationSymbol}
            onChange={(e) => setDestinationTokenSymbol(e.target.value)}
            className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {chainTokens.map((t) => (
              <option key={t.assetId} value={t.symbol}>
                {t.symbol}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Amount{selectedOriginToken ? ` (${selectedOriginToken.symbol})` : ""}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          className="w-full h-12"
          disabled={!isValid || tokensLoading || !!tokensError}
        >
          {!isConnected ? "Connect Wallet" : "Send Now"}
        </Button>
        <Link to={ROUTES.paymentsScheduled}>
          <Button
            type="button"
            variant="secondary"
            className="w-full h-12"
            leftIcon={<Icon name="calendar_today" size={20} />}
          >
            Schedule Payment
          </Button>
        </Link>
      </div>
    </form>
  );
}
