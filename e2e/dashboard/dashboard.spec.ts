import { expect, test } from "@playwright/test";

test.describe("Dashboard Page - Unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Dashboard Page - Authenticated", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("sees welcome message with their name", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Welcome back",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Test User",
    );
  });

  test("sees their profile info", async ({ page }) => {
    const profileCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: "Your Profile" });

    await expect(profileCard.getByText("Your Profile")).toBeVisible();
    await expect(profileCard.getByText("test@example.com")).toBeVisible();
    await expect(profileCard.getByText("Test User")).toBeVisible();
  });

  test("sidebar navigation is visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  });

  test("sidebar shows user info", async ({ page }) => {
    // Use .first() since "Test User" appears in sidebar, welcome heading, and profile card
    await expect(page.getByText("Test User").first()).toBeVisible();
    await expect(page.getByText("test@example.com").first()).toBeVisible();
  });

  test("settings link navigates to /settings", async ({ page }) => {
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL("/settings");
  });
});
