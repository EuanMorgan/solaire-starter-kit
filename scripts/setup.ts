#!/usr/bin/env bun
/**
 * Setup script for new developers.
 * Run with: bun run setup
 */

import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dirname, "..");
const ENV_FILE = join(ROOT, ".env");
const ENV_EXAMPLE = join(ROOT, ".env.example");

const REQUIRED_VARS = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "NEXT_PUBLIC_BASE_URL",
];

function log(msg: string) {
  console.log(`\x1b[36m[setup]\x1b[0m ${msg}`);
}

function error(msg: string) {
  console.error(`\x1b[31m[error]\x1b[0m ${msg}`);
}

function success(msg: string) {
  console.log(`\x1b[32m[success]\x1b[0m ${msg}`);
}

function warn(msg: string) {
  console.log(`\x1b[33m[warn]\x1b[0m ${msg}`);
}

// Step 1: Check/copy .env
log("Checking .env file...");
if (!existsSync(ENV_FILE)) {
  if (existsSync(ENV_EXAMPLE)) {
    copyFileSync(ENV_EXAMPLE, ENV_FILE);
    success("Created .env from .env.example");
  } else {
    error(".env.example not found!");
    process.exit(1);
  }
} else {
  log(".env already exists, skipping copy");
}

// Step 2: Install dependencies
log("Installing dependencies...");
await $`bun install`.cwd(ROOT);
success("Dependencies installed");

// Step 3: Check required env vars
log("Checking required environment variables...");
const envContent = readFileSync(ENV_FILE, "utf-8");
const envVars: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex);
      const value = trimmed.slice(eqIndex + 1);
      envVars[key] = value;
    }
  }
}

const missing: string[] = [];
for (const v of REQUIRED_VARS) {
  const val = envVars[v];
  if (!val || val === "" || val.includes("change-me")) {
    missing.push(v);
  }
}

if (missing.length > 0) {
  warn(`Missing or placeholder values for: ${missing.join(", ")}`);
  warn("Please update .env with valid values before running the app.");
  warn(
    "DATABASE_URL: postgres://postgres:postgres@localhost:5435/solaire (if using docker-compose)",
  );
  warn("BETTER_AUTH_SECRET: run 'openssl rand -base64 32' to generate");
} else {
  success("All required env vars are set");
}

// Step 4: Setup database (only if DATABASE_URL looks valid)
const dbUrl = envVars.DATABASE_URL;
if (dbUrl && !dbUrl.includes("change-me") && dbUrl.startsWith("postgres")) {
  log("Pushing database schema...");
  try {
    await $`bun run db:push`.cwd(ROOT);
    success("Database schema pushed");
  } catch {
    warn(
      "Failed to push schema - ensure PostgreSQL is running (docker-compose up -d)",
    );
  }
} else {
  warn("Skipping db:push - DATABASE_URL not configured");
}

console.log("");
success("Setup complete!");
console.log("");
log("Next steps:");
console.log("  1. Ensure PostgreSQL is running: docker-compose up -d");
console.log("  2. Update .env with valid values if prompted above");
console.log("  3. Run bun run db:seed to create test user");
console.log("  4. Run bun dev to start development server");
