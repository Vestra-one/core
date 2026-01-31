import { useState, useRef, useEffect } from "react";
import { Icon } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";
import { WalletInstallLinks } from "../ui/WalletInstallLinks";
import { useNearWalletOptional } from "../../contexts/NearWalletContext";

type AppHeaderProps = {
  searchPlaceholder?: string;
  showSearch?: boolean;
  right?: React.ReactNode;
};

function truncateAccountId(accountId: string, head = 12, tail = 8) {
  if (accountId.length <= head + tail) return accountId;
  return `${accountId.slice(0, head)}…${accountId.slice(-tail)}`;
}

export function AppHeader({
  searchPlaceholder = "Search transactions, recipients...",
  showSearch = true,
  right,
}: AppHeaderProps) {
  const wallet = useNearWalletOptional();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [open]);

  return (
    <header className="h-16 border-b border-[var(--color-border-darker)] px-8 flex items-center justify-between bg-[var(--color-background-darker)]/90 dark:bg-[var(--color-background-darker)]/80 backdrop-blur-md sticky top-0 z-10 shrink-0 transition-colors duration-200">
      {showSearch && (
        <div className="flex items-center bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-button)] px-3 py-1.5 w-96 max-w-full shadow-[var(--shadow-card)]">
          <Icon name="search" className="text-[var(--color-text-muted)]" size={20} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[var(--color-text-muted)] ml-2 outline-none text-[var(--color-text-primary)]"
          />
        </div>
      )}
      <div className="flex items-center gap-4 ml-auto">
        {wallet && (
          <div className="relative" ref={ref}>
            {wallet.accountId ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  className="flex items-center gap-2 h-10 px-3 rounded-[var(--radius-button)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)]/80 transition-colors duration-200 text-[var(--color-text-secondary)] text-sm font-medium"
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  <Icon name="account_balance_wallet" size={18} />
                  <span className="max-w-[140px] truncate" title={wallet.accountId}>
                    {truncateAccountId(wallet.accountId)}
                  </span>
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-1 py-1 min-w-[180px] rounded-[var(--radius-button)] border border-[var(--color-border-darker)] bg-[var(--color-surface-dark)] shadow-[var(--shadow-card)] z-20">
                    <div className="px-3 py-2 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-darker)]">
                      {wallet.accountId}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        wallet.signOut();
                        setOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-border-darker)]/80"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-end gap-0.5">
                <button
                  type="button"
                  onClick={wallet.signIn}
                  disabled={!wallet.isReady}
                  className="h-10 px-4 rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold disabled:opacity-50"
                >
                  {wallet.isReady ? "Connect Wallet" : "Loading…"}
                </button>
                <WalletInstallLinks className="text-xs" />
              </div>
            )}
          </div>
        )}
        <ThemeToggle />
        {right ?? (
          <>
            <button
              type="button"
              className="size-10 flex items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)]/80 transition-colors duration-200 text-[var(--color-text-secondary)]"
            >
              <Icon name="notifications" size={22} />
            </button>
            <button
              type="button"
              className="size-10 flex items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)]/80 transition-colors duration-200 text-[var(--color-text-secondary)]"
            >
              <Icon name="help" size={22} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
