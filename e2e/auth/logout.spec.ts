import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../helpers/auth";

test.describe("Logout Flow", () => {
  test("user can logout and session is cleared", async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await expect(page).toHaveURL("/dashboard");

    // Click the sign out button in sidebar
    await page.getByRole("button", { name: /sign out/i }).click();

    // Should redirect to login page
    await expect(page).toHaveURL("/login");

    // Verify session is cleared - try to access protected route
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("can login again after logout", async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await expect(page).toHaveURL("/dashboard");

    // Logout
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/login");

    // Login again
    await loginAsTestUser(page);
    await expect(page).toHaveURL("/dashboard");

    // Verify user data is displayed
    await expect(page.getByText("Test User").first()).toBeVisible();
  });
});
