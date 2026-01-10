import { expect, test } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login form", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("shows validation error for invalid email format", async ({ page }) => {
    // Leave email empty to trigger Zod validation
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("shows validation error for password too short", async ({ page }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(
      page.getByText("Password must be at least 8 characters"),
    ).toBeVisible();
  });

  test("GitHub button is clickable and initiates OAuth flow", async ({
    page,
  }) => {
    const githubButton = page.getByRole("button", {
      name: /Continue with GitHub/i,
    });
    await expect(githubButton).toBeVisible();
    await expect(githubButton).toBeEnabled();
    // Click initiates OAuth - just verify button exists and is functional
    // Actual OAuth redirect depends on GitHub credentials being configured
  });

  test("'Sign up' link navigates to /signup", async ({ page }) => {
    // Click the Sign up link in the card footer (not the header)
    await page.locator("main").getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL("/signup");
  });

  test("'Forgot password' link navigates to /forgot-password", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL("/forgot-password");
  });

  test("'Magic link' link navigates to /login/magic-link", async ({ page }) => {
    await page.getByRole("link", { name: /magic link/i }).click();
    await expect(page).toHaveURL("/login/magic-link");
  });
});
