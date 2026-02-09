/**
 * Invoice parse API: upload a PDF and get structured payment lines.
 * Uses FormData (multipart), so it cannot use the standard JSON api.post().
 * Call with apiBaseUrl, getToken, accountId from useWallet + api.ts so requests are authenticated.
 */

import {
  apiBaseUrl,
  ACCOUNT_ID_HEADER,
  AUTHORIZATION_HEADER,
  ApiError,
} from "./api";

/** Parsed invoice line: recipient chain, recipient address, amount with token. */
export type ParsedInvoiceLine = {
  chain?: string;
  address: string;
  amount: string;
  currency: string;
  description?: string;
};

export type InvoiceParseResponse = {
  lines: ParsedInvoiceLine[];
};

export type ParseInvoiceOptions = {
  apiBaseUrl?: string;
  getToken?: () => string | null;
  accountId?: string | null;
  onUnauthorized?: () => void;
};

const DEFAULT_BASE = apiBaseUrl;

/**
 * Upload a PDF file to POST /invoice/parse and return extracted payment lines.
 * Uses multipart/form-data with field name "file".
 */
export async function parseInvoice(
  file: File,
  options: ParseInvoiceOptions = {},
): Promise<InvoiceParseResponse> {
  const base = options.apiBaseUrl ?? DEFAULT_BASE;
  const url = `${base.replace(/\/$/, "")}/invoice/parse`;
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  const token = options.getToken?.();
  if (token) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${token}`;
  }
  if (options.accountId) {
    headers[ACCOUNT_ID_HEADER] = options.accountId;
  }

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    headers,
  });

  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      options.onUnauthorized?.();
    }
    throw new ApiError(
      res.statusText || `HTTP ${res.status}`,
      res.status,
      body,
    );
  }

  return body as InvoiceParseResponse;
}
