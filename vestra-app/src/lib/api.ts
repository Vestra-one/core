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
  throw new Error(
    "VITE_API_URL is not set. Copy .env.example to .env and set VITE_API_URL.",
  );
};

export const apiBaseUrl = getBaseUrl();

/** Header sent with requests when a wallet is connected; backend can use it for scoping. */
export const ACCOUNT_ID_HEADER = "X-Account-Id";

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
};

async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, accountId, ...init } = config;
  const url = new URL(
    path.startsWith("http")
      ? path
      : `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`,
  );
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

function bindAccountId(accountId: string | null): Api {
  const auth: RequestConfig = accountId ? { accountId } : {};
  return {
    get: <T>(path: string, config?: RequestConfig) =>
      request<T>(path, { ...config, ...auth, method: "GET" }),

    post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...auth,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...auth,
        method: "PUT",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
      request<T>(path, {
        ...config,
        ...auth,
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }),

    delete: <T>(path: string, config?: RequestConfig) =>
      request<T>(path, { ...config, ...auth, method: "DELETE" }),
  };
}

/** Unauthenticated API client (no X-Account-Id). Use for public endpoints. */
export const api: Api = bindAccountId(null);

/**
 * API client that sends X-Account-Id on every request when accountId is set.
 * Use in dashboard/authenticated flows so the backend can scope by account.
 */
export function createApi(accountId: string | null): Api {
  return bindAccountId(accountId);
}
