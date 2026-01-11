import { expect, test } from "@playwright/test";

test.describe("Forgot Password Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("renders forgot password form", async ({ page }) => {
    await expect(
      page.getByText("Forgot password", { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send reset link" }),
    ).toBeVisible();
  });

  test("shows validation error for empty email", async ({ page }) => {
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("'Back to login' link navigates to /login", async ({ page }) => {
    await page.getByRole("link", { name: "Back to login" }).click();
    await expect(page).toHaveURL("/login");
  });
});
