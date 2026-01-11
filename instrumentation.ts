export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.MOCK_EMAIL === "true"
  ) {
    const { server } = await import("@/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
    console.log("[MSW] Email mocking enabled - emails saved to .emails/");
  }
}
