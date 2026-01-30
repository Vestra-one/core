import { Icon } from "./Icon";
import { useTheme } from "../../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="size-10 flex items-center justify-center rounded-lg border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)] transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      {theme === "dark" ? (
        <Icon name="light_mode" size={22} />
      ) : (
        <Icon name="dark_mode" size={22} />
      )}
    </button>
  );
}
