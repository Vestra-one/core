import { useState } from "react";
import { Icon } from "../components/ui/Icon";

const rebalances = [
  {
    title: "2,500 USDC Shifted",
    route: "NEAR → Arbitrum",
    status: "Success" as const,
    statusColor: "text-green-500",
    time: "2 mins ago",
  },
  {
    title: "12,000 USDC Shifted",
    route: "NEAR → Optimism",
    status: "Success" as const,
    statusColor: "text-green-500",
    time: "1 hour ago",
  },
  {
    title: "Liquidity Optimization",
    route: "Maintenance Triggered",
    status: "Scheduled" as const,
    statusColor: "text-amber-500",
    time: "3 hours ago",
  },
];

const positions = [
  {
    network: "NEAR Mainnet",
    networkIcon: "token" as const,
    asset: "USDC.e",
    balance: "1,024,000",
    healthPct: 92,
    healthColor: "bg-green-500",
    status: "Stable",
    statusColor: "text-green-500",
  },
  {
    network: "Arbitrum One",
    networkIcon: "link" as const,
    asset: "USDC",
    balance: "216,500",
    healthPct: 64,
    healthColor: "bg-amber-500",
    status: "Rebalancing",
    statusColor: "text-amber-500",
  },
  {
    network: "Polygon PoS",
    networkIcon: "link" as const,
    asset: "USDC",
    balance: "0.00",
    healthPct: 5,
    healthColor: "bg-red-500",
    status: "Inactive",
    statusColor: "text-[var(--color-text-muted)]",
  },
];

