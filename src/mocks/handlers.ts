import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HttpResponse, http } from "msw";

/**
 * MSW request handlers for local dev email mocking.
 */
export const handlers = [
  // Mock Resend API - writes emails to .emails/*.json
  http.post("https://api.resend.com/emails", async ({ request }) => {
    const body = (await request.json()) as {
      from: string;
      to: string | string[];
      subject: string;
      html?: string;
      text?: string;
    };

    const timestamp = Date.now();
    const recipients = Array.isArray(body.to) ? body.to : [body.to];
    const safeRecipient = recipients[0]
      .replace(/[^a-zA-Z0-9@._-]/g, "_")
      .slice(0, 50);

    const dir = join(process.cwd(), ".emails");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filename = `${timestamp}-${safeRecipient}.json`;
    writeFileSync(
      join(dir, filename),
      JSON.stringify(
        {
          id: `mock-${timestamp}`,
          timestamp: new Date().toISOString(),
          from: body.from,
          to: recipients,
          subject: body.subject,
          html: body.html ?? null,
          text: body.text ?? null,
        },
        null,
        2,
      ),
    );

    console.log(`[MSW] Email saved: .emails/${filename}`);
    return HttpResponse.json({ id: `mock-${timestamp}` });
  }),
];
