import { NEAR_WALLET_INSTALL } from "../../lib/constants";

type WalletInstallLinksProps = {
  className?: string;
  variant?: "inline" | "stacked";
};

/** Shown when user has no wallet: install Meteor or Sender. */
export function WalletInstallLinks({
  className = "",
  variant = "inline",
}: WalletInstallLinksProps) {
  const linkClass =
    "text-[var(--color-primary)] hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded";

  return (
    <p className={`text-[var(--color-text-muted)] text-sm ${className}`}>
      No wallet?{" "}
      <span className={variant === "stacked" ? "flex flex-col gap-1 mt-1" : ""}>
        <a
          href={NEAR_WALLET_INSTALL.meteor}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Install Meteor Wallet
        </a>
        {variant === "inline" && " · "}
        <a
          href={NEAR_WALLET_INSTALL.sender}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Install Sender Wallet
        </a>
      </span>
    </p>
  );
}
