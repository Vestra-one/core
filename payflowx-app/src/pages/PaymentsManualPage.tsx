import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/layout/Logo'
import { ROUTES } from '../lib/constants'

const chains = [
  { address: '0x71C21BF1d32708136C185A0CEBAE72E042733A2', chain: 'Ethereum', chainColor: 'bg-blue-500', amount: '1.5', unit: 'ETH' },
  { address: '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', chain: 'Polygon', chainColor: 'bg-purple-500', amount: '500.0', unit: 'MATIC' },
]

export function PaymentsManualPage() {
  return (
    <div className="min-h-screen bg-[#101022] text-white flex flex-col">
      <header className="flex items-center justify-between border-b border-[#282839] px-6 lg:px-10 py-3 bg-[#101022] sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Logo showLink />
          <nav className="hidden md:flex items-center gap-9">
            <Link to={ROUTES.dashboard} className="text-slate-500 hover:text-[var(--color-primary)] text-sm font-medium transition-colors">Dashboard</Link>
            <span className="text-[var(--color-primary)] text-sm font-bold">Payments</span>
            <a href="#" className="text-slate-500 hover:text-[var(--color-primary)] text-sm font-medium transition-colors">Balances</a>
            <a href="#" className="text-slate-500 hover:text-[var(--color-primary)] text-sm font-medium transition-colors">Activity</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
          <div className="hidden sm:flex items-stretch rounded-lg h-10 max-w-64 bg-[#282839]">
            <span className="flex items-center justify-center pl-4 text-slate-400"><Icon name="search" size={20} /></span>
            <input type="text" placeholder="Search transactions..." className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 px-4 outline-none rounded-r-lg" />
          </div>
          <div className="flex gap-2">
            <button type="button" className="size-10 flex items-center justify-center rounded-lg bg-[#282839] text-white hover:bg-[#34344a] transition-colors">
              <Icon name="notifications" size={24} />
            </button>
            <button type="button" className="size-10 flex items-center justify-center rounded-lg bg-[#282839] text-white hover:bg-[#34344a] transition-colors">
              <Icon name="settings" size={24} />
            </button>
          </div>
          <div className="size-10 rounded-full bg-slate-600 border border-slate-500" />
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight">Payments</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create and manage your outgoing transfers</p>
          </div>
          <Link to={ROUTES.paymentsManualInvoice} className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all">
            <Icon name="upload_file" size={20} />
            <span className="truncate">Upload Invoice</span>
          </Link>
        </div>
        <div className="mb-8 border-b border-[#3b3b54] gap-8 flex">
          <span className="flex flex-col items-center justify-center border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] pb-3">
            <p className="text-sm font-bold tracking-tight">New Payment</p>
          </span>
          <Link to={ROUTES.paymentsScheduled} className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 pb-3 hover:text-white transition-all">
            <p className="text-sm font-bold tracking-tight">Scheduled Payments</p>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full min-w-0">
            <div className="bg-[#16162a] rounded-xl border border-[#282839] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#282839] bg-[#1c1c2e]">
                <h3 className="font-semibold text-sm">Batch Manual Entry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1c27]">
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/2">Recipient Address</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/4">Destination Chain</th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282839]">
                    {chains.map((row) => (
                      <tr key={row.address} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <input type="text" defaultValue={row.address} className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-700" placeholder="Paste 0x address or ENS..." />
                        </td>
                        <td className="px-6 py-4">
                          <button type="button" className="flex items-center justify-between gap-2 px-3 h-9 rounded-lg bg-[#282839] text-white text-xs font-semibold w-full">
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${row.chainColor}`} />
                              {row.chain}
                            </span>
                            <Icon name="expand_more" size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input type="text" defaultValue={row.amount} className="bg-transparent border-none focus:ring-0 text-right text-sm font-bold w-24 text-white" />
                            <span className="text-xs font-bold text-slate-400">{row.unit}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <input type="text" placeholder="Add another recipient address..." className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-600 text-white" />
                      </td>
                      <td className="px-6 py-4">
                        <button type="button" className="flex items-center justify-between gap-2 px-3 h-9 rounded-lg border border-dashed border-slate-700 text-slate-500 text-xs font-medium w-full">
                          Select chain
                          <Icon name="expand_more" size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#1c1c2e]">
                <div className="flex gap-3">
                  <button type="button" className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#282839] text-white text-sm font-bold hover:bg-[#34344a] transition-all">
                    <Icon name="add" size={18} />
                    Add row
                  </button>
                  <button type="button" className="flex items-center gap-2 px-4 h-10 rounded-lg bg-transparent text-slate-400 text-sm font-bold hover:bg-white/5 transition-all">
                    <Icon name="content_paste" size={18} />
                    Paste multiple
                  </button>
                </div>
                <button type="button" className="text-slate-500 hover:text-red-500 transition-colors">
                  <Icon name="delete_sweep" size={24} />
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 sticky top-24 shrink-0">
            <div className="bg-[#16162a] rounded-xl border border-[#282839] p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6">Payment Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total recipients</span>
                  <span className="font-bold">2</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-slate-500">Total amount</span>
                  <div className="text-right">
                    <p className="font-bold">1.5 ETH</p>
                    <p className="font-bold">500.0 MATIC</p>
                    <p className="text-slate-500 text-xs mt-1">≈ $4,250.60 USD</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-[#282839]">
                  <span className="text-slate-500">Estimated Fees</span>
                  <span className="font-bold text-green-500">$12.45</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Network ETA</span>
                  <span className="font-bold">~ 2 mins</span>
                </div>
              </div>
              <div className="space-y-3">
                <button type="button" className="w-full flex items-center justify-center h-12 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg hover:brightness-110 transition-all">
                  Send Now
                </button>
                <button type="button" className="w-full flex items-center justify-center h-12 rounded-lg bg-transparent border border-[#3b3b54] text-white text-sm font-bold hover:bg-white/5 transition-all gap-2">
                  <Icon name="calendar_today" size={20} />
                  Schedule Payment
                </button>
              </div>
              <div className="mt-6 flex items-start gap-3 p-3 bg-[var(--color-primary)]/10 rounded-lg">
                <Icon name="info" className="text-blue-500 shrink-0" size={20} />
                <p className="text-[11px] leading-tight text-blue-300">
                  Your current balance is sufficient for this batch. All recipients will be notified once broadcasted.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
