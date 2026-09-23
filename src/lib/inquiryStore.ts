import "server-only";

import { kv, kvConfigured } from "./kv";

/**
 * Safety net for form submissions the notification email could not carry —
 * no email provider configured or a send failure (PROJECT.md §5). Each
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

export const inquiryStoreConfigured = kvConfigured;

export async function storeUndeliveredInquiry(record: StoredInquiry): Promise<void> {
  await kv().lpush(KEY, record);
  await kv().ltrim(KEY, 0, MAX_STORED - 1);
}
