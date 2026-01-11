import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5435/solaire",
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ||
        "e2e-test-secret-that-is-at-least-32-characters-long",
      NEXT_PUBLIC_BASE_URL:
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      TABLE_PREFIX: process.env.TABLE_PREFIX || "solaire_",
    },
  },
});
