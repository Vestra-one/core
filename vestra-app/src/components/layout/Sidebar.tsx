import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";
import { useWallet } from "../../contexts/WalletContext";
import { NEAR_NETWORK } from "../../lib/near";
import { ROUTES } from "../../lib/constants";

function truncateAccountId(accountId: string, head = 8, tail = 4): string {
  if (accountId.length <= head + tail) return accountId;
  return `${accountId.slice(0, head)}…${accountId.slice(-tail)}`;
}

const PAYMENTS_PREFIX = "/payments";

/** Sidebar order: Dashboard → Payments (dropdown) → Treasury → Contacts → Analytics */
const paymentSubItems = [
  { to: ROUTES.paymentsManual, icon: "send", label: "New Payment" },
  { to: ROUTES.paymentsScheduled, icon: "calendar_month", label: "Scheduled Payments" },
  { to: ROUTES.paymentsHistory, icon: "history", label: "Payment History" },
  { to: ROUTES.paymentsBulk, icon: "upload_file", label: "Bulk Upload" },
  { to: ROUTES.paymentsManualInvoice, icon: "description", label: "Upload Invoice" },
] as const;

const navItemsAfterPayments = [
  { to: ROUTES.treasury, icon: "account_balance_wallet", label: "Treasury" },
  { to: ROUTES.contacts, icon: "group", label: "Contacts" },
  { to: ROUTES.analytics, icon: "analytics", label: "Analytics" },
] as const;

const navLinkClass = (isActive: boolean) =>
  `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-button)] transition-colors duration-200 ${
    isActive
      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 hover:text-[var(--color-text-primary)]"
  }`;

export function Sidebar() {
  const { accountId } = useWallet();
  const location = useLocation();
  const isPaymentsArea = location.pathname.startsWith(PAYMENTS_PREFIX);
  const [paymentsExpanded, setPaymentsExpanded] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevWasPayments = prevPathRef.current.startsWith(PAYMENTS_PREFIX);
    const nowPayments = isPaymentsArea;
    if (!prevWasPayments && nowPayments) {
      setPaymentsExpanded(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, isPaymentsArea]);

  const paymentsOpen = paymentsExpanded;

  return (
    <aside className="w-64 border-r border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex flex-col shrink-0 transition-colors duration-200">
      <div className="p-6 flex items-center gap-3">
        <Logo showLink />
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
        <NavLink
          to={ROUTES.dashboard}
          end
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <Icon name="dashboard" size={22} />
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => setPaymentsExpanded((v) => !v)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-[var(--radius-button)] transition-colors duration-200 ${navLinkClass(isPaymentsArea)}`}
            aria-expanded={paymentsOpen}
            aria-controls="sidebar-payments-menu"
          >
            <span className="flex items-center gap-3">
              <Icon name="payments" size={22} />
              <span className="text-sm font-medium">Payments</span>
            </span>
            <Icon
              name={paymentsOpen ? "expand_less" : "expand_more"}
              size={20}
              className="text-[var(--color-text-muted)] shrink-0"
            />
          </button>
          <div
            id="sidebar-payments-menu"
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              paymentsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
            aria-hidden={!paymentsOpen}
          >
            <div className="overflow-hidden">
              <div className="mt-0.5 ml-4 pl-3 border-l border-[var(--color-border-darker)] space-y-0.5">
                {paymentSubItems.map(({ to, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-button)] transition-colors duration-200 text-sm ${
                        isActive
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 hover:text-[var(--color-text-primary)]"
                      }`
                    }
                  >
                    <Icon name={icon} size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {navItemsAfterPayments.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <Icon name={icon} size={22} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--color-border-darker)] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-darker)]/80 transition-colors cursor-pointer mb-2">
          <Icon name="settings" size={22} />
          <span className="text-sm font-medium">Settings</span>
        </div>
        {accountId && (
          <div
            className="flex items-center gap-3 p-2 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)]"
            title={accountId}
          >
            <div className="size-8 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[var(--color-text-primary)]">
                {truncateAccountId(accountId)}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate capitalize">
                NEAR • {NEAR_NETWORK}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
