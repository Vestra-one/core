import { useMemo } from "react";
import { useWallet } from "../contexts/WalletContext";
import { createApi, type Api } from "../lib/api";

/**
 * Returns an API client that sends X-Account-Id with the current wallet's
 * accountId on every request. Use in dashboard/authenticated components so
 * the backend can scope data by account.
 *
 * When not connected, requests are sent without the header (same as unauthenticated api).
 */
export function useApi(): Api {
  const { accountId } = useWallet();
  return useMemo(() => createApi(accountId), [accountId]);
}
