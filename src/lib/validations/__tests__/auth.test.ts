import { describe, expect, it } from "vitest";
import {
  loginSchema,
  magicLinkSchema,
  resetPasswordSchema,
  signupSchema,
} from "../auth";

describe("loginSchema", () => {
  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password under 8 chars", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("rejects password without uppercase", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Passwordd",
      confirmPassword: "Passwordd",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirmPassword", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (issue) => issue.path[0] === "confirmPassword",
      );
      expect(confirmPasswordError).toBeDefined();
    }
  });

  it("accepts valid input with all requirements", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = signupSchema.safeParse({
      name: "",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(false);
  });
});

describe("magicLinkSchema", () => {
  it("rejects invalid email", () => {
    const result = magicLinkSchema.safeParse({
      email: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid email", () => {
    const result = magicLinkSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordSchema", () => {
  it("rejects password under 8 chars", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Short1",
      confirmPassword: "Short1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Passwordd",
      confirmPassword: "Passwordd",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirmPassword", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmPasswordError = result.error.issues.find(
        (issue) => issue.path[0] === "confirmPassword",
      );
      expect(confirmPasswordError).toBeDefined();
    }
  });

  it("accepts valid password with all requirements", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });
});
