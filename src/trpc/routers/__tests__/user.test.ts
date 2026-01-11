import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    DATABASE_URL: "postgres://test:test@localhost:5432/test",
    BETTER_AUTH_SECRET: "test-secret-key-for-testing-purposes",
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    TABLE_PREFIX: "test_",
  },
}));

vi.mock("@/modules/user/server", () => ({
  getUserStats: vi.fn().mockResolvedValue({
    accountAgeDays: 30,
    emailVerified: true,
    profileComplete: true,
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  ratelimit: null,
}));

// Import after mocks
const { appRouter } = await import("../_app");

const mockUser = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession = {
  id: "session-123",
  userId: "user-123",
  token: "test-token",
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  createdAt: new Date(),
  updatedAt: new Date(),
};

type MockSessionData = { session: typeof mockSession; user: typeof mockUser };

const createCaller = (sessionData: MockSessionData | null) => {
  return appRouter.createCaller({
    session: sessionData,
    ip: "localhost",
  });
};

describe("userRouter", () => {
  describe("stats", () => {
    it("returns user stats when authenticated", async () => {
      const caller = createCaller({ session: mockSession, user: mockUser });
      const result = await caller.user.stats();
      expect(result).toEqual({
        accountAgeDays: 30,
        emailVerified: true,
        profileComplete: true,
      });
    });

    it("throws UNAUTHORIZED when not authenticated", async () => {
      const caller = createCaller(null);
      await expect(caller.user.stats()).rejects.toThrow(TRPCError);
    });
  });
});
