import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server for Node.js environments (Vitest tests).
 * Import this in test setup to enable API mocking.
 */
export const server = setupServer(...handlers);
