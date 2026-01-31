import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows hero with Connect Wallet CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /global crypto payroll/i }),
    ).toBeVisible();
    // Connect Wallet may be a button (opens NEAR wallet modal) or a link (tests without provider)
    const connectWallet = page.getByRole("main").getByRole("button", { name: /connect wallet/i }).or(
      page.getByRole("main").getByRole("link", { name: /connect wallet/i }),
    );
    await expect(connectWallet.first()).toBeVisible();
  });

  test("Get Started Free links to dashboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /get started free/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });
});
