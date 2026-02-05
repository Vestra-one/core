import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { SinglePaymentForm } from "../components/payments/SinglePaymentForm";
import { ROUTES } from "../lib/constants";

export function PaymentsManualPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <main className="flex-1 max-w-[600px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Payments", href: ROUTES.paymentsManual },
              { label: "New Payment" },
            ]}
          />
          <h1 className="text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] mt-1">
            New Payment
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 font-medium">
            Pay with USDC or other tokens on NEAR; recipient receives the selected token on the selected chain.
          </p>
        </div>
        <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] shadow-sm p-6 lg:p-8">
          <SinglePaymentForm />
        </div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Need to pay multiple recipients?{" "}
          <Link to={ROUTES.paymentsBulk} className="text-[var(--color-primary)] hover:underline">
            Use Bulk Upload
          </Link>
        </p>
      </main>
    </div>
  );
}
