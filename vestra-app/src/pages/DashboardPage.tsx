import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { ROUTES } from '../lib/constants'

export function DashboardPage() {
  return (
    <div className="flex h-full">
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 flex-1 min-w-0">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium">Total Treasury Balance</p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">1,240.50 NEAR</h2>
              <p className="text-lg text-slate-400 font-medium">≈ $8,642.00 USD</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all">
              <Icon name="add_circle" size={20} />
              Add Funds
            </button>
            <button type="button" className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)] text-slate-900 dark:text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all">
              Withdraw
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={ROUTES.paymentsManual} className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-xl hover:border-[var(--color-primary)]/50 transition-colors group block">
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
              <Icon name="send" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">New Payment</h3>
            <p className="text-slate-500 text-sm">Send NEAR or USDC to any address instantly.</p>
          </Link>
          <Link to={ROUTES.paymentsBulk} className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-xl hover:border-[var(--color-primary)]/50 transition-colors group block">
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
              <Icon name="cloud_upload" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Bulk Upload</h3>
            <p className="text-slate-500 text-sm">Upload CSV or JSON for mass distribution.</p>
          </Link>
          <Link to={ROUTES.paymentsScheduled} className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-xl hover:border-[var(--color-primary)]/50 transition-colors group block">
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
              <Icon name="calendar_month" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Schedule Payment</h3>
            <p className="text-slate-500 text-sm">Set up recurring or future-dated transfers.</p>
          </Link>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h3>
            <button type="button" className="text-[var(--color-primary)] text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-background-darker)]/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-darker)]">
                <tr className="bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-primary)]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                        <Icon name="diversity_3" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Payroll - Oct 2023</p>
                        <p className="text-xs text-slate-500">100 Recipients</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">Oct 24, 14:20</td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-900 dark:text-white">450.00 NEAR</p>
                    <p className="text-xs text-slate-500">≈ $3,150.00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 uppercase">Processing</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Icon name="expand_less" className="text-slate-400" size={24} />
                  </td>
                </tr>
                <tr className="bg-[var(--color-background-darker)]/30">
                  <td colSpan={5} className="px-6 py-4">
                    <div className="pl-12 space-y-3">
                      {[
                        { name: 'alice_doe.near', amount: '4.50 NEAR', status: 'Success', statusColor: 'text-green-500', icon: 'check_circle' as const },
                        { name: 'bob_smith.near', amount: '4.50 NEAR', status: 'Pending', statusColor: 'text-yellow-500', icon: 'pending' as const },
                        { name: 'carol_white.near', amount: '4.50 NEAR', status: 'Queued', statusColor: 'text-slate-500', icon: 'schedule' as const },
                      ].map((r) => (
                        <div key={r.name} className="flex items-center justify-between py-2 border-b border-[var(--color-border-darker)]/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="size-6 rounded-full bg-slate-700" />
                            <p className="text-sm font-medium">{r.name}</p>
                          </div>
                          <div className="flex items-center gap-8">
                            <p className="text-sm font-bold">{r.amount}</p>
                            <span className={`flex items-center gap-1 text-xs font-semibold ${r.statusColor}`}>
                              <Icon name={r.icon} size={18} />
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-500 italic pt-2">+ 97 more recipients...</p>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-[var(--color-border-darker)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <Icon name="person" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Transfer to Contractor</p>
                        <p className="text-xs text-slate-500">dev_ops.near</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-400">Oct 23, 09:15</td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-900 dark:text-white">25.00 NEAR</p>
                    <p className="text-xs text-slate-500">≈ $175.00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">Completed</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Icon name="expand_more" className="text-slate-400" size={24} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside className="hidden lg:flex w-96 border-l border-[var(--color-border-darker)] bg-[var(--color-surface-dark)] flex-col shrink-0 shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border-darker)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activity Details</h2>
          <button type="button" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
            <div className="size-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Icon name="history" size={24} />
            </div>
            <div>
              <p className="text-yellow-500 font-bold uppercase text-[10px] tracking-widest">Processing</p>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Payroll - Oct 2023</h4>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intent ID</p>
              <div className="flex items-center justify-between p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <code className="text-xs text-[var(--color-primary)] truncate mr-2">PAY-INTENT-7829-XQ</code>
                <Icon name="content_copy" className="text-slate-500 cursor-pointer hover:text-slate-900 dark:hover:text-white" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Hash</p>
              <div className="flex items-center justify-between p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <code className="text-xs text-slate-300 truncate mr-2">0x71C765...6D91</code>
                <Icon name="open_in_new" className="text-[var(--color-primary)] cursor-pointer" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Destination Network</p>
              <div className="flex items-center gap-3 p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <div className="size-6 bg-white rounded-full flex items-center justify-center shrink-0">
                  <svg className="size-4" fill="black" viewBox="0 0 24 24"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Ethereum (Mainnet)</p>
                <span className="ml-auto text-[10px] text-slate-500 px-2 py-0.5 border border-[var(--color-border-darker)] rounded bg-[var(--color-surface-dark)] shrink-0">Via Rainbow Bridge</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Execution Timeline</p>
            <div className="relative pl-6 space-y-6 border-l border-[var(--color-border-darker)] ml-2">
              {[
                { label: 'Intent Created', time: 'Oct 24, 2023 • 14:20:05', done: true },
                { label: 'Approval Secured (2/2)', time: 'Oct 24, 2023 • 14:22:12', done: true },
                { label: 'Transmitting to Bridge', time: 'Oct 24, 2023 • 14:25:30', done: false },
              ].map((step) => (
                <div key={step.label} className="relative">
                  <div className={`absolute -left-[31px] top-0 size-4 rounded-full border-4 border-[var(--color-surface-dark)] ${step.done ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{step.label}</p>
                  <p className="text-[10px] text-slate-500">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[var(--color-border-darker)] bg-[var(--color-background-darker)]/30">
          <button type="button" className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)] py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white">
            <Icon name="download" size={20} />
            Download Receipt
          </button>
        </div>
      </aside>
    </div>
  )
}
