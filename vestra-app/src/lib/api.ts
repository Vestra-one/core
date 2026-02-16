/**
 * API client and env config.
 * Base URL comes from VITE_API_URL; in test/dev you can use MSW to mock responses.
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (typeof url === "string" && url !== "") {
    return url.replace(/\/$/, "");
  }
  // When using MSW only (no real backend), use current origin so handlers can intercept
  if (import.meta.env.VITE_USE_MSW === "true") {
    return import.meta.env.DEV && typeof window !== "undefined"
      ? window.location.origin
      : "";
  }
  // In dev, default to same origin so the app loads without .env; set VITE_API_URL or VITE_USE_MSW for real/mock API
  if (import.meta.env.DEV && typeof window !== "undefined") {
    return window.location.origin;
  }
  // In production without VITE_API_URL, return empty so the app still loads; API calls will no-op or 404
  return "";
};

export const apiBaseUrl = getBaseUrl();

/** Header sent with requests when a wallet is connected; backend can use it for scoping. */
export const ACCOUNT_ID_HEADER = "X-Account-Id";

/** Header sent when a backend session token is available. */
export const AUTHORIZATION_HEADER = "Authorization";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown | undefined;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  /** When set, sent as X-Account-Id so the backend can scope the request. */
  accountId?: string | null;
  /** When set, token is sent as Authorization: Bearer <token>. */
  getToken?: () => string | null;
  /** Called when the server responds 401; e.g. clear session and redirect. */
  onUnauthorized?: () => void;
};

async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, accountId, getToken, onUnauthorized, ...init } = config;
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  const base =
    apiBaseUrl !== ""
      ? apiBaseUrl
      : typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";
  const url = path.startsWith("http")
    ? new URL(path)
    : new URL(pathPart, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (accountId) {
    headers[ACCOUNT_ID_HEADER] = accountId;
  }
  const token = getToken?.();
  if (token) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${token}`;
  }
  const res = await fetch(url.toString(), {
    ...init,
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
      onUnauthorized?.();
    }
    throw new ApiError(
      res.statusText || `HTTP ${res.status}`,
      res.status,
      body,
    );
  }
  return body as T;
}

export type Api = {
  get: <T>(path: string, config?: RequestConfig) => Promise<T>;
  post: <T>(path: string, body?: unknown, config?: RequestConfig) => Promise<T>;
  put: <T>(path: string, body?: unknown, config?: RequestConfig) => Promise<T>;
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) => Promise<T>;
  delete: <T>(path: string, config?: RequestConfig) => Promise<T>;
};

export type CreateApiOptions = {
  getToken?: () => string | null;
  onUnauthorized?: () => void;
};

function bindAuth(
  accountId: string | null,
  options: CreateApiOptions = {},
): Api {
  const auth: RequestConfig = accountId ? { accountId } : {};
  const session: RequestConfig = {
    getToken: options.getToken,
    onUnauthorized: options.onUnauthorized,
  };
  const base = { ...auth, ...session };
  return {
    get: <T>(path: string, config?: RequestConfig) =>
      request<T>(path, { ...config, ...base, method: "GET" }),

    post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...base,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...base,
        method: "PUT",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...base,
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    delete: <T>(path: string, config?: RequestConfig) =>
      request<T>(path, { ...config, ...base, method: "DELETE" }),
  };
}

/** Unauthenticated API client (no X-Account-Id, no token). Use for public endpoints. */
export const api: Api = bindAuth(null);

/**
 * API client that sends X-Account-Id and optionally Bearer token on every request.
 * When getToken is provided, adds Authorization: Bearer <token>; on 401 calls onUnauthorized.
 */
export function createApi(
  accountId: string | null,
  options: CreateApiOptions = {},
): Api {
  return bindAuth(accountId, options);
}
