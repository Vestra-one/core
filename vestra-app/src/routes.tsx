import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { RouteErrorFallback } from "./components/RouteErrorFallback";
import { RequireWallet } from "./components/RequireWallet";
import { DashboardLayout } from "./layouts/DashboardLayout";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const TreasuryPage = lazy(() =>
  import("./pages/TreasuryPage").then((m) => ({ default: m.TreasuryPage })),
);
const OnboardingPage = lazy(() =>
  import("./pages/OnboardingPage").then((m) => ({ default: m.OnboardingPage })),
);
const PaymentsBulkPage = lazy(() =>
  import("./pages/PaymentsBulkPage").then((m) => ({ default: m.PaymentsBulkPage })),
);
const PaymentsManualPage = lazy(() =>
  import("./pages/PaymentsManualPage").then((m) => ({ default: m.PaymentsManualPage })),
);
const PaymentsManualInvoicePage = lazy(() =>
  import("./pages/PaymentsManualInvoicePage").then((m) => ({
    default: m.PaymentsManualInvoicePage,
  })),
);
const PaymentsScheduledPage = lazy(() =>
  import("./pages/PaymentsScheduledPage").then((m) => ({
    default: m.PaymentsScheduledPage,
  })),
);
const PaymentsHistoryPage = lazy(() =>
  import("./pages/PaymentsHistoryPage").then((m) => ({
    default: m.PaymentsHistoryPage,
  })),
);
const ContactsPage = lazy(() =>
  import("./pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);

function PageFallback() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[40vh] text-[var(--color-text-muted)] text-sm">
      Loading…
    </div>
  );
}

function LazyPage({ Page }: { Page: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        element: <RequireWallet />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [{ index: true, element: <LazyPage Page={DashboardPage} /> }],
          },
          {
            path: "payments",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <LazyPage Page={PaymentsManualPage} /> },
              { path: "manual", element: <LazyPage Page={PaymentsManualPage} /> },
              { path: "scheduled", element: <LazyPage Page={PaymentsScheduledPage} /> },
              { path: "bulk", element: <LazyPage Page={PaymentsBulkPage} /> },
              { path: "manual-invoice", element: <LazyPage Page={PaymentsManualInvoicePage} /> },
              { path: "history", element: <LazyPage Page={PaymentsHistoryPage} /> },
            ],
          },
          {
            path: "treasury",
            element: <DashboardLayout />,
            children: [{ index: true, element: <LazyPage Page={TreasuryPage} /> }],
          },
          {
            path: "onboarding",
            element: <DashboardLayout />,
            children: [{ index: true, element: <LazyPage Page={OnboardingPage} /> }],
          },
          {
            path: "contacts",
            element: <DashboardLayout />,
            children: [{ index: true, element: <LazyPage Page={ContactsPage} /> }],
          },
          {
            path: "analytics",
            element: <DashboardLayout />,
            children: [{ index: true, element: <LazyPage Page={AnalyticsPage} /> }],
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
