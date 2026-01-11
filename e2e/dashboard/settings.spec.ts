import { expect, test } from "@playwright/test";

test.describe("Settings Page - Unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Settings Page - Authenticated", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("shows error for empty name", async ({ page }) => {
    const nameInput = page.getByRole("textbox", { name: "Name" });
    await nameInput.clear();
    await page.getByRole("button", { name: "Update Name" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("tabs navigate between Profile and Security", async ({ page }) => {
    // Navigate to Security tab
    await page.getByRole("tab", { name: "Security" }).click();
    await expect(page.getByText("Danger Zone")).toBeVisible();

    // Navigate back to Profile tab
    await page.getByRole("tab", { name: "Profile" }).click();
    await expect(page.getByText("Profile Information")).toBeVisible();
  });

  test("delete account dialog validates confirmation input", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Security" }).click();

    await page.getByRole("button", { name: "Delete Account" }).click();
    const dialog = page.getByRole("alertdialog", {
      name: "Are you absolutely sure?",
    });
    await expect(dialog).toBeVisible();

    // Wrong input shows validation error
    await dialog.getByLabel(/Type.*DELETE.*to confirm/i).fill("delete");
    await dialog.getByRole("button", { name: "Delete Account" }).click();
    await expect(
      page
        .locator('[data-slot="form-message"]')
        .getByText("Type DELETE to confirm"),
    ).toBeVisible();
  });

  test("delete account dialog cancel closes without action", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Security" }).click();

    await page.getByRole("button", { name: "Delete Account" }).click();
    const dialog = page.getByRole("alertdialog", {
      name: "Are you absolutely sure?",
    });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL("/settings");
  });
});
