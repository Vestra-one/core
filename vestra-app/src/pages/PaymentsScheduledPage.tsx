import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { ROUTES } from '../lib/constants'

const schedules = [
  { name: 'Monthly Engineering Payroll', icon: 'engineering', frequency: 'Monthly', nextRun: 'Oct 01, 2023', nextRunSub: '6 days from now', amount: '$45,200.00', recipients: '18 Recipients', active: true },
  { name: 'AWS Subscription', icon: 'cloud', frequency: 'Monthly', nextRun: 'Sep 28, 2023', nextRunSub: 'In 3 days', amount: '$4,820.00', recipients: '1 Recipient', active: true },
  { name: 'Weekly Office Maintenance', icon: 'cleaning_services', frequency: 'Weekly', nextRun: 'Sep 25, 2023', nextRunSub: 'Today', amount: '$1,200.00', recipients: '2 Recipients', active: false },
]

export function PaymentsScheduledPage() {
  const [modalOpen, setModalOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background-darker)] text-slate-900 dark:text-white">
      <aside className="w-64 border-r border-[var(--color-border-darker)] flex flex-col bg-[var(--color-background-darker)] shrink-0">
        <div className="p-6 flex items-center gap-3">
          <Link to={ROUTES.dashboard} className="bg-[var(--color-primary)] size-10 rounded-lg flex items-center justify-center text-white">
            <Icon name="payments" size={24} />
          </Link>
          <div>
            <h1 className="text-base font-bold leading-none">Vestra</h1>
            <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to={ROUTES.dashboard} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-[#282839] rounded-lg transition-colors">
            <Icon name="dashboard" size={22} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <span className="flex items-center gap-3 px-3 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
            <Icon name="credit_card" size={22} />
            <span className="text-sm font-semibold">Payments</span>
          </span>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-[#282839] rounded-lg transition-colors">
            <Icon name="group" size={22} />
            <span className="text-sm font-medium">Recipients</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-[#282839] rounded-lg transition-colors">
            <Icon name="bar_chart" size={22} />
            <span className="text-sm font-medium">Reports</span>
          </a>
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">System</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-[#282839] rounded-lg transition-colors">
            <Icon name="settings" size={22} />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-[#282839]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a2e]">
            <div className="size-8 rounded-full bg-slate-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 truncate">Finance Lead</p>
            </div>
            <Icon name="unfold_more" className="text-slate-400 text-sm" size={18} />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-[#282839] bg-[#101022] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Payments</h2>
            <nav className="flex items-center gap-6">
              <Link to={ROUTES.paymentsManual} className="text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors">Activity</Link>
              <span className="text-sm font-bold text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] py-5">Scheduled</span>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors">Recurring</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors">Approval Queue</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative hidden lg:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search schedules..." className="bg-[#282839] border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
            </div>
            <button type="button" className="size-10 rounded-lg flex items-center justify-center bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-slate-900 dark:text-white">
              <Icon name="notifications" size={24} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#101022]">
          <div className="max-w-6xl mx-auto p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-slate-400">Payments</span>
              <span className="text-xs text-slate-500">/</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white">Scheduled Payments</span>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Scheduled Payments</h1>
                <p className="text-slate-500 mt-1">Automate your payroll and recurring vendor disbursements.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(true)} className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 transition-all">
                <Icon name="add" size={20} />
                Create Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#111118] border border-[#3b3b54] rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Active Schedules</p>
                  <Icon name="calendar_today" className="text-[var(--color-primary)]" size={20} />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                  <p className="text-xs font-medium text-green-500 flex items-center">+2.4%</p>
                </div>
              </div>
              <div className="bg-[#111118] border border-[#3b3b54] rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Total Monthly Outflow</p>
                  <Icon name="account_balance_wallet" className="text-[var(--color-primary)]" size={20} />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$142,500.00</p>
                  <p className="text-xs font-medium text-green-500">+5.1%</p>
                </div>
              </div>
              <div className="bg-[#111118] border border-[#3b3b54] rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Next 7 Days</p>
                  <Icon name="event_upcoming" className="text-[var(--color-primary)]" size={20} />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$32,400.00</p>
                  <p className="text-xs font-medium text-orange-500">-1.2%</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111118] border border-[#3b3b54] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#282839] bg-slate-900/20">
                      {['Payment Name', 'Frequency', 'Next Run', 'Amount', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282839]">
                    {schedules.map((s) => (
                      <tr key={s.name} className="group hover:bg-[#1a1a2e] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                              <Icon name={s.icon} size={18} />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#282839] text-slate-500">{s.frequency}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{s.nextRun}</p>
                          <p className="text-[11px] text-slate-400">{s.nextRunSub}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{s.amount}</p>
                          <p className="text-[11px] text-slate-400">{s.recipients}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button type="button" role="switch" className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${s.active ? 'bg-[var(--color-primary)]' : 'bg-[#282839]'}`}>
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${s.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-all">
                              <Icon name="edit" size={18} />
                            </button>
                            {s.active ? (
                              <button type="button" className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded transition-all">
                                <Icon name="pause_circle" size={18} />
                              </button>
                            ) : (
                              <button type="button" className="p-1.5 text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded transition-all">
                                <Icon name="play_circle" size={18} />
                              </button>
                            )}
                            <button type="button" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                              <Icon name="delete" size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[#282839] flex items-center justify-between">
                <p className="text-xs text-slate-500">Showing 3 of 12 schedules</p>
                <div className="flex gap-2">
                  <button type="button" disabled className="px-3 py-1 text-xs font-semibold rounded border border-[#3b3b54] disabled:opacity-50">Previous</button>
                  <button type="button" className="px-3 py-1 text-xs font-semibold rounded border border-[#3b3b54]">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-[#111118] w-full max-w-xl rounded-2xl shadow-2xl border border-[#3b3b54] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#282839] flex justify-between items-center bg-slate-900/40">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Schedule</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure a new automated disbursement.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Icon name="close" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule Name</label>
                <input type="text" defaultValue="Q4 Contractor Payments" className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Frequency</label>
                  <select className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none text-slate-900 dark:text-white">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                  <div className="relative">
                    <Icon name="calendar_month" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    <input type="text" defaultValue="Oct 01, 2023" className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-slate-900 dark:text-white pr-10" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipients</label>
                <div className="bg-[#1a1a2e] border border-[#282839] rounded-lg p-2.5 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-1 px-2 rounded-md text-xs font-bold">
                    Sarah Chen <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-1 px-2 rounded-md text-xs font-bold">
                    James Wilson <span className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                  </div>
                  <input type="text" placeholder="Add more..." className="flex-1 min-w-[120px] bg-transparent border-none p-0 text-sm focus:ring-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">Amount per Recipient</label>
                  <button type="button" className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/20 px-2 py-0.5 rounded uppercase">Bulk Edit</button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold">$</span>
                  <input type="text" defaultValue="2,400.00" className="w-full bg-[#111118] border border-[var(--color-primary)]/30 rounded-lg pl-8 pr-4 py-3 text-lg font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                <p className="mt-3 text-[11px] text-slate-500 flex justify-between">
                  <span>Estimated total per run:</span>
                  <span className="font-bold text-slate-900 dark:text-white">$4,800.00</span>
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-900/40 border-t border-[#282839] flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-[var(--color-border-darker)] transition-all">Discard</button>
              <button type="button" className="bg-[var(--color-primary)] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:opacity-90 transition-all">Create Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
