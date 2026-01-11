import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW worker for browser environments (Storybook).
 * Note: Email mocking uses server.ts via instrumentation.ts, not this.
 */
export const worker = setupWorker(...handlers);
