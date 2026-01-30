import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { ROUTES } from '../lib/constants'

const parsedRows = [
  { row: 1, name: 'Decentral Inc.', address: '0x71C...3921', amount: '$12,400.00', status: 'Validated' as const },
  { row: 2, name: 'Future Nodes', address: '0x3A2...910F', amount: '$8,250.00', status: 'Validated' as const },
  { row: 3, name: 'Invalid Recipient', address: '0xINVALID_ADDR', amount: '$450.00', status: 'Malformed Address' as const, error: true },
  { row: 4, name: 'Ether Services', address: '0x9B1...22EE', amount: '$21,400.00', status: 'Validated' as const },
]

export function PaymentsBulkPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-slate-900 dark:text-slate-100">
      <main className="max-w-[1400px] mx-auto flex gap-8 p-6 lg:p-10 flex-1 min-h-0 w-full">
        <aside className="hidden xl:flex flex-col w-64 shrink-0 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">Payments</h3>
            <Link to={ROUTES.dashboard} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-[#282839] transition-all">
              <Icon name="list_alt" size={20} />
              <span className="text-sm font-medium">All Payments</span>
            </Link>
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              <Icon name="add_circle" size={20} />
              <span className="text-sm font-bold">New Payment</span>
            </span>
            <Link to={ROUTES.paymentsScheduled} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-[#282839] transition-all">
              <Icon name="schedule" size={20} />
              <span className="text-sm font-medium">Scheduled</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-[#282839] transition-all">
              <Icon name="history" size={20} />
              <span className="text-sm font-medium">History</span>
            </a>
          </div>
          <div className="mt-auto bg-[var(--color-primary)]/5 rounded-xl p-4 border border-[var(--color-primary)]/10">
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase mb-2">Support</p>
            <p className="text-xs text-slate-500 mb-3">Need help with bulk uploads? Check our documentation.</p>
            <button type="button" className="text-xs font-bold text-[var(--color-primary)] hover:underline">View Guide →</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <Link to={ROUTES.dashboard} className="text-slate-400 hover:text-[var(--color-primary)] transition-colors">Payments</Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold">New Payment</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bulk CSV Upload</h1>
          <div className="border-b border-[#3b3b54]">
            <div className="flex gap-8">
              <Link to={ROUTES.paymentsManual} className="flex flex-col items-center border-b-2 border-transparent text-slate-500 pb-3 transition-all hover:text-slate-200">
                <span className="text-sm font-bold tracking-tight">Manual Entry</span>
              </Link>
              <span className="flex flex-col items-center border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] pb-3">
                <span className="text-sm font-bold tracking-tight">CSV Upload</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col bg-[#1a1a2e] rounded-xl border border-[#3b3b54] overflow-hidden">
            <div className="p-8 border-b border-[#3b3b54]">
              <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-6 py-12 cursor-pointer hover:border-[var(--color-primary)]/50 group">
                <div className="size-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                  <Icon name="upload_file" size={32} />
                </div>
                <div className="text-center max-w-[420px]">
                  <p className="text-lg font-bold">Select CSV to upload</p>
                  <p className="text-sm text-slate-500 mt-1">Drag and drop your file here or click to browse. Ensure your CSV follows the standard Vestra template.</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="bg-[var(--color-primary)] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                    <Icon name="add" size={20} />
                    Browse Files
                  </button>
                  <button type="button" className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-slate-900 dark:text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:opacity-80 transition-all">Download Template</button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between bg-[#1d1d35]">
              <div className="flex items-center gap-3">
                <Icon name="data_table" className="text-[var(--color-primary)]" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">Preview Parsed Rows (152)</h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">1 Error detected</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1d1d35] border-y border-[#3b3b54]">
                    {['Row', 'Recipient Name', 'Wallet Address', 'Amount (USD)', 'Status', 'Action'].map((h) => (
                      <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282839]">
                  {parsedRows.map((r) => (
                    <tr key={r.row} className={r.error ? 'bg-red-950/20 border-l-4 border-red-500' : 'hover:bg-white/5 transition-colors'}>
                      <td className={`px-6 py-4 text-sm ${r.error ? 'text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{r.row}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${r.error ? 'text-red-400' : 'text-slate-900 dark:text-white'}`}>{r.name}</td>
                      <td className={`px-6 py-4 text-sm font-mono ${r.error ? 'text-red-500 underline decoration-dotted' : 'text-slate-600 dark:text-slate-500'}`}>{r.address}</td>
                      <td className={`px-6 py-4 text-sm font-bold ${r.error ? 'text-red-300' : 'text-slate-900 dark:text-white'}`}>{r.amount}</td>
                      <td className="px-6 py-4">
                        {r.error ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                            <Icon name="warning" size={18} /> {r.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                            <span className="size-1.5 rounded-full bg-green-500" /> Validated
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`material-symbols-outlined cursor-pointer hover:text-[var(--color-primary)] ${r.error ? 'text-red-500' : 'text-slate-400'}`}>edit</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
          <div className="sticky top-[100px] flex flex-col gap-6">
            <div className="bg-[#1a1a2e] rounded-xl border border-[#3b3b54] overflow-hidden">
              <div className="p-5 border-b border-[#3b3b54] bg-[#1d1d35]">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Batch Summary</h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Total Rows</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">152</span>
                </div>
                <div className="flex justify-between items-center text-red-500">
                  <span className="text-sm font-medium">Validation Errors</span>
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Network Fees (Est.)</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">$18.42</span>
                </div>
                <div className="border-t border-[#282839] pt-4 mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Total Amount</span>
                    <span className="text-lg font-black text-[var(--color-primary)]">$42,500.00</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right italic">Balance after: $104,231.50</p>
                </div>
                <button type="button" disabled className="w-full bg-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2">
                  <Icon name="check_circle" size={20} />
                  Fix Errors to Continue
                </button>
              </div>
            </div>
            <div className="bg-[#282839]/30 rounded-xl p-5 border border-[#3b3b54]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="help_outline" size={18} /> Instructions
              </h4>
              <ul className="text-xs text-slate-500 flex flex-col gap-2 leading-relaxed">
                <li>• First column must be &quot;Recipient Name&quot;.</li>
                <li>• Wallet addresses must be EVM compatible.</li>
                <li>• Maximum 500 rows per batch.</li>
                <li>• Amount should be in USD.</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[960px] z-50">
        <div className="bg-[#1a1a2e] rounded-2xl border border-[#3b3b54] shadow-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="size-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Icon name="sync" className="text-[var(--color-primary)] animate-pulse" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Processing Batch #4209</h4>
              <p className="text-xs text-slate-500">Initiated 2 minutes ago</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1 min-w-0">
            <div className="flex flex-col items-center flex-1">
              <div className="h-1.5 w-full bg-[var(--color-primary)] rounded-full mb-2" />
              <div className="flex items-center gap-1.5">
                <Icon name="check_circle" className="text-[var(--color-primary)]" size={18} />
                <span className="text-[10px] font-bold uppercase text-[var(--color-primary)]">Initiated</span>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-1.5 w-full bg-[#282839] relative rounded-full mb-2 overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-[var(--color-primary)] w-2/3" />
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="pending" className="text-[var(--color-primary)]" size={18} />
                <span className="text-[10px] font-bold uppercase text-[var(--color-primary)]">Routing</span>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-1.5 w-full bg-[#282839] rounded-full mb-2" />
              <div className="flex items-center gap-1.5">
                <Icon name="radio_button_unchecked" className="text-slate-400" size={18} />
                <span className="text-[10px] font-bold uppercase text-slate-400">Completed</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button type="button" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Cancel Batch</button>
            <div className="h-6 w-px bg-[#282839]" />
            <button type="button" className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[var(--color-primary)]/20 transition-all">View Detail</button>
          </div>
        </div>
      </div>
    </div>
  )
}
