import { NavLink } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'
import { ROUTES } from '../../lib/constants'

const navItems = [
  { to: ROUTES.dashboard, icon: 'dashboard', label: 'Dashboard' },
  { to: ROUTES.paymentsBulk, icon: 'account_balance_wallet', label: 'Treasury' },
  { to: ROUTES.paymentsBulk, icon: 'upload_file', label: 'Bulk Upload' },
  { to: '#', icon: 'group', label: 'Contacts' },
  { to: '#', icon: 'analytics', label: 'Analytics' },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <Logo showLink />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to + icon}
            to={to}
            end={to === ROUTES.dashboard}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-slate-500 hover:bg-[var(--color-border-darker)]'
              }`
            }
          >
            <Icon name={icon} size={22} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-[var(--color-border-darker)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-[var(--color-border-darker)] transition-colors cursor-pointer mb-2">
          <Icon name="settings" size={22} />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)]">
          <div className="size-8 rounded-full bg-slate-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">Enterprise Treasury</p>
            <p className="text-[10px] text-slate-500 truncate">treasury.near</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
