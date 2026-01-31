import { Icon } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";

type AppHeaderProps = {
  searchPlaceholder?: string;
  showSearch?: boolean;
  right?: React.ReactNode;
};

export function AppHeader({
  searchPlaceholder = "Search transactions, recipients...",
  showSearch = true,
  right,
}: AppHeaderProps) {
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
