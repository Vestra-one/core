import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ROUTES } from "../lib/constants";

const schedules = [
  {
    name: "Monthly Engineering Payroll",
    icon: "engineering",
    frequency: "Monthly",
    nextRun: "Oct 01, 2023",
    nextRunSub: "6 days from now",
    amount: "$45,200.00",
    recipients: "18 Recipients",
    active: true,
  },
  {
    name: "AWS Subscription",
    icon: "cloud",
    frequency: "Monthly",
    nextRun: "Sep 28, 2023",
    nextRunSub: "In 3 days",
    amount: "$4,820.00",
    recipients: "1 Recipient",
    active: true,
  },
  {
    name: "Weekly Office Maintenance",
    icon: "cleaning_services",
    frequency: "Weekly",
    nextRun: "Sep 25, 2023",
    nextRunSub: "Today",
    amount: "$1,200.00",
    recipients: "2 Recipients",
    active: false,
  },
];

export function PaymentsScheduledPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <div className="h-14 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)] flex items-center px-8 shrink-0">
        <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] mr-8">
          Payments
        </h2>
        <nav className="flex items-center gap-6">
          <Link
            to={ROUTES.paymentsManual}
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            New Payment
          </Link>
          <span className="text-sm font-bold text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] py-5 -mb-[22px]">
            Scheduled
          </span>
          <Link
            to={ROUTES.paymentsHistory}
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            Payment History
          </Link>
          <a
            href="#"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            Recurring
          </a>
          <a
            href="#"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            Approval Queue
          </a>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--color-background-darker)] min-h-0">
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-2">
            <Breadcrumb
              items={[
                { label: "Payments", href: ROUTES.dashboard },
                { label: "Scheduled Payments" },
              ]}
            />
          </div>
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
                Scheduled Payments
              </h1>
              <p className="text-[var(--color-text-muted)] mt-1">
                Automate your payroll and recurring vendor disbursements.
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              leftIcon={<Icon name="add" size={20} />}
            >
              Create Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  Active Schedules
                </p>
                <Icon
                  name="calendar_today"
                  className="text-[var(--color-primary)]"
                  size={20}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  12
                </p>
                <p className="text-xs font-medium text-green-500 flex items-center">
                  +2.4%
                </p>
              </div>
            </div>
            <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  Total Monthly Outflow
                </p>
                <Icon
                  name="account_balance_wallet"
                  className="text-[var(--color-primary)]"
                  size={20}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  $142,500.00
                </p>
                <p className="text-xs font-medium text-green-500">+5.1%</p>
              </div>
            </div>
            <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  Next 7 Days
                </p>
                <Icon
                  name="event_upcoming"
                  className="text-[var(--color-primary)]"
                  size={20}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  $32,400.00
                </p>
                <p className="text-xs font-medium text-orange-500">-1.2%</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)]">
                    {[
                      "Payment Name",
                      "Frequency",
                      "Next Run",
                      "Amount",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-darker)]">
                  {schedules.map((s) => (
                    <tr
                      key={s.name}
                      className="group hover:bg-[var(--color-surface-dark)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                            <Icon name={s.icon} size={18} />
                          </div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {s.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--color-border-darker)] text-[var(--color-text-muted)]">
                          {s.frequency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {s.nextRun}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          {s.nextRunSub}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {s.amount}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          {s.recipients}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-label={s.active ? "Pause schedule" : "Resume schedule"}
                          aria-checked={s.active}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${s.active ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-darker)]"}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${s.active ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            aria-label={`Edit ${s.name}`}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-all"
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          {s.active ? (
                            <button
                              type="button"
                              aria-label={`Pause ${s.name}`}
                              className="p-1.5 text-[var(--color-text-secondary)] hover:text-orange-500 hover:bg-orange-500/10 rounded transition-all"
                            >
                              <Icon name="pause_circle" size={18} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Resume ${s.name}`}
                              className="p-1.5 text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded transition-all"
                            >
                              <Icon name="play_circle" size={18} />
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label={`Delete ${s.name}`}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Icon name="delete" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[var(--color-border-darker)] flex items-center justify-between">
              <p className="text-xs text-[var(--color-text-muted)]">
                Showing 3 of 12 schedules
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled className="text-xs h-8 px-3">
                  Previous
                </Button>
                <Button variant="secondary" size="sm" className="text-xs h-8 px-3">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[var(--color-surface-dark)] w-full max-w-xl rounded-2xl shadow-2xl border border-[var(--color-border-dark)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--color-border-darker)] flex justify-between items-center bg-[var(--color-background-darker)]/80">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Create New Schedule
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Configure a new automated disbursement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  Schedule Name
                </label>
                <input
                  type="text"
                  defaultValue="Q4 Contractor Payments"
                  className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-text-primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    Frequency
                  </label>
                  <select className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none text-[var(--color-text-primary)]">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Icon
                      name="calendar_month"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
                      size={20}
                    />
                    <input
                      type="text"
                      defaultValue="Oct 01, 2023"
                      className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-[var(--color-text-primary)] pr-10"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  Recipients
                </label>
                <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-lg p-2.5 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-1 px-2 rounded-md text-xs font-bold">
                    Sarah Chen{" "}
                    <span className="material-symbols-outlined text-[14px] cursor-pointer">
                      close
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] py-1 px-2 rounded-md text-xs font-bold">
                    James Wilson{" "}
                    <span className="material-symbols-outlined text-[14px] cursor-pointer">
                      close
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Add more..."
                    className="flex-1 min-w-[120px] bg-transparent border-none p-0 text-sm focus:ring-0 outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                  />
                </div>
              </div>
              <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Amount per Recipient
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/20 px-2 py-0.5 rounded uppercase"
                  >
                    Bulk Edit
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold">
                    $
                  </span>
                  <input
                    type="text"
                    defaultValue="2,400.00"
                    className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-primary)]/30 rounded-lg pl-8 pr-4 py-3 text-lg font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                </div>
                <p className="mt-3 text-[11px] text-[var(--color-text-muted)] flex justify-between">
                  <span>Estimated total per run:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    $4,800.00
                  </span>
                </p>
              </div>
            </div>
            <div className="p-6 bg-[var(--color-background-darker)]/80 border-t border-[var(--color-border-darker)] flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Discard
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                Create Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
