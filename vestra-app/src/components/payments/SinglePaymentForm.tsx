import { useCallback, useEffect, useMemo, useState } from "react";
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
import { requestQuote, executeIntentTransfer } from "../../lib/intents";
import { validateRecipientAddress } from "../../lib/addressValidation";
import { ROUTES } from "../../lib/constants";

function toSmallestUnit(amountHuman: string, decimals: number): string {
  const n = Number(amountHuman);
  if (!Number.isFinite(n) || n < 0) return "0";
  const [whole, frac = ""] = amountHuman.replace(/,/g, "").split(".");
  const fracPadded = frac.slice(0, decimals).padEnd(decimals, "0");
  return (whole === "" ? "0" : whole) + fracPadded;
}

type Step = "form" | "sending" | "success" | "error";

export function SinglePaymentForm() {
  const [searchParams] = useSearchParams();
  const { accountId, isConnected, connect, signAndSendTransaction } = useWallet();
  const { chains, tokens, isLoading: tokensLoading, error: tokensError } = useSupportedTokens();
  const [recipient, setRecipient] = useState(() => searchParams.get("recipient") ?? "");
  const [chainId, setChainId] = useState("");
  const [originTokenAssetId, setOriginTokenAssetId] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationTokenSymbol, setDestinationTokenSymbol] = useState("USDC");
  const [step, setStep] = useState<Step>("form");
  const [errorMessage, setErrorMessage] = useState("");

  const nearTokens = useMemo(() => getOriginTokensOnNear(tokens), [tokens]);
  const defaultOriginAssetId = useMemo(() => getDefaultOriginAssetId(tokens), [tokens]);

  useEffect(() => {
    if (defaultOriginAssetId && !originTokenAssetId) {
      setOriginTokenAssetId(defaultOriginAssetId);
    }
  }, [defaultOriginAssetId, originTokenAssetId]);

  const selectedOriginToken = useMemo(
    () => nearTokens.find((t) => t.assetId === originTokenAssetId) ?? nearTokens[0] ?? null,
    [nearTokens, originTokenAssetId],
  );

  const chainTokens = useMemo(
    () => (chainId && chains.find((c) => c.id === chainId)?.tokens) ?? [],
    [chainId, chains],
  );

  useEffect(() => {
    if (chainId && chainTokens.length > 0) {
      const hasCurrent = chainTokens.some(
        (t) => t.symbol.toUpperCase() === destinationTokenSymbol.toUpperCase(),
      );
      if (!hasCurrent) {
        setDestinationTokenSymbol(chainTokens[0].symbol);
      }
    }
  }, [chainId, chainTokens, destinationTokenSymbol]);

  const destinationAssetId =
    chainId
      ? getDestinationAssetId(tokens, chainId, destinationTokenSymbol) ??
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
    try {
      const quoteResponse = await requestQuote(
        {
          recipient: recipient.trim(),
          destinationAssetId,
          amountSmallestUnit,
          originAssetId,
        },
        accountId,
      );
      const result = await executeIntentTransfer(
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
      setStep(ok ? "success" : "error");
      if (!ok) setErrorMessage(result.status);
    } catch (err) {
      setStep("error");
      setErrorMessage(err instanceof Error ? err.message : "Transfer failed");
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
    signAndSendTransaction,
  ]);

  const resetForm = useCallback(() => {
    setStep("form");
    setErrorMessage("");
    setRecipient("");
    setChainId("");
    setOriginTokenAssetId(defaultOriginAssetId ?? "");
    setAmount("");
    setDestinationTokenSymbol("USDC");
  }, [defaultOriginAssetId]);

  if (step === "sending") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="size-14 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4">
          <Icon name="sync" className="text-[var(--color-primary)] animate-spin" size={28} />
        </div>
        <p className="text-[var(--color-text-primary)] font-semibold">Sending payment…</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">Confirm in your wallet if prompted.</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <Icon name="check_circle" className="text-green-500" size={36} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Payment sent</h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          Your transfer is on its way to the destination chain.
        </p>
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
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-red-500" size={36} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Payment failed</h3>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">{errorMessage}</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => { setStep("form"); setErrorMessage(""); }}>Try again</Button>
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
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Recipient address
        </label>
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
            value={originTokenAssetId}
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
            value={destinationTokenSymbol}
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
