import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { ROUTES } from "../lib/constants";

const rows = [
  {
    address: "0x4f3b892123456789012345678901234567890e92",
    chain: "Arbitrum",
    chainColor: "bg-blue-400",
    amount: "1,200.00",
    unit: "USDC",
    parsed: true,
  },
  {
    address: "0x71C21BF1d32708136C185A0CEBAE72E042733A2",
    chain: "Ethereum",
    chainColor: "bg-blue-500",
    amount: "1.5",
    unit: "ETH",
    parsed: false,
  },
  {
    address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    chain: "Polygon",
    chainColor: "bg-purple-500",
    amount: "500.0",
    unit: "MATIC",
    parsed: false,
  },
];

export function PaymentsManualInvoicePage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-slate-900 dark:text-white relative">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-[fadeSlide_0.3s_ease-out]">
        <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/20">
          <Icon name="check_circle" className="text-white" size={24} />
          <p className="text-sm font-semibold">
            Invoice parsed successfully. 1 recipient added.
          </p>
          <button type="button" className="ml-2 hover:opacity-70">
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              Payments
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Create and manage your outgoing transfers
            </p>
          </div>
          <span className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg h-11 px-5 bg-emerald-500 text-white text-sm font-bold shadow-lg">
            <Icon name="task_alt" size={20} />
            <span className="truncate">Invoice Uploaded</span>
          </span>
        </div>
        <div className="mb-8 border-b border-[var(--color-border-dark)] gap-8 flex">
          <span className="flex flex-col items-center justify-center border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] pb-3">
            <p className="text-sm font-bold tracking-tight">New Payment</p>
          </span>
          <Link
            to={ROUTES.paymentsScheduled}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 pb-3 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <p className="text-sm font-bold tracking-tight">
              Scheduled Payments
            </p>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full min-w-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex justify-between items-center">
                <h3 className="font-semibold text-sm">Batch Manual Entry</h3>
                <span className="text-xs text-slate-500">3 Recipient(s)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-dark)]">
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/2">
                        Recipient Address
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/4">
                        Destination Chain
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-1/4 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-darker)]">
                    {rows.map((row) => (
                      <tr
                        key={row.address}
                        className={
                          row.parsed
                            ? "bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                            : "hover:bg-white/5 transition-colors"
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              defaultValue={row.address}
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0 text-slate-900 dark:text-white"
                            />
                            {row.parsed && (
                              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-tight w-fit">
                                Parsed from Invoice
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className={`flex items-center justify-between gap-2 px-3 h-9 rounded-lg text-slate-900 dark:text-white text-xs font-semibold w-full ${row.parsed ? "bg-[var(--color-surface-dark)] border border-emerald-500/20" : "bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)]"}`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${row.chainColor}`}
                              />
                              {row.chain}
                            </span>
                            <Icon name="expand_more" size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input
                              type="text"
                              defaultValue={row.amount}
                              className="bg-transparent border-none focus:ring-0 text-right text-sm font-bold w-24 p-0 text-slate-900 dark:text-white"
                            />
                            <span className="text-xs font-bold text-slate-400">
                              {row.unit}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Add another recipient address..."
                          className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-600 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="flex items-center justify-between gap-2 px-3 h-9 rounded-lg border border-dashed border-slate-700 text-slate-500 text-xs font-medium w-full"
                        >
                          Select chain
                          <Icon name="expand_more" size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 bg-[var(--color-background-darker)]">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-slate-900 dark:text-white text-sm font-bold hover:bg-[var(--color-border-darker)] transition-all"
                  >
                    <Icon name="add" size={18} />
                    Add row
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 h-10 rounded-lg bg-transparent text-slate-400 text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    <Icon name="content_paste" size={18} />
                    Paste multiple
                  </button>
                </div>
                <button
                  type="button"
                  className="text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Icon name="delete_sweep" size={24} />
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 sticky top-24 shrink-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
                Payment Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total recipients</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    3
                  </span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-slate-500">Total amount</span>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      1.5 ETH
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      500.0 MATIC
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      1,200.0 USDC
                    </p>
                    <p className="text-slate-500 text-xs mt-2 border-t border-[var(--color-border-darker)] pt-1">
                      ≈ $5,450.60 USD
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-[var(--color-border-darker)]">
                  <span className="text-slate-500">Estimated Fees</span>
                  <span className="font-bold text-green-600 dark:text-green-500">
                    $14.20
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Network ETA</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ~ 2 mins
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center h-12 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg hover:brightness-110 transition-all"
                >
                  Send Now
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center h-12 rounded-lg bg-transparent border border-[var(--color-border-darker)] text-slate-900 dark:text-white text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all gap-2"
                >
                  <Icon name="calendar_today" size={20} />
                  Schedule Payment
                </button>
              </div>
              <div className="mt-6 flex items-start gap-3 p-3 bg-[var(--color-primary)]/10 rounded-lg">
                <Icon
                  name="info"
                  className="text-blue-500 shrink-0"
                  size={20}
                />
                <p className="text-[11px] leading-tight text-blue-300">
                  Your current balance is sufficient for this batch. All
                  recipients will be notified once broadcasted.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
