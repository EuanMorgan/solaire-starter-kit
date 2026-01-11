import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server for Node.js environments.
 * Used by:
 * - Vitest tests (via src/test/setup.ts)
 * - Next.js dev server (via instrumentation.ts when MOCK_EMAIL=true)
 */
export const server = setupServer(...handlers);
