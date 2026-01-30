/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  /** Set to "true" to enable MSW in development */
  readonly VITE_USE_MSW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
