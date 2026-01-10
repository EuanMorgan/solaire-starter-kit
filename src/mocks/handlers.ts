import { HttpResponse, http } from "msw";

/**
 * MSW v2 request handlers for API mocking in tests.
 * Add handlers here for any endpoints you need to mock.
 */
export const handlers = [
  // Example: Mock user.me tRPC procedure
  http.get("*/api/trpc/user.me", () => {
    return HttpResponse.json({
      result: {
        data: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          emailVerified: true,
          image: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }),

  // Example: Mock unauthorized user.me
  http.get("*/api/trpc/user.me.unauthorized", () => {
    return HttpResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        },
      },
      { status: 401 },
    );
  }),

  // Health check endpoint
  http.get("*/api/health", () => {
    return HttpResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  }),
];
