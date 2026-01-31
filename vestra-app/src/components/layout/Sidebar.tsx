import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";
import { useNearWalletOptional } from "../../contexts/NearWalletContext";
import { ROUTES } from "../../lib/constants";

const navItems = [
  { to: ROUTES.dashboard, icon: "dashboard", label: "Dashboard" },
  { to: ROUTES.treasury, icon: "account_balance_wallet", label: "Treasury" },
  { to: ROUTES.paymentsBulk, icon: "upload_file", label: "Bulk Upload" },
  { to: ROUTES.contacts, icon: "group", label: "Contacts" },
  { to: ROUTES.analytics, icon: "analytics", label: "Analytics" },
];

export function Sidebar() {
  const wallet = useNearWalletOptional();
  return (
    <aside className="w-64 border-r border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex flex-col shrink-0 transition-colors duration-200">
      <div className="p-6 flex items-center gap-3">
        <Logo showLink />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon, label }, index) => (
          <NavLink
            key={to + icon}
            to={to}
            end={to === ROUTES.dashboard && index === 0}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-button)] transition-colors duration-200 ${
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 hover:text-[var(--color-text-primary)]"
              }`
            }
          >
            <Icon name={icon} size={22} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--color-border-darker)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 transition-colors cursor-pointer mb-2">
          <Icon name="settings" size={22} />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)]">
          <div className="size-8 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-[var(--color-text-primary)]">
              {wallet?.accountId ? "Connected" : "Enterprise Treasury"}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] truncate" title={wallet?.accountId ?? undefined}>
              {wallet?.accountId ?? "treasury.near"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
