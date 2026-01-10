import { expect, test } from "@playwright/test";

test.describe("Magic Link Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/magic-link");
  });

  test("renders magic link form", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Magic link", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send magic link" }),
    ).toBeVisible();
  });

  test("shows validation error for empty email", async ({ page }) => {
    // Leave email empty to trigger Zod validation
    await page.getByRole("button", { name: "Send magic link" }).click();

    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("'Back to password login' link navigates to /login", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Back to password login" }).click();
    await expect(page).toHaveURL("/login");
  });
});
