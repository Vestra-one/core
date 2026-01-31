import { Icon } from "../components/ui/Icon";

const stats = [
  {
    label: "Total sent (30d)",
    value: "12,450.00 NEAR",
    sub: "≈ $86,820 USD",
    icon: "payments" as const,
    trend: "+12.4%",
  },
  {
    label: "Recipients",
    value: "248",
    sub: "Unique addresses",
    icon: "group" as const,
    trend: "+8",
  },
  {
    label: "Transactions",
    value: "1,024",
    sub: "Last 30 days",
    icon: "swap_horiz" as const,
    trend: "+5.2%",
  },
  {
    label: "Avg. per payment",
    value: "12.15 NEAR",
    sub: "≈ $85 USD",
    icon: "show_chart" as const,
    trend: "-2.1%",
  },
];

const recentActivity = [
  { type: "Payroll", description: "Monthly Engineering Payroll", amount: "450.00 NEAR", date: "Oct 24, 2023" },
  { type: "Transfer", description: "Contractor — dev_ops.near", amount: "25.00 NEAR", date: "Oct 23, 2023" },
  { type: "Bulk", description: "Q3 Bonuses (18 recipients)", amount: "2,400.00 NEAR", date: "Oct 22, 2023" },
];

export function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)]">
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Treasury</span>
          <span className="text-xs text-[var(--color-text-muted)]">/</span>
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Analytics</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Analytics
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Reports and insights on your payroll and treasury activity.
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  {s.label}
                </p>
                <div className="size-10 rounded-[var(--radius-button)] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <Icon name={s.icon} size={22} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">
                {s.value}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {s.sub}
              </p>
              <p className="text-xs font-semibold text-green-500 mt-2 flex items-center gap-1">
                <Icon name="trending_up" size={14} />
                {s.trend} vs last period
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Payment volume
          </h2>
          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 min-h-[280px] flex flex-col items-center justify-center">
            <div className="size-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4">
              <Icon name="bar_chart" size={32} />
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium">
              Chart placeholder — connect data source for volume over time
            </p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">
              Last 30 days • NEAR / USDC
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Recent activity
            </h2>
            <button
              type="button"
              className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-background-darker)]/50">
                <tr>
                  <th className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-darker)]">
                {recentActivity.map((a, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[var(--color-border-darker)]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {a.description}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums font-semibold text-[var(--color-text-primary)]">
                      {a.amount}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--color-text-secondary)] tabular-nums">
                      {a.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
