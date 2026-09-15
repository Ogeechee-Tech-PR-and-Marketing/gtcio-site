import "server-only";

/**
 * Sends notification emails through Resend (installed via the Vercel
 * Marketplace, which injects RESEND_API_KEY). Sends AS a gtcio.org address —
 * the domain has to be verified in Resend's dashboard (three DNS records at
 * GoDaddy) before anything is delivered. See PROJECT.md §5.
 *
 * Plain fetch against the REST API; the official SDK adds nothing this
 * needs. `reply_to` is snake_case on the REST endpoint.
 */
const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "GTCIO Website <website@gtcio.org>";

export function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
};

export async function sendMail({ to, subject, text, replyTo }: SendMailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");

  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || DEFAULT_FROM,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend send failed: ${response.status} ${await response.text()}`);
  }
}
