import { useWallet } from "../../contexts/WalletContext";
import { Icon } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";

type AppHeaderProps = {
  searchPlaceholder?: string;
  showSearch?: boolean;
  right?: React.ReactNode;
};

function truncateAccountId(accountId: string, head = 6, tail = 4): string {
  if (accountId.length <= head + tail) return accountId;
  return `${accountId.slice(0, head)}…${accountId.slice(-tail)}`;
}

export function AppHeader({
  searchPlaceholder = "Search transactions, recipients...",
  showSearch = true,
  right,
}: AppHeaderProps) {
  const { accountId, isConnected, loading, connect, disconnect } = useWallet();

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
        <ThemeToggle />
        {right ?? (
          <>
            {isConnected && accountId ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={connect}
                  className="flex h-10 items-center rounded-[var(--radius-button)] border border-[var(--color-border-darker)] bg-[var(--color-surface-dark)] px-4 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-border-darker)]/80 transition-colors"
                  title={accountId}
                >
                  {truncateAccountId(accountId)}
                </button>
                <button
                  type="button"
                  onClick={() => void disconnect()}
                  className="flex h-10 items-center rounded-[var(--radius-button)] border border-[var(--color-border-darker)] px-4 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={connect}
                disabled={loading}
                className="flex h-10 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-card)] transition-colors disabled:opacity-60"
              >
                {loading ? "Loading…" : "Connect Wallet"}
              </button>
            )}
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
