import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext";
import { ROUTES } from "../lib/constants";

/**
 * Route guard: requires a connected wallet. If not connected, redirects to home
 * with returnTo in state so the user can be sent back after connecting.
 */
export function RequireWallet() {
  const { isConnected, loading } = useWallet();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh] text-[var(--color-text-muted)] text-sm">
        Loading…
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Navigate
        to={ROUTES.home}
        state={{ returnTo: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}
