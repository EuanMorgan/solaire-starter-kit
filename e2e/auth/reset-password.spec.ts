import { expect, test } from "@playwright/test";

test.describe("Reset Password Page", () => {
  test("shows invalid link message when no token provided", async ({
    page,
  }) => {
    await page.goto("/reset-password");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Invalid Link")).toBeVisible();
    await expect(
      page.getByText("This password reset link is invalid or has expired"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a new link" }),
    ).toBeVisible();
  });

  test("'Request a new link' navigates to /forgot-password", async ({
    page,
  }) => {
    await page.goto("/reset-password");
    await page.getByRole("link", { name: "Request a new link" }).click();
    await expect(page).toHaveURL("/forgot-password");
  });

  test.describe("with token", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/reset-password?token=test-token");
    });

    test("renders reset password form when token provided", async ({
      page,
    }) => {
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByText("Enter your new password below"),
      ).toBeVisible();
      await expect(page.getByLabel("New Password")).toBeVisible();
      await expect(page.getByLabel("Confirm Password")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Reset password" }),
      ).toBeVisible();
    });

    test("shows validation error for password too short", async ({ page }) => {
      await page.getByLabel("New Password").fill("short");
      await page.getByLabel("Confirm Password").fill("short");
      await page.getByRole("button", { name: "Reset password" }).click();

      await expect(
        page.getByText("Password must be at least 8 characters"),
      ).toBeVisible();
    });

    test("shows validation error for password without uppercase", async ({
      page,
    }) => {
      await page.getByLabel("New Password").fill("password123");
      await page.getByLabel("Confirm Password").fill("password123");
      await page.getByRole("button", { name: "Reset password" }).click();

      await expect(
        page.getByText("Password must contain at least one uppercase letter"),
      ).toBeVisible();
    });

    test("shows validation error for password without number", async ({
      page,
    }) => {
      await page.getByLabel("New Password").fill("Password");
      await page.getByLabel("Confirm Password").fill("Password");
      await page.getByRole("button", { name: "Reset password" }).click();

      await expect(
        page.getByText("Password must contain at least one number"),
      ).toBeVisible();
    });

    test("shows validation error for password mismatch", async ({ page }) => {
      await page.getByLabel("New Password").fill("Password123");
      await page.getByLabel("Confirm Password").fill("Password456");
      await page.getByRole("button", { name: "Reset password" }).click();

      await expect(page.getByText("Passwords do not match")).toBeVisible();
    });

    test("'Back to login' link navigates to /login", async ({ page }) => {
      await page.getByRole("link", { name: "Back to login" }).click();
      await expect(page).toHaveURL("/login");
    });
  });
});
