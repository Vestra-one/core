import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LandingPage } from "./LandingPage";

function renderLanding() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LandingPage />
      </ThemeProvider>
    </BrowserRouter>,
  );
}

describe("LandingPage", () => {
  it("renders hero and Connect Wallet CTA", () => {
    renderLanding();
    const connectLinks = screen.getAllByRole("link", {
      name: /connect wallet/i,
    });
    expect(connectLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/global crypto payroll/i)).toBeInTheDocument();
  });

  it("links to dashboard for Get Started and Connect Wallet", () => {
    renderLanding();
    const getStarted = screen.getByRole("link", { name: /get started free/i });
    expect(getStarted).toHaveAttribute("href", "/dashboard");
    const firstConnect = screen.getAllByRole("link", {
      name: /connect wallet/i,
    })[0];
    expect(firstConnect).toHaveAttribute("href", "/dashboard");
  });
});
