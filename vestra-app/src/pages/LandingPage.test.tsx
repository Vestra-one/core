import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { WalletProvider } from "../contexts/WalletContext";
import { LandingPage } from "./LandingPage";

// Wallet selector async init and NEAR globals are not available in jsdom.
// Use a mock module so useWallet returns without initializing the real selector.
vi.mock("../contexts/WalletContext", () => ({
  WalletProvider: ({ children }: { children: React.ReactNode }) => children,
  useWallet: () => ({
    accountId: null,
    loading: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    isConnected: false,
    getToken: () => null,
    clearSession: vi.fn(),
  }),
}));

function renderLanding() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <WalletProvider>
          <LandingPage />
        </WalletProvider>
      </ThemeProvider>
    </BrowserRouter>,
  );
}

describe("LandingPage", () => {
  it("renders hero and Connect Wallet CTA", () => {
    renderLanding();
    const connectButtons = screen.getAllByRole("button", {
      name: /connect wallet/i,
    });
    expect(connectButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/global crypto payroll/i)).toBeInTheDocument();
  });

  it("Get Started links to dashboard", () => {
    renderLanding();
    const getStarted = screen.getByRole("link", { name: /get started/i });
    expect(getStarted).toHaveAttribute("href", "/dashboard");
  });
});
