import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Logo } from "../components/layout/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ROUTES } from "../lib/constants";

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-background-dark)]">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-dark)] bg-[var(--color-background-dark)]/80 backdrop-blur-md px-6 lg:px-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.home}
              className="text-[10px] text-slate-500 hover:text-[var(--color-primary)] mr-2 dark:text-slate-500"
            >
              App
            </Link>
            <Logo variant="wallet" showLink={false} />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              href="#product"
            >
              Product
            </a>
            <a
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              href="#integrations"
            >
              Integrations
            </a>
            <a
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              href="#pricing"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              className="hidden sm:flex h-10 items-center justify-center rounded-full bg-[var(--color-border-dark)] px-5 text-sm font-bold text-slate-900 dark:text-white"
            >
              View Demo
            </button>
            <Link
              to={ROUTES.dashboard}
              className="flex h-10 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 text-sm font-bold text-white shadow-lg"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(91, 43, 238, 0.15) 0%, rgba(10, 8, 18, 0) 70%)",
            }}
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col gap-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
                  </span>
                  Intent-Based Payroll is here
                </div>
                <h1 className="text-5xl font-black leading-tight tracking-tight lg:text-7xl text-slate-900 dark:text-white">
                  Global Crypto Payroll <br />
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-purple-400 bg-clip-text text-transparent">
                    In One Click
                  </span>
                </h1>
                <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  The first intent-based payroll engine on NEAR. Automate
                  salaries, contractors, and invoices across any chain with zero
                  friction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={ROUTES.dashboard}
                    className="h-14 rounded-full bg-[var(--color-primary)] px-8 text-base font-bold text-white shadow-xl inline-flex items-center"
                  >
                    Get Started Free
                  </Link>
                  <button
                    type="button"
                    className="h-14 rounded-full border border-[var(--color-border-dark)] bg-[var(--color-card-dark)] px-8 text-base font-bold text-slate-900 dark:text-white"
                  >
                    Talk to Sales
                  </button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-[var(--color-background-dark)] bg-slate-300 dark:bg-slate-700"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                    Trusted by 200+ Web3 Teams
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square w-full max-w-lg mx-auto rounded-xl border border-[var(--color-border-dark)] bg-[var(--color-card-dark)] p-8 shadow-2xl">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-[var(--color-border-dark)] pb-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        Transaction Hub
                      </span>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 py-8">
                      <div className="flex items-center justify-between rounded-lg bg-[var(--color-background-dark)] p-4 border border-[var(--color-border-dark)]">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Icon
                              name="account_balance"
                              className="text-[var(--color-primary)]"
                              size={24}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">
                              Source Account
                            </p>
                            <p className="text-sm font-bold italic">
                              near.payflow.x
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-green-400">
                          10,450 USDC
                        </p>
                      </div>
                      <div className="flex justify-center py-2">
                        <Icon
                          name="arrow_downward"
                          className="text-[var(--color-primary)]"
                          size={24}
                        />
                      </div>
                      <div className="rounded-lg bg-[var(--color-background-dark)] p-4 border border-[var(--color-border-dark)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Destination Address
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Optimism:0x00...A7b
                          </span>
                          <span className="text-xs font-semibold text-[var(--color-primary)]">
                            MAX
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {["$4.2K", "$8.7K", "$10.1K"].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="flex-1 rounded-lg bg-[var(--color-background-dark)] p-3 text-center border border-[var(--color-border-dark)] text-sm font-medium text-slate-600 dark:text-slate-300"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-background-dark)] py-24 border-y border-[var(--color-border-dark)]">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Streamline Your Operations
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Move from complex manual transfers to a single unified flow.
              </p>
            </div>
            <div className="mx-auto max-w-4xl grid grid-cols-[64px_1fr] gap-x-8">
              {[
                {
                  icon: "input",
                  title: "Deposit USDC on NEAR",
                  desc: "Securely fund your master payroll account. NEAR's low latency ensures your funds are ready for distribution in seconds.",
                },
                {
                  icon: "route",
                  title: "Intent-Based Routing",
                  desc: "Our smart pathfinding engine automatically selects the fastest and cheapest route to reach your contributors' preferred chains.",
                },
                {
                  icon: "send_and_archive",
                  title: "Multi-Chain Settlement",
                  desc: "Funds arrive simultaneously on Ethereum, Arbitrum, Base, or Optimism. One dashboard to track every penny.",
                },
              ].map((step, i) => (
                <div key={step.title} className="contents">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border ${i === 0 ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/30" : "bg-slate-200 dark:bg-slate-800 text-[var(--color-primary)] border-[var(--color-border-dark)]"}`}
                    >
                      <Icon name={step.icon} size={24} />
                    </div>
                    {i < 2 && (
                      <div className="w-0.5 grow bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>
                  <div className={i < 2 ? "pb-16 pt-4" : "pt-4"}>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black leading-tight text-slate-900 dark:text-white">
                  Engineered for <br /> Modern Teams
                </h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  Experience the efficiency of zero-click payouts and automated
                  compliance built directly into the protocol.
                </p>
              </div>
              <a
                className="group flex items-center gap-2 text-[var(--color-primary)] font-bold"
                href="#"
              >
                View all features{" "}
                <Icon
                  name="arrow_forward"
                  className="group-hover:translate-x-1 transition-transform"
                  size={24}
                />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "schedule_send",
                  title: "Zero-Click Payouts",
                  desc: "Set it and forget it with smart contracts that handle recurring distributions, vesting schedules, and bonuses automatically.",
                },
                {
                  icon: "groups",
                  title: "Bulk Payments",
                  desc: "Pay 100+ contributors across different chains in a single transaction. Drastically reduce gas overhead and management time.",
                },
                {
                  icon: "description",
                  title: "Invoice Auto-pay",
                  desc: "Native integration with on-chain invoicing tools. Verify, approve, and settle invoices with automated reconciliation.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-[var(--color-border-dark)] bg-[var(--color-card-dark)] p-8 hover:border-[var(--color-primary)]/50 transition-colors"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Icon name={card.icon} size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl rounded-3xl bg-[var(--color-primary)] px-6 py-16 text-center lg:px-20 lg:py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:40px_40px]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white sm:text-5xl">
                Ready to automate your payroll?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
                Join the next generation of global organizations using
                intent-based infrastructure to scale their teams.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to={ROUTES.dashboard}
                  className="h-14 rounded-full bg-white px-8 text-base font-bold text-[var(--color-primary)] inline-flex items-center"
                >
                  Connect Wallet
                </Link>
                <button
                  type="button"
                  className="h-14 rounded-full border border-white/30 bg-white/10 px-8 text-base font-bold text-white"
                >
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-dark)] bg-[var(--color-background-dark)] py-12 lg:py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-2">
              <Logo variant="wallet" showLink={false} />
              <p className="max-w-xs text-sm text-slate-500 leading-relaxed mt-4 mb-6">
                Simplifying global compensation through decentralized
                intent-based infrastructure.
              </p>
              <div className="flex gap-4">
                <a
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  href="#"
                >
                  <Icon name="public" size={20} />
                </a>
                <a
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  href="#"
                >
                  <Icon name="chat_bubble" size={20} />
                </a>
              </div>
            </div>
            {["Product", "Chains", "Resources", "Company"].map((heading) => (
              <div key={heading}>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {heading}
                </h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[var(--color-primary)] transition-colors"
                      href="#"
                    >
                      Link
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[var(--color-primary)] transition-colors"
                      href="#"
                    >
                      Link
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--color-border-dark)] pt-8">
            <p className="text-sm text-slate-500">
              © 2024 Vestra Protocol. All rights reserved.
            </p>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Icon name="verified_user" size={18} /> SOC2 Type II Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
