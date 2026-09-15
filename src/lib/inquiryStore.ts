import "server-only";

import { kv } from "@vercel/kv";

/**
 * Safety net for form submissions the notification email could not carry —
 * Microsoft Graph unconfigured (PROJECT.md §9) or a sendMail failure. Each
 * undelivered inquiry is pushed onto a capped Redis list in the same KV
 * store as the Constant Contact tokens, so nothing a visitor typed is lost.
 *
 * Read them with `npm run inquiries` (scripts/list-inquiries.mjs) after
 * `npx vercel env pull .env.local`. Delivered inquiries are NOT stored —
 * the email is their record — to keep personal data in the store to the
 * minimum that would otherwise vanish.
 */
const KEY = "inquiries:undelivered";
const MAX_STORED = 500;

export type StoredInquiry = {
  receivedAt: string;
  formType: string;
  subject: string;
  intendedRecipients: string[];
  replyTo: string;
  body: string;
};

export function inquiryStoreConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function storeUndeliveredInquiry(record: StoredInquiry): Promise<void> {
  await kv.lpush(KEY, record);
  await kv.ltrim(KEY, 0, MAX_STORED - 1);
}

export async function listUndeliveredInquiries(): Promise<StoredInquiry[]> {
  return kv.lrange<StoredInquiry>(KEY, 0, -1);
}
