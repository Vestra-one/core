import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { useWallet } from "../../contexts/WalletContext";
import { apiBaseUrl } from "../../lib/api";
import { parseInvoice, type ParsedInvoiceLine } from "../../lib/invoice-api";

export type UploadInvoiceButtonProps = {
  /** Called with extracted lines when parse succeeds. Use to fill form(s). */
  onParsed: (lines: ParsedInvoiceLine[]) => void;
  /** Optional: called when parse or upload fails. */
  onError?: (message: string) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Button label when idle. */
  children?: React.ReactNode;
};

/**
 * Button that opens a file picker for PDF invoices, calls the parse API,
 * and passes the extracted lines to onParsed. Use on single or batch payment forms.
 */
export function UploadInvoiceButton({
  onParsed,
  onError,
  disabled = false,
  variant = "secondary",
  size = "sm",
  className,
  children = "Upload Invoice",
}: UploadInvoiceButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { accountId, getToken, clearSession } = useWallet();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      onError?.("");
      setIsUploading(true);
      try {
        const res = await parseInvoice(file, {
          apiBaseUrl,
          getToken,
          accountId,
          onUnauthorized: clearSession,
        });
        if (res.lines.length === 0) {
          onError?.("No payment lines found in the invoice.");
          return;
        }
        onParsed(res.lines);
      } catch (err) {
        const apiErr = err as { status?: number; body?: { error?: string } };
        let message =
          typeof apiErr?.body?.error === "string"
            ? apiErr.body.error
            : err instanceof Error
              ? err.message
              : "Failed to parse invoice";
        if (apiErr?.status === 404) {
          message =
            "Invoice parse endpoint not found. Ensure the API is running (e.g. vestra-api on port 3032) and VITE_API_URL is set in .env.";
        }
        onError?.(message);
      } finally {
        setIsUploading(false);
      }
    },
    [accountId, getToken, clearSession, onParsed, onError],
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isUploading}
        leftIcon={<Icon name="description" size={18} />}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? "Parsing…" : children}
      </Button>
    </>
  );
}
