import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { UploadInvoiceButton } from "./UploadInvoiceButton";
import type { ParsedInvoiceLine } from "../../lib/invoice-api";
import { useWallet } from "../../contexts/WalletContext";
import { useSupportedTokens, getDestinationAssetId } from "../../hooks/useSupportedTokens";
import {
  requestQuote,
  executeIntentTransfer,
  executeIntentTransferViaRelayer,
  buildTransferDelegateParams,
  DEFAULT_ORIGIN_ASSET,
} from "../../lib/intents";
import { toSmallestUnit } from "../../lib/amountUtils";

const WNEAR_DECIMALS = 24;

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

export function BatchManualEntry() {
  const {
    accountId,
    isConnected,
    connect,
    signAndSendTransaction,
    relayerUrl,
    signDelegateActionForMetaTx,
  } = useWallet();
  const { chains, tokens, isLoading: tokensLoading } = useSupportedTokens();
  const [rows, setRows] = useState<ManualPaymentRow[]>(() => [emptyRow()]);
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<Array<{ rowId: string; ok: boolean; message: string }>>([]);
  const [invoiceError, setInvoiceError] = useState("");

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

  const fillFromInvoice = useCallback(
    (lines: ParsedInvoiceLine[]) => {
      setRows((prev) => {
        const filled = prev.filter((r) => r.recipient.trim() !== "" || r.amount.trim() !== "");
        const newRows = lines.map((line) => {
          const chainId = line.chain
            ? chains.find((c) => c.label.toLowerCase() === line.chain!.toLowerCase())?.id ?? ""
            : "";
          return {
            ...emptyRow(),
            recipient: line.address,
            amount: line.amount,
            chainId,
          };
        });
        return [...filled, ...newRows, emptyRow()];
      });
      setInvoiceError("");
    },
    [chains],
  );

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
        const originAssetId = DEFAULT_ORIGIN_ASSET;
        const useGasless = relayerUrl && signDelegateActionForMetaTx && accountId;
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
  }, [
    isConnected,
    accountId,
    connect,
    validRows,
    tokens,
    signAndSendTransaction,
    relayerUrl,
    signDelegateActionForMetaTx,
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full min-w-0">
        <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
              Batch Manual Entry
            </h3>
            <span className="flex items-center gap-2">
              <UploadInvoiceButton
                onParsed={fillFromInvoice}
                onError={setInvoiceError}
                variant="secondary"
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
          {invoiceError && (
            <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <Icon name="error" size={18} />
              {invoiceError}
            </div>
          )}
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
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
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
                          <span className="text-xs font-bold text-[var(--color-text-muted)]">wNEAR</span>
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
            <Button variant="secondary" size="sm" leftIcon={<Icon name="add" size={18} />} onClick={addRow}>
              Add row
            </Button>
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
          <h2 className="text-lg font-bold mb-6 text-[var(--color-text-primary)]">Payment Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-muted)]">Total recipients</span>
              <span className="font-bold text-[var(--color-text-primary)]">{totalRecipients}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-[var(--color-text-muted)]">Total amount</span>
              <div className="text-right">
                <p className="font-bold text-[var(--color-text-primary)]">{totalAmountDisplay} wNEAR</p>
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
              {!isConnected ? "Connect Wallet" : sending ? "Sending…" : "Send Now"}
            </Button>
            <Button variant="secondary" className="w-full h-12" leftIcon={<Icon name="calendar_today" size={20} />}>
              Schedule Payment
            </Button>
          </div>
          <div className="mt-6 flex items-start gap-3 p-3 bg-[var(--color-primary)]/10 rounded-lg">
            <Icon name="info" className="text-blue-500 shrink-0" size={20} />
            <p className="text-[11px] leading-tight text-blue-300">
              Transfers use NEAR Intents: you send wNEAR from NEAR; recipients receive tokens on their chosen chain.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
