import type { WalletSelector } from "@near-wallet-selector/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type NearWalletContextValue = {
  /** Currently connected NEAR account id (e.g. "user.near") or null */
  accountId: string | null;
  /** All connected accounts */
  accounts: Array<{ accountId: string; publicKey?: string }>;
  /** True once selector/modal are initialized */
  isReady: boolean;
  /** Open the wallet connection modal */
  signIn: () => void;
  /** Disconnect current wallet */
  signOut: () => Promise<void>;
  /** Error during init (e.g. unsupported browser) */
  error: string | null;
};

const NearWalletContext = createContext<NearWalletContextValue | null>(null);

export function NearWalletProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Array<{ accountId: string; publicKey?: string }>>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ show(): void } | null>(null);
  const [selector, setSelector] = useState<WalletSelector | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    void import("../lib/near-wallet-config").then(({ initNearWallet }) =>
      initNearWallet(),
    )
      .then(({ selector: s, modal: m }) => {
        setSelector(s);
        setModal(m);

        const state = s.store.getState();
        const active = state.accounts.find((a) => a.active);
        setAccountId(active?.accountId ?? null);
        setAccounts(state.accounts.map((a) => ({ accountId: a.accountId, publicKey: a.publicKey })));

        const sub = s.store.observable.subscribe((nextState) => {
          const activeAccount = nextState.accounts.find((a) => a.active);
          setAccountId(activeAccount?.accountId ?? null);
          setAccounts(nextState.accounts.map((a) => ({ accountId: a.accountId, publicKey: a.publicKey })));
        });
        unsubscribe = () => sub.unsubscribe();
        setIsReady(true);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to initialize NEAR wallet");
      });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(() => {
    if (modal) modal.show();
  }, [modal]);

  const signOut = useCallback(async () => {
    if (!selector) return;
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
    } catch (e) {
      console.error("NEAR signOut error:", e);
    }
  }, [selector]);

  const value = useMemo<NearWalletContextValue>(
    () => ({
      accountId,
      accounts,
      isReady,
      signIn,
      signOut,
      error,
    }),
    [accountId, accounts, isReady, signIn, signOut, error],
  );

  return (
    <NearWalletContext.Provider value={value}>
      {children}
    </NearWalletContext.Provider>
  );
}

export function useNearWallet(): NearWalletContextValue {
  const ctx = useContext(NearWalletContext);
  if (!ctx) {
    throw new Error("useNearWallet must be used within NearWalletProvider");
  }
  return ctx;
}

export function useNearWalletOptional(): NearWalletContextValue | null {
  return useContext(NearWalletContext);
}
