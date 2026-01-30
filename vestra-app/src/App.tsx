import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from './lib/constants'
import { DashboardLayout } from './layouts/DashboardLayout'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PaymentsBulkPage } from './pages/PaymentsBulkPage'
import { PaymentsManualPage } from './pages/PaymentsManualPage'
import { PaymentsManualInvoicePage } from './pages/PaymentsManualInvoicePage'
import { PaymentsScheduledPage } from './pages/PaymentsScheduledPage'

const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <LandingPage />,
  },
  {
    path: ROUTES.onboarding,
    element: <OnboardingPage />,
  },
  {
    path: ROUTES.paymentsBulk,
    element: <PaymentsBulkPage />,
  },
  {
    path: ROUTES.paymentsManual,
    element: <PaymentsManualPage />,
  },
  {
    path: ROUTES.paymentsManualInvoice,
    element: <PaymentsManualInvoicePage />,
  },
  {
    path: ROUTES.paymentsScheduled,
    element: <PaymentsScheduledPage />,
  },
  {
    path: ROUTES.dashboard,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
