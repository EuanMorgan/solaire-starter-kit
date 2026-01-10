import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Solaire/);
  });

  test("homepage shows main content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByAltText("Next.js logo")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Documentation" }),
    ).toBeVisible();
  });

  test("login page is accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("dashboard redirects unauthenticated users to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });
});
