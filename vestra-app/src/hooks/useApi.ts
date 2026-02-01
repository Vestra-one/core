import { useMemo } from "react";
import { useWallet } from "../contexts/WalletContext";
import { createApi, type Api } from "../lib/api";

/**
 * Returns an API client that sends X-Account-Id and Authorization: Bearer &lt;token&gt;
 * when a wallet is connected and a backend session exists. On 401 responses, clears the
 * session (token is cleared; createSession will be retried for the current account).
 *
 * Use in dashboard/authenticated components so the backend can scope and authorize requests.
 */
export function useApi(): Api {
  const { accountId, getToken, clearSession } = useWallet();
  return useMemo(
    () =>
      createApi(accountId, {
        getToken,
        onUnauthorized: clearSession,
      }),
    [accountId, getToken, clearSession],
  );
}