export function TreasuryPage() {
  const [autoBalanceOn, setAutoBalanceOn] = useState(true);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)]">
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Treasury Management
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Real-time liquidity monitoring and automated capital allocation.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center rounded-[var(--radius-button)] h-11 px-5 bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] text-sm font-semibold hover:bg-[var(--color-border-darker)]/80 transition-colors"
          >
            <Icon name="download" size={20} className="mr-2" />
            Export Report
          </button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-[var(--radius-card)] border border-[var(--color-border-darker)] shadow-[var(--shadow-card)] bg-gradient-to-br from-[var(--color-surface-dark)] to-[var(--color-background-darker)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                  Primary Account
                </span>
                <span className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] px-2.5 py-0.5 rounded text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[var(--color-text-primary)] text-4xl font-bold tracking-tight tabular-nums">
                1,240,500.00{" "}
                <span className="text-[var(--color-text-secondary)] text-2xl font-medium">
                  USDC
                </span>
              </p>
              <p className="text-[var(--color-text-secondary)] text-sm">
                NEAR Main Treasury ·{" "}
                <span className="text-green-500 font-semibold">+1.2% (24h)</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 bg-[var(--color-background-darker)]/40 p-5 rounded-xl border border-[var(--color-border-darker)]">
              <div className="flex flex-col items-end">
                <p className="text-[var(--color-text-primary)] text-sm font-bold">
                  Auto-Balancing
                </p>
                <p className="text-[var(--color-text-muted)] text-[11px]">
                  Automated Liquidity Shifts
                </p>
              </div>
              <label className="relative flex h-8 w-14 cursor-pointer items-center rounded-full bg-[var(--color-border-darker)] p-1 transition-colors has-[:checked]:bg-green-500">
                <input
                  type="checkbox"
                  checked={autoBalanceOn}
                  onChange={(e) => setAutoBalanceOn(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="h-6 w-6 rounded-full bg-white shadow-md transition-all peer-checked:translate-x-6 block" />
              </label>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--color-border-darker)] shadow-[var(--shadow-card)] p-6 flex flex-col gap-5 bg-[var(--color-surface-dark)]">
            <h3 className="text-[var(--color-text-primary)] text-sm font-bold flex items-center gap-2">
              <Icon name="settings_suggest" className="text-[var(--color-primary)]" size={18} />
              Auto-Balancing Rules
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border-darker)]">
                <span className="text-[var(--color-text-muted)] text-xs">Min Reserve</span>
                <span className="text-[var(--color-text-primary)] text-xs font-bold">
                  5,000 USDC
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border-darker)]">
                <span className="text-[var(--color-text-muted)] text-xs">
                  Rebalance Trigger
                </span>
                <span className="text-[var(--color-text-primary)] text-xs font-bold">
                  &lt; 10% deviation
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-muted)] text-xs">Target Chain</span>
                <span className="flex items-center gap-2 text-[var(--color-text-primary)] text-xs font-bold">
                  <span className="size-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                    A
                  </span>
                  Arbitrum
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 min-h-[400px] rounded-[var(--radius-card)] border border-[var(--color-border-darker)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col bg-[var(--color-surface-dark)]">
            <div className="p-5 border-b border-[var(--color-border-darker)] bg-[var(--color-background-darker)]/20 flex justify-between items-center">
              <h3 className="text-[var(--color-text-primary)] text-xs font-bold uppercase tracking-widest">
                Global Liquidity Map
              </h3>
              <div className="flex gap-4">
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  High
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Mid
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 relative bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,transparent_70%)]">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex flex-col items-center gap-3">
                <div className="size-14 rounded-full bg-[var(--color-surface-dark)] border-2 border-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                  <Icon name="token" className="text-[var(--color-primary)]" size={24} />
                </div>
                <span className="text-[10px] text-[var(--color-text-primary)] font-bold tracking-widest uppercase">
                  NEAR Pool
                </span>
              </div>
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 flex flex-col items-center gap-3">
                <div className="size-14 rounded-full bg-[var(--color-surface-dark)] border-2 border-[var(--color-border-darker)] flex items-center justify-center">
                  <Icon name="link" className="text-[var(--color-text-muted)]" size={24} />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold tracking-widest uppercase">
                  Arbitrum Bridge
                </span>
              </div>
              <div className="h-0.5 w-1/3 bg-gradient-to-r from-[var(--color-primary)] to-purple-500 opacity-50 rounded-full" />
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--color-border-darker)] shadow-[var(--shadow-card)] flex flex-col overflow-hidden bg-[var(--color-surface-dark)]">
            <div className="p-5 border-b border-[var(--color-border-darker)]">
              <h3 className="text-[var(--color-text-primary)] text-xs font-bold uppercase tracking-widest">
                Recent Rebalances
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {rebalances.map((r, i) => (
                <div key={i} className="flex gap-4 group">
                  <div
                    className={`mt-1 size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      r.status === "Scheduled"
                        ? "bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20"
                        : "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)]/20"
                    } transition-colors`}
                  >
                    <Icon
                      name={r.status === "Scheduled" ? "schedule" : "sync_alt"}
                      className={r.status === "Scheduled" ? "text-amber-500" : "text-[var(--color-primary)]"}
                      size={20}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--color-text-primary)] text-sm font-bold leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[var(--color-text-muted)] text-[11px] mt-1 font-medium">
                      {r.route}
                    </p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span
                        className={`text-[11px] font-bold flex items-center gap-1 ${r.statusColor}`}
                      >
                        <Icon
                          name={r.status === "Scheduled" ? "schedule" : "check_circle"}
                          size={12}
                        />
                        {r.status}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">
                        {r.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-[var(--color-border-darker)]">
              <button
                type="button"
                className="w-full py-2.5 border border-[var(--color-border-darker)] rounded-[var(--radius-button)] text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border-darker)]/80 transition-all uppercase tracking-widest"
              >
                View Full Log
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--color-border-darker)] shadow-[var(--shadow-card)] overflow-hidden bg-[var(--color-surface-dark)]">
          <div className="p-6 border-b border-[var(--color-border-darker)] flex items-center justify-between">
            <h3 className="text-[var(--color-text-primary)] text-xl font-bold tracking-tight">
              Liquidity Positions
            </h3>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
                aria-label="Filter"
              >
                <Icon name="filter_list" size={20} />
              </button>
              <button
                type="button"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
                aria-label="More"
              >
                <Icon name="more_vert" size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[var(--color-background-darker)]/50 text-[var(--color-text-muted)] text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Network</th>
                  <th className="px-8 py-4">Asset</th>
                  <th className="px-8 py-4 text-right">Balance</th>
                  <th className="px-8 py-4">Health Score</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-darker)]">
                {positions.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[var(--color-background-darker)]/30 transition-colors group"
                  >
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="size-8 rounded-full bg-[var(--color-background-darker)] border border-[var(--color-border-darker)] flex items-center justify-center">
                        <Icon name={p.networkIcon} size={18} className="text-[var(--color-text-secondary)]" />
                      </div>
                      <span className="text-[var(--color-text-primary)] font-semibold">
                        {p.network}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[var(--color-text-secondary)] font-medium">
                      {p.asset}
                    </td>
                    <td className="px-8 py-5 text-right text-[var(--color-text-primary)] font-bold tabular-nums">
                      {p.balance}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 min-w-[100px] bg-[var(--color-background-darker)] rounded-full overflow-hidden border border-[var(--color-border-darker)]">
                          <div
                            className={`h-full ${p.healthColor} transition-all`}
                            style={{ width: `${p.healthPct}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            p.healthPct >= 70
                              ? "text-green-500"
                              : p.healthPct >= 30
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {p.healthPct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${p.statusColor}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            p.status === "Stable"
                              ? "bg-green-500"
                              : p.status === "Rebalancing"
                                ? "bg-amber-500"
                                : "bg-[var(--color-text-muted)]"
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        type="button"
                        className="text-[var(--color-primary)] text-xs font-bold hover:opacity-80 transition-opacity uppercase tracking-widest"
                      >
                        Manage
                      </button>
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
