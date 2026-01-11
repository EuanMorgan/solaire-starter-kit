import { beforeEach, describe, expect, it, vi } from "vitest";

describe("sendEmail", () => {
  const mockSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Mock render function
    vi.doMock("@react-email/components", () => ({
      render: vi.fn((_, opts) =>
        opts?.plainText ? "Plain text content" : "<html>HTML content</html>",
      ),
    }));

    // Mock Resend as a class
    vi.doMock("resend", () => ({
      Resend: class MockResend {
        emails = { send: mockSend };
      },
    }));
  });

  it("returns early when RESEND_API_KEY not set", async () => {
    vi.doMock("@/env", () => ({
      env: { RESEND_API_KEY: null, FROM_EMAIL: "test@example.com" },
    }));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sendEmail } = await import("../email.service");

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Test",
      react: <div>Test</div>,
    });

    expect(result).toEqual({ data: null, error: null });
    expect(warnSpy).toHaveBeenCalledWith(
      "[email] RESEND_API_KEY not configured, skipping email send",
    );
    expect(mockSend).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("returns early when FROM_EMAIL not set", async () => {
    vi.doMock("@/env", () => ({
      env: { RESEND_API_KEY: "test-api-key", FROM_EMAIL: null },
    }));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sendEmail } = await import("../email.service");

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Test",
      react: <div>Test</div>,
    });

    expect(result).toEqual({ data: null, error: null });
    expect(warnSpy).toHaveBeenCalledWith(
      "[email] FROM_EMAIL not configured, skipping email send",
    );

    warnSpy.mockRestore();
  });

  it("calls Resend with rendered HTML and text", async () => {
    vi.doMock("@/env", () => ({
      env: { RESEND_API_KEY: "test-api-key", FROM_EMAIL: "sender@example.com" },
    }));

    mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });

    const { sendEmail } = await import("../email.service");

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Welcome",
      react: <div>Welcome!</div>,
    });

    expect(mockSend).toHaveBeenCalledWith({
      from: "Solaire <sender@example.com>",
      to: ["user@example.com"],
      subject: "Welcome",
      html: "<html>HTML content</html>",
      text: "Plain text content",
    });
    expect(result).toEqual({ data: { id: "email-123" }, error: null });
  });

  it("handles array of recipients", async () => {
    vi.doMock("@/env", () => ({
      env: { RESEND_API_KEY: "test-api-key", FROM_EMAIL: "sender@example.com" },
    }));

    mockSend.mockResolvedValue({ data: { id: "email-456" }, error: null });

    const { sendEmail } = await import("../email.service");

    await sendEmail({
      to: ["a@example.com", "b@example.com"],
      subject: "Test",
      react: <div>Test</div>,
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["a@example.com", "b@example.com"],
      }),
    );
  });

  it("logs error on Resend failure", async () => {
    vi.doMock("@/env", () => ({
      env: { RESEND_API_KEY: "test-api-key", FROM_EMAIL: "sender@example.com" },
    }));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSend.mockResolvedValue({
      data: null,
      error: { message: "API error" },
    });

    const { sendEmail } = await import("../email.service");

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Test",
      react: <div>Test</div>,
    });

    expect(errorSpy).toHaveBeenCalledWith("[email] Failed to send email:", {
      message: "API error",
    });
    expect(result).toEqual({ data: null, error: { message: "API error" } });

    errorSpy.mockRestore();
  });
});
