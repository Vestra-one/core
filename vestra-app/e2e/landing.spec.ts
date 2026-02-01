import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows hero with Connect Wallet CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /global crypto payroll/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("button", { name: /connect wallet/i }),
    ).toBeVisible();
  });

  test("Connect Wallet button opens wallet modal", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("main")
      .getByRole("button", { name: /connect wallet/i })
      .first()
      .click();
    // Wallet selector modal shows wallet options (e.g. "My NEAR Wallet")
    await expect(
      page.getByText(/my near wallet|choose your wallet|connect/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test("Get Started links to dashboard", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /get started/i })
      .first()
      .click();
    await expect(page).toHaveURL("/dashboard");
  });
});
