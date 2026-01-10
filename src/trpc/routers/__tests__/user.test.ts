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

vi.mock("@/db", () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: "1", name: "Updated" }]),
    delete: vi.fn().mockReturnThis(),
  },
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
    ip: "127.0.0.1",
  });
};

describe("userRouter", () => {
  describe("me", () => {
    it("returns user data when authenticated", async () => {
      const caller = createCaller({ session: mockSession, user: mockUser });
      const result = await caller.user.me();
      expect(result).toEqual(mockUser);
    });

    it("throws UNAUTHORIZED when session is null", async () => {
      const caller = createCaller(null);
      await expect(caller.user.me()).rejects.toThrow(TRPCError);
      await expect(caller.user.me()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("updateProfile", () => {
    it("updates name and returns updated user", async () => {
      const caller = createCaller({ session: mockSession, user: mockUser });
      const result = await caller.user.updateProfile({ name: "New Name" });
      expect(result).toHaveProperty("name");
    });

    it("throws UNAUTHORIZED when not authenticated", async () => {
      const caller = createCaller(null);
      await expect(caller.user.updateProfile({ name: "New" })).rejects.toThrow(
        TRPCError,
      );
    });
  });

  describe("deleteAccount", () => {
    it("throws error with wrong confirmation", async () => {
      const caller = createCaller({ session: mockSession, user: mockUser });
      await expect(
        caller.user.deleteAccount({ confirmation: "wrong" }),
      ).rejects.toThrow();
    });

    it("succeeds with correct confirmation", async () => {
      const caller = createCaller({ session: mockSession, user: mockUser });
      const result = await caller.user.deleteAccount({
        confirmation: "DELETE",
      });
      expect(result).toEqual({ success: true });
    });
  });
});
