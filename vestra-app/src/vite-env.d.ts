/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /** Set to "true" to enable MSW in development */
  readonly VITE_USE_MSW?: string;
  readonly VITE_RELAYER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@near-wallet-selector/modal-ui";
declare module "@near-js/transactions";
declare module "@near-js/providers";
declare module "react-hook-form";
