import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ROUTES } from "../lib/constants";

const chains = [
  {
    address: "0x71C21BF1d32708136C185A0CEBAE72E042733A2",
    chain: "Ethereum",
    chainColor: "bg-blue-500",
    amount: "1.5",
    unit: "ETH",
  },
  {
    address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    chain: "Polygon",
    chainColor: "bg-purple-500",
    amount: "500.0",
    unit: "MATIC",
  },
];

export function PaymentsManualPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Breadcrumb
              items={[
                { label: "Payments", href: ROUTES.dashboard },
                { label: "New Payment" },
              ]}
            />
            <h1 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] mt-1">
              Payments
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1 font-medium">
              Create and manage your outgoing transfers
            </p>
          </div>
          <Link
            to={ROUTES.paymentsManualInvoice}
            className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-[var(--radius-button)] h-10 px-5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold shadow-[var(--shadow-card)] transition-colors"
          >
            <Icon name="upload_file" size={20} />
            <span className="truncate">Upload Invoice</span>
          </Link>
        </div>
        <div className="mb-8 border-b border-[var(--color-border-dark)] gap-8 flex">
          <span className="flex flex-col items-center justify-center border-b-[3px] border-[var(--color-primary)] text-[var(--color-primary)] pb-3">
            <p className="text-sm font-bold tracking-tight">New Payment</p>
          </span>
          <Link
            to={ROUTES.paymentsScheduled}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[var(--color-text-muted)] pb-3 hover:text-[var(--color-text-primary)] transition-all"
          >
            <p className="text-sm font-bold tracking-tight">
              Scheduled Payments
            </p>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full min-w-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)]">
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                  Batch Manual Entry
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-dark)]">
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/2">
                        Recipient Address
                      </th>
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/4">
                        Destination Chain
                      </th>
                      <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider w-1/4 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-darker)]">
                    {chains.map((row) => (
                      <tr
                        key={row.address}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            defaultValue={row.address}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                            placeholder="Paste 0x address or ENS..."
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className="flex items-center justify-between gap-2 px-3 h-9 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] text-xs font-semibold w-full"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${row.chainColor}`}
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
                              className="bg-transparent border-none focus:ring-0 text-right text-sm font-bold w-24 text-[var(--color-text-primary)]"
                            />
                            <span className="text-xs font-bold text-[var(--color-text-muted)]">
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
                          className="w-full bg-transparent border-none focus:ring-0 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="flex items-center justify-between gap-2 px-3 h-9 rounded-lg border border-dashed border-[var(--color-border-darker)] text-[var(--color-text-muted)] text-xs font-medium w-full"
                        >
                          Select chain
                          <Icon name="expand_more" size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--color-text-secondary)]">
                        0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 bg-[var(--color-background-darker)]">
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Icon name="add" size={18} />}
                  >
                    Add row
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Icon name="content_paste" size={18} />}
                  >
                    Paste multiple
                  </Button>
                </div>
                <button
                  type="button"
                  aria-label="Clear all rows"
                  className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                >
                  <Icon name="delete_sweep" size={24} />
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 sticky top-24 shrink-0">
            <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-[var(--color-text-primary)]">
                Payment Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)]">Total recipients</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    2
                  </span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-[var(--color-text-muted)]">Total amount</span>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-text-primary)]">
                      1.5 ETH
                    </p>
                    <p className="font-bold text-[var(--color-text-primary)]">
                      500.0 MATIC
                    </p>
                    <p className="text-[var(--color-text-muted)] text-xs mt-1">
                      ≈ $4,250.60 USD
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-[var(--color-border-darker)]">
                  <span className="text-[var(--color-text-muted)]">Estimated Fees</span>
                  <span className="font-bold text-green-600 dark:text-green-500">
                    $12.45
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)]">Network ETA</span>
                  <span className="font-bold text-[var(--color-text-primary)]">~ 2 mins</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full h-12">
                  Send Now
                </Button>
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  leftIcon={<Icon name="calendar_today" size={20} />}
                >
                  Schedule Payment
                </Button>
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
