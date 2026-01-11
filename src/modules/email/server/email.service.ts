import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "@/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured, skipping email send");
    return { data: null, error: null };
  }

  if (!env.FROM_EMAIL) {
    console.warn("[email] FROM_EMAIL not configured, skipping email send");
    return { data: null, error: null };
  }

  // Render both HTML and plain text for email client compatibility
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ]);

  const { data, error } = await resend.emails.send({
    from: env.FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] Failed to send email:", error);
  }

  return { data, error };
}
