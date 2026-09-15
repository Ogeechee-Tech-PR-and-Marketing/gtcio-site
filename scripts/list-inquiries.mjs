#!/usr/bin/env node
// Lists form submissions that could not be emailed and were parked in the KV
// store instead (src/lib/inquiryStore.ts). Reads KV_REST_API_URL /
// KV_REST_API_TOKEN from .env.local — run `npx vercel env pull .env.local`
// first if those are blank. Read-only; nothing is deleted.
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@vercel/kv";

const envPath = new URL("../.env.local", import.meta.url);
const env = existsSync(envPath)
  ? Object.fromEntries(
      readFileSync(envPath, "utf8")
        .split("\n")
        .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
        .map((line) => {
          const i = line.indexOf("=");
          return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"|"$/g, "")];
        })
    )
  : {};

const url = process.env.KV_REST_API_URL || env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN || env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error("KV_REST_API_URL / KV_REST_API_TOKEN are not set. Run: npx vercel env pull .env.local");
  process.exit(1);
}

const kv = createClient({ url, token });
const items = await kv.lrange("inquiries:undelivered", 0, -1);
if (!items.length) {
  console.log("No undelivered inquiries.");
  process.exit(0);
}
console.log(`${items.length} undelivered inquir${items.length === 1 ? "y" : "ies"} (newest first):\n`);
for (const item of items) {
  console.log("=".repeat(72));
  console.log(`${item.receivedAt}  [${item.formType}]  to: ${item.intendedRecipients.join(", ")}`);
  console.log(`Subject:  ${item.subject}`);
  console.log(`Reply-To: ${item.replyTo}\n`);
  console.log(item.body);
  console.log();
}
