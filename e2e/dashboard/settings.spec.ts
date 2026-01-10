import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../helpers/auth";

test.describe("Settings Page", () => {
  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/login");
  });

  test("tabs switch between Profile and Security sections", async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Profile tab is active by default
    await expect(page.getByTestId("profile-tab")).toHaveAttribute(
      "data-state",
      "active",
    );
    await expect(page.getByText("Profile Information")).toBeVisible();

    // Click Security tab
    await page.getByTestId("security-tab").click();
    await expect(page.getByTestId("security-tab")).toHaveAttribute(
      "data-state",
      "active",
    );
    await expect(page.getByText("Danger Zone")).toBeVisible();

    // Switch back to Profile tab
    await page.getByTestId("profile-tab").click();
    await expect(page.getByTestId("profile-tab")).toHaveAttribute(
      "data-state",
      "active",
    );
    await expect(page.getByText("Profile Information")).toBeVisible();
  });

  test("profile tab displays current user name and email", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    await expect(page.getByTestId("settings-email")).toHaveText(
      "test@example.com",
    );
    await expect(page.getByTestId("settings-name")).toHaveText("Test User");
  });

  test("delete account shows confirmation dialog", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Navigate to Security tab
    await page.getByTestId("security-tab").click();

    // Click delete account button
    await page.getByTestId("delete-account-btn").click();

    // Dialog should be visible
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).toBeVisible();
    await expect(page.getByTestId("delete-confirmation-input")).toBeVisible();
    await expect(page.getByTestId("delete-cancel-btn")).toBeVisible();
    await expect(page.getByTestId("delete-confirm-btn")).toBeVisible();
  });

  test("cancel on delete dialog closes it without action", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Navigate to Security tab
    await page.getByTestId("security-tab").click();

    // Open delete dialog
    await page.getByTestId("delete-account-btn").click();
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    // Click cancel
    await page.getByTestId("delete-cancel-btn").click();

    // Dialog should be closed
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).not.toBeVisible();

    // User should still be on settings page, logged in
    await expect(page).toHaveURL("/settings");
  });

  test("delete confirmation validates input", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Navigate to Security tab
    await page.getByTestId("security-tab").click();

    // Open delete dialog
    await page.getByTestId("delete-account-btn").click();

    // Type wrong confirmation
    await page.getByTestId("delete-confirmation-input").fill("delete");
    await page.getByTestId("delete-confirm-btn").click();

    // Should show error message (not the label)
    await expect(
      page
        .locator('[data-slot="form-message"]')
        .getByText("Type DELETE to confirm"),
    ).toBeVisible();
  });

  test("security tab shows change password option", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Navigate to Security tab
    await page.getByTestId("security-tab").click();

    // Should show password section with card title
    await expect(
      page
        .locator('[data-slot="card-title"]')
        .getByText("Password", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Change Password" }),
    ).toBeVisible();
  });
});
