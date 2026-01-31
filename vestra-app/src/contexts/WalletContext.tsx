import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import type { WalletSelector } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { NEAR_CONTRACT_ID, NEAR_NETWORK } from "../lib/near";

import "@near-wallet-selector/modal-ui/styles.css";

type WalletContextValue = {
  /** Current NEAR account ID when connected, null otherwise. */
  accountId: string | null;
  /** True when wallet selector/modal are still initializing. */
  loading: boolean;
  /** Open the wallet selection modal (connect flow). */
  connect: () => void;
  /** Sign out from the current wallet. */
  disconnect: () => Promise<void>;
  /** True when at least one account is connected. */
  isConnected: boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getActiveAccountId(
  selector: WalletSelector | null
): string | null {
  if (!selector) return null;
  const state = selector.store.getState();
  const active = state.accounts.find((a) => a.active);
  return active?.accountId ?? state.accounts[0]?.accountId ?? null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const instance = await setupWalletSelector({
          network: NEAR_NETWORK,
          modules: [setupMyNearWallet()],
        });
        if (cancelled) return;

        const modalInstance = setupModal(instance, {
          contractId: NEAR_CONTRACT_ID,
          theme: "dark",
        });
        if (cancelled) return;

        setSelector(instance);
        setModal(modalInstance);
        setAccountId(getActiveAccountId(instance));

        const sub = instance.store.observable.subscribe((state) => {
          if (cancelled) return;
          const active = state.accounts.find((a) => a.active);
          const id = active?.accountId ?? state.accounts[0]?.accountId ?? null;
          setAccountId(id);
        });

        return () => {
          sub.unsubscribe();
        };
      } catch (err) {
        if (!cancelled) {
          console.error("Wallet selector init failed:", err);
          setAccountId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(() => {
    modal?.show();
  }, [modal]);

  const disconnect = useCallback(async () => {
    if (!selector) return;
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
    } catch (err) {
      console.error("Wallet signOut failed:", err);
    }
  }, [selector]);

  const value = useMemo<WalletContextValue>(
    () => ({
      accountId,
      loading,
      connect,
      disconnect,
      isConnected: accountId != null && accountId.length > 0,
    }),
    [accountId, loading, connect, disconnect]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
