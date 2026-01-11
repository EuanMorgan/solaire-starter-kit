import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../helpers/auth";

test.describe("Dashboard Page", () => {
  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("authenticated user sees welcome message with their name", async ({
    page,
  }) => {
    await loginAsTestUser(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Welcome back",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Test User",
    );
  });

  test("authenticated user sees their profile info", async ({ page }) => {
    await loginAsTestUser(page);

    await expect(page.getByText("Your Profile")).toBeVisible();
    await expect(page.getByTestId("user-email")).toHaveText("test@example.com");
    await expect(page.getByTestId("user-name")).toHaveText("Test User");
  });

  test("sidebar navigation is visible", async ({ page }) => {
    await loginAsTestUser(page);

    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  });

  test("sidebar shows user info", async ({ page }) => {
    await loginAsTestUser(page);

    // Use .first() since "Test User" appears in sidebar, welcome heading, and profile card
    await expect(page.getByText("Test User").first()).toBeVisible();
    await expect(page.getByText("test@example.com").first()).toBeVisible();
  });

  test("settings link navigates to /settings", async ({ page }) => {
    await loginAsTestUser(page);

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL("/settings");
  });
});
