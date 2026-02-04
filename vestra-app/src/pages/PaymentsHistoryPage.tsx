import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ROUTES } from "../lib/constants";

export function PaymentsHistoryPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Payments", href: ROUTES.paymentsManual },
              { label: "Payment History" },
            ]}
          />
          <h1 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] mt-1">
            Payment History
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 font-medium">
            View and search past payments and transfers
          </p>
        </div>
        <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
          <div className="p-8 text-center">
            <div className="size-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="history" size={32} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No payments yet
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm max-w-sm mx-auto mb-6">
              Completed and pending payments will appear here. Create a new payment or schedule one to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={ROUTES.paymentsManual}>
                <Button leftIcon={<Icon name="send" size={18} />}>
                  New Payment
                </Button>
              </Link>
              <Link to={ROUTES.paymentsScheduled}>
                <Button variant="secondary" leftIcon={<Icon name="calendar_month" size={18} />}>
                  Scheduled Payments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
