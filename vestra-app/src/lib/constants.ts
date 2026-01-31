export const APP_NAME = "Vestra";
export const PRIMARY_COLOR = "#4f46e5";

/** NEAR wallet install links (Chrome / extension store) */
export const NEAR_WALLET_INSTALL = {
  meteor: "https://chromewebstore.google.com/detail/meteor-wallet/pcndjhkinnkaohffealmlmhaepkpmgkb",
  sender: "https://chromewebstore.google.com/detail/sender-wallet/epapihdplajcdnnkdeiahlgigofloibg",
} as const;

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  treasury: "/treasury",
  onboarding: "/onboarding",
  paymentsBulk: "/payments/bulk",
  paymentsManual: "/payments/manual",
  paymentsManualInvoice: "/payments/manual-invoice",
  paymentsScheduled: "/payments/scheduled",
  contacts: "/contacts",
  analytics: "/analytics",
} as const;
