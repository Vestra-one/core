import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { PageContainer } from "../components/layout/PageContainer";
import { useWallet } from "../contexts/WalletContext";
import { NEAR_NETWORK } from "../lib/near";
import {
  getAccountTransactions,
  mapTxnToActivity,
} from "../lib/near-nearblocks";
import { getAccountBalance } from "../lib/near-rpc";
import { ROUTES } from "../lib/constants";

type Activity = {
  id: string;
  type: string;
  title: string;
  recipientCount?: number;
  recipient?: string;
  amount: string;
  usdEquivalent: string;
  status: string;
  date: string;
};

function formatActivityDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "completed" || s === "success") return "bg-green-500/10 text-green-500";
  if (s === "processing" || s === "pending") return "bg-yellow-500/10 text-yellow-500";
  if (s === "failed" || s === "error") return "bg-red-500/10 text-red-500";
  return "bg-[var(--color-border-darker)] text-[var(--color-text-muted)]";
}

function truncateAccountId(accountId: string, head = 12, tail = 8): string {
  if (accountId.length <= head + tail) return accountId;
  return `${accountId.slice(0, head)}…${accountId.slice(-tail)}`;
}

export function DashboardPage() {
  const { accountId } = useWallet();
  const network = NEAR_NETWORK;

  const {
    data: balanceData,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useQuery({
    queryKey: ["near", "balance", accountId ?? "", network],
    queryFn: () => getAccountBalance(accountId!, network),
    enabled: !!accountId,
  });

  const {
    data: txnsData,
    isLoading: activitiesLoading,
    isError: activitiesError,
  } = useQuery({
    queryKey: ["near", "txns", accountId ?? "", network],
    queryFn: () => getAccountTransactions(accountId!, network),
    enabled: !!accountId,
  });

  const activities: Activity[] =
    accountId && txnsData?.txns
      ? txnsData.txns.map((txn) => mapTxnToActivity(txn, accountId))
      : [];

  return (
    <div className="flex h-full">
      <PageContainer>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <p className="text-[var(--color-text-muted)] text-sm font-medium">
            Total Treasury Balance
          </p>
          {accountId && (
            <p className="text-xs text-[var(--color-text-muted)]" title={accountId}>
              Account: {truncateAccountId(accountId)}
            </p>
          )}
          <div className="flex items-baseline gap-3 flex-wrap">
            {balanceLoading && (
              <span className="text-5xl font-bold tracking-tight tabular-nums text-[var(--color-text-muted)]">
                Loading…
              </span>
            )}
            {balanceError && (
              <span className="text-lg text-red-500 font-medium">
                Failed to load balance
              </span>
            )}
            {!balanceLoading && !balanceError && balanceData && (
              <>
                <h1 className="text-5xl font-bold tracking-tight tabular-nums text-[var(--color-text-primary)]">
                  {balanceData.inNear.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{" "}
                  NEAR
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] font-medium tabular-nums">
                  — USD
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" leftIcon={<Icon name="add_circle" size={20} />}>
            Add Funds
          </Button>
          <Button variant="secondary">Withdraw</Button>
        </div>
      </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to={ROUTES.paymentsManual}
            className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 block"
          >
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-[var(--radius-button)] flex items-center justify-center text-[var(--color-primary)] mb-4">
              <Icon name="send" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[var(--color-text-primary)]">
              New Payment
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Send NEAR or USDC to any address instantly.
            </p>
          </Link>
          <Link
            to={ROUTES.paymentsBulk}
            className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 block"
          >
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-[var(--radius-button)] flex items-center justify-center text-[var(--color-primary)] mb-4">
              <Icon name="cloud_upload" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[var(--color-text-primary)]">
              Bulk Upload
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Upload CSV or JSON for mass distribution.
            </p>
          </Link>
          <Link
            to={ROUTES.paymentsScheduled}
            className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 block"
          >
            <div className="size-12 bg-[var(--color-primary)]/10 rounded-[var(--radius-button)] flex items-center justify-center text-[var(--color-primary)] mb-4">
              <Icon name="calendar_month" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[var(--color-text-primary)]">
              Schedule Payment
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Set up recurring or future-dated transfers.
            </p>
          </Link>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Recent Activities
            </h2>
            <button
              type="button"
              className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-background-darker)]/50 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Activity</th>
                  <th scope="col" className="px-6 py-4 text-center">Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Amount</th>
                  <th scope="col" className="px-6 py-4 text-center">Status</th>
                  <th scope="col" className="px-6 py-4 w-10" aria-hidden />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-darker)]">
                {activitiesLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">
                      Loading activities…
                    </td>
                  </tr>
                )}
                {activitiesError && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-500 text-sm">
                      Failed to load activities
                    </td>
                  </tr>
                )}
                {!activitiesLoading && !activitiesError && activities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">
                      No recent activities
                    </td>
                  </tr>
                )}
                {!activitiesLoading &&
                  !activitiesError &&
                  activities.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-[var(--color-border-darker)]/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-10 rounded-lg flex items-center justify-center ${
                              a.type === "payroll"
                                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            <Icon
                              name={a.type === "payroll" ? "diversity_3" : "person"}
                              size={24}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {a.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {a.recipientCount != null
                                ? `${a.recipientCount} Recipients`
                                : a.recipient ?? ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">
                        {formatActivityDate(a.date)}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {a.amount}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          ≈ ${Number(a.usdEquivalent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadgeClass(a.status)}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Icon name="expand_more" className="text-slate-400" size={24} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </PageContainer>

      <aside className="hidden lg:flex w-96 border-l border-[var(--color-border-darker)] bg-[var(--color-surface-dark)] flex-col shrink-0 shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border-darker)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Activity Details
          </h2>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close activity details"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
            <div className="size-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Icon name="history" size={24} />
            </div>
            <div>
              <p className="text-yellow-500 font-bold uppercase text-[10px] tracking-widest">
                Processing
              </p>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Payroll - Oct 2023
              </h4>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Intent ID
              </p>
              <div className="flex items-center justify-between p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <code className="text-xs text-[var(--color-primary)] truncate mr-2">
                  PAY-INTENT-7829-XQ
                </code>
                <Icon
                  name="content_copy"
                  className="text-slate-500 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Transaction Hash
              </p>
              <div className="flex items-center justify-between p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <code className="text-xs text-slate-300 truncate mr-2">
                  0x71C765...6D91
                </code>
                <Icon
                  name="open_in_new"
                  className="text-[var(--color-primary)] cursor-pointer"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Destination Network
              </p>
              <div className="flex items-center gap-3 p-3 bg-[var(--color-background-darker)] rounded-lg border border-[var(--color-border-darker)]">
                <div className="size-6 bg-white rounded-full flex items-center justify-center shrink-0">
                  <svg className="size-4" fill="black" viewBox="0 0 24 24">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Ethereum (Mainnet)
                </p>
                <span className="ml-auto text-[10px] text-slate-500 px-2 py-0.5 border border-[var(--color-border-darker)] rounded bg-[var(--color-surface-dark)] shrink-0">
                  Via Rainbow Bridge
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Execution Timeline
            </p>
            <div className="relative pl-6 space-y-6 border-l border-[var(--color-border-darker)] ml-2">
              {[
                {
                  label: "Intent Created",
                  time: "Oct 24, 2023 • 14:20:05",
                  done: true,
                },
                {
                  label: "Approval Secured (2/2)",
                  time: "Oct 24, 2023 • 14:22:12",
                  done: true,
                },
                {
                  label: "Transmitting to Bridge",
                  time: "Oct 24, 2023 • 14:25:30",
                  done: false,
                },
              ].map((step) => (
                <div key={step.label} className="relative">
                  <div
                    className={`absolute -left-[31px] top-0 size-4 rounded-full border-4 border-[var(--color-surface-dark)] ${step.done ? "bg-green-500" : "bg-yellow-500"}`}
                  />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[var(--color-border-darker)] bg-[var(--color-background-darker)]/30">
          <button
            type="button"
            className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] hover:bg-[var(--color-border-darker)] py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <Icon name="download" size={20} />
            Download Receipt
          </button>
        </div>
      </aside>
    </div>
  );
}
