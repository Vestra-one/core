import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Icon } from "./ui/Icon";
import { ROUTES } from "../lib/constants";

export function RouteErrorFallback() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);
  const status = isRouteError ? error.status : null;
  const message = isRouteError
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Something went wrong";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background-darker)] text-[var(--color-text-primary)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
          <Icon name="error" size={32} />
        </div>
        <div>
          {status != null && (
            <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Error {status}
            </p>
          )}
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            {isRouteError &&
            error.data &&
            typeof (error.data as { message?: string }).message === "string"
              ? (error.data as { message: string }).message
              : message}
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          We couldn’t load this page. Try going back or refreshing.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors duration-200"
          >
            <Icon name="refresh" size={20} />
            Try again
          </button>
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-button)] border border-[var(--color-border-darker)] text-[var(--color-text-primary)] text-sm font-semibold hover:bg-[var(--color-border-darker)]/80 transition-colors duration-200"
          >
            <Icon name="home" size={20} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
