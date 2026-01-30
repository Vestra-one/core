import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { AppHeader } from '../components/layout/AppHeader'

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-w-0">
        <AppHeader />
        <Outlet />
      </main>
    </div>
  )
}
