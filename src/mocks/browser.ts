import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW worker for browser environments.
 * Use this for Storybook or manual browser testing.
 *
 * To use in browser:
 * 1. Run `bunx msw init public/` to generate the service worker
 * 2. Import and start this worker in your app entry point
 */
export const worker = setupWorker(...handlers);
