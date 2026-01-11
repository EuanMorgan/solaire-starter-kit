import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../helpers/auth";

test.describe("Settings Page", () => {
  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/login");
  });

  test("shows error for empty name", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    const nameInput = page.getByRole("textbox", { name: "Name" });
    await nameInput.clear();
    await page.getByRole("button", { name: "Update Name" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("tabs navigate between Profile and Security", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");

    // Security tab accessible
    await page.getByTestId("security-tab").click();
    await expect(page.getByText("Danger Zone")).toBeVisible();
  });

  test("delete account dialog validates confirmation input", async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");
    await page.getByTestId("security-tab").click();

    await page.getByTestId("delete-account-btn").click();
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    // Wrong input shows validation error
    await page.getByTestId("delete-confirmation-input").fill("delete");
    await page.getByTestId("delete-confirm-btn").click();
    await expect(
      page
        .locator('[data-slot="form-message"]')
        .getByText("Type DELETE to confirm"),
    ).toBeVisible();
  });

  test("delete account dialog cancel closes without action", async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");
    await page.getByTestId("security-tab").click();

    await page.getByTestId("delete-account-btn").click();
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    await page.getByTestId("delete-cancel-btn").click();
    await expect(
      page.getByRole("alertdialog", { name: "Are you absolutely sure?" }),
    ).not.toBeVisible();
    await expect(page).toHaveURL("/settings");
  });
});
