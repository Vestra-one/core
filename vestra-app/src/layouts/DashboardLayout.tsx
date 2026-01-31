import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { AppHeader } from "../components/layout/AppHeader";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--radius-button)] focus:bg-[var(--color-primary)] focus:text-white focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-w-0"
        tabIndex={-1}
      >
        <AppHeader />
        <Outlet />
      </main>
    </div>
  );
}
