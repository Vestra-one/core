import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { RouteErrorFallback } from "./components/RouteErrorFallback";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PaymentsBulkPage } from "./pages/PaymentsBulkPage";
import { PaymentsManualPage } from "./pages/PaymentsManualPage";
import { PaymentsManualInvoicePage } from "./pages/PaymentsManualInvoicePage";
import { PaymentsScheduledPage } from "./pages/PaymentsScheduledPage";
import { ContactsPage } from "./pages/ContactsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { TreasuryPage } from "./pages/TreasuryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
      {
        path: "treasury",
        element: <DashboardLayout />,
        children: [{ index: true, element: <TreasuryPage /> }],
      },
      {
        path: "onboarding",
        element: <DashboardLayout />,
        children: [{ index: true, element: <OnboardingPage /> }],
      },
      {
        path: "payments/bulk",
        element: <DashboardLayout />,
        children: [{ index: true, element: <PaymentsBulkPage /> }],
      },
      {
        path: "payments/manual",
        element: <DashboardLayout />,
        children: [{ index: true, element: <PaymentsManualPage /> }],
      },
      {
        path: "payments/manual-invoice",
        element: <DashboardLayout />,
        children: [{ index: true, element: <PaymentsManualInvoicePage /> }],
      },
      {
        path: "payments/scheduled",
        element: <DashboardLayout />,
        children: [{ index: true, element: <PaymentsScheduledPage /> }],
      },
      {
        path: "contacts",
        element: <DashboardLayout />,
        children: [{ index: true, element: <ContactsPage /> }],
      },
      {
        path: "analytics",
        element: <DashboardLayout />,
        children: [{ index: true, element: <AnalyticsPage /> }],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
