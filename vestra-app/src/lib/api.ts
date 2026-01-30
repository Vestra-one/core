/**
 * API client and env config.
 * Base URL comes from VITE_API_URL; in test/dev you can use MSW to mock responses.
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL
  if (typeof url === 'string' && url !== '') {
    return url.replace(/\/$/, '')
  }
  // When using MSW only (no real backend), use current origin so handlers can intercept
  if (import.meta.env.VITE_USE_MSW === 'true') {
    return import.meta.env.DEV && typeof window !== 'undefined' ? window.location.origin : ''
  }
  throw new Error('VITE_API_URL is not set. Copy .env.example to .env and set VITE_API_URL.')
}

export const apiBaseUrl = getBaseUrl()

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestConfig = RequestInit & {
  params?: Record<string, string>
}

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { params, ...init } = config
  const url = new URL(path.startsWith('http') ? path : `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  const text = await res.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : undefined
  } catch {
    body = text
  }
  if (!res.ok) {
    throw new ApiError(res.statusText || `HTTP ${res.status}`, res.status, body)
  }
  return body as T
}

export const api = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'GET' }),

  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),

  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),

  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),

  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'DELETE' }),
}
