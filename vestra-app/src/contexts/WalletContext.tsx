import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import type { WalletSelector } from "@near-wallet-selector/core";
import { actionCreators } from "@near-js/transactions";
import type { FinalExecutionOutcome } from "@near-js/types";
import { createSession, signOut as signOutSession } from "../lib/auth-api";
import { NEAR_CONTRACT_ID, NEAR_NETWORK } from "../lib/near";
import type { SignDelegateAction } from "../lib/intents/metaTx";

import "@near-wallet-selector/modal-ui/styles.css";

/** Relayer URL for NEP-366 gasless (meta) transactions (Pagoda relayer). */
const RELAYER_URL: string | null =
  (import.meta.env.VITE_RELAYER_URL as string)?.trim() || null;

/** High-level action for signAndSendTransaction (converted to NEAR actions inside context). */
export type WalletAction =
  | { type: "Transfer"; deposit: string }
  | { type: "FunctionCall"; methodName: string; args: object; gas: string; deposit: string };

export type SignAndSendParams = {
  receiverId: string;
  actions: WalletAction[];
};

type WalletContextValue = {
  /** Current NEAR account ID when connected, null otherwise. */
  accountId: string | null;
  /** True when wallet selector/modal are still initializing. */
  loading: boolean;
  /** Open the wallet selection modal (connect flow). */
  connect: () => void;
  /** Sign out from the current wallet and invalidate backend session. */
  disconnect: () => Promise<void>;
  /** True when at least one account is connected. */
  isConnected: boolean;
  /** Current backend session token, if any. Used by API client for Authorization header. */
  getToken: () => string | null;
  /** Clear backend session (e.g. on 401). Does not disconnect wallet. */
  clearSession: () => void;
  /** Sign and send a NEAR transaction (e.g. for intent transfer deposit). Resolves with outcome or throws. */
  signAndSendTransaction: (params: SignAndSendParams) => Promise<FinalExecutionOutcome | void>;
  /** If set, relayer URL for NEP-366 gasless deposit (Pagoda relayer). */
  relayerUrl: string | null;
  /** When set, signs DelegateAction for meta tx (gasless). Provide via WalletProvider when using FastAuth or a wallet that supports sign-only. */
  signDelegateActionForMetaTx: SignDelegateAction | null;
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

export type WalletProviderProps = {
  children: ReactNode;
  /** Optional. When using gasless (NEP-366), provide a signer (e.g. from FastAuth or wallet that supports sign-only). */
  signDelegateActionForMetaTx?: SignDelegateAction | null;
};

export function WalletProvider({ children, signDelegateActionForMetaTx = null }: WalletProviderProps) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<Awaited<ReturnType<typeof setupModal>> | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  sessionTokenRef.current = sessionToken;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const instance = await setupWalletSelector({
          network: NEAR_NETWORK,
          modules: [setupMyNearWallet()],
          createAccessKeyFor: NEAR_CONTRACT_ID,
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

  const clearSession = useCallback(() => {
    setSessionToken(null);
  }, []);

  useEffect(() => {
    if (!accountId) {
      clearSession();
      return;
    }
    if (sessionToken) return;
    let cancelled = false;
    createSession(accountId)
      .then((res) => {
        if (!cancelled) setSessionToken(res.token);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Session create failed:", err);
          setSessionToken(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accountId, sessionToken, clearSession]);

  const connect = useCallback(() => {
    modal?.show();
  }, [modal]);

  const getToken = useCallback(() => sessionTokenRef.current, []);

  const disconnect = useCallback(async () => {
    const token = sessionTokenRef.current;
    if (token) {
      try {
        await signOutSession(token);
      } catch (err) {
        console.error("Backend sign-out failed:", err);
      }
      setSessionToken(null);
    }
    if (selector) {
      try {
        const wallet = await selector.wallet();
        await wallet.signOut();
      } catch (err) {
        console.error("Wallet signOut failed:", err);
      }
    }
  }, [selector]);

  const signAndSendTransaction = useCallback(
    async (params: SignAndSendParams): Promise<FinalExecutionOutcome | void> => {
      if (!selector) throw new Error("Wallet not connected");
      const wallet = await selector.wallet();
      const actions = params.actions.map((a) => {
        if (a.type === "Transfer") {
          return actionCreators.transfer(BigInt(a.deposit));
        }
        return actionCreators.functionCall(
          a.methodName,
          a.args,
          BigInt(a.gas),
          BigInt(a.deposit),
        );
      });
      return wallet.signAndSendTransaction({
        receiverId: params.receiverId,
        actions,
      }) as Promise<FinalExecutionOutcome | void>;
    },
    [selector],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      accountId,
      loading,
      connect,
      disconnect,
      isConnected: accountId != null && accountId.length > 0,
      getToken,
      clearSession,
      signAndSendTransaction,
      relayerUrl: RELAYER_URL,
      signDelegateActionForMetaTx: signDelegateActionForMetaTx ?? null,
    }),
    [
      accountId,
      loading,
      connect,
      disconnect,
      getToken,
      clearSession,
      signAndSendTransaction,
      signDelegateActionForMetaTx,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components -- hook is the primary API alongside WalletProvider */
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
