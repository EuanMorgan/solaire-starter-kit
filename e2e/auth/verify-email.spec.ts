import { expect, test } from "@playwright/test";

test.describe("Verify Email Page", () => {
  test("shows success state when no error param", async ({ page }) => {
    await page.goto("/verify-email");

    await expect(page.getByText("Email verified!")).toBeVisible();
    await expect(page.getByText(/successfully verified/i)).toBeVisible();
    await expect(page.getByText(/redirecting to dashboard/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /go to dashboard/i }),
    ).toBeVisible();
  });

  test("shows error state with invalid_token error", async ({ page }) => {
    await page.goto("/verify-email?error=invalid_token");

    await expect(page.getByText("Verification failed")).toBeVisible();
    await expect(page.getByText(/invalid or has expired/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to login/i }),
    ).toBeVisible();
  });

  test("shows generic error for unknown errors", async ({ page }) => {
    await page.goto("/verify-email?error=some_other_error");

    await expect(page.getByText("Verification failed")).toBeVisible();
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test("'Go to Dashboard' button links to /dashboard", async ({ page }) => {
    await page.goto("/verify-email");

    const dashboardLink = page.getByRole("link", { name: /go to dashboard/i });
    await expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  test("'Back to login' button links to /login", async ({ page }) => {
    await page.goto("/verify-email?error=invalid_token");

    const loginLink = page.getByRole("link", { name: /back to login/i });
    await expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("success page has countdown display", async ({ page }) => {
    await page.goto("/verify-email");

    await expect(page.getByText(/redirecting.*\d.*seconds/i)).toBeVisible();
  });
});
