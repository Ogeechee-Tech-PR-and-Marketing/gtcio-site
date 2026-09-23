import "server-only";

import { Redis } from "@upstash/redis";

/**
 * The one Redis client. The store is Upstash for Redis from the Vercel
 * Marketplace (PROJECT.md §8/§13), which still injects the KV_REST_API_URL /
 * KV_REST_API_TOKEN pair the retired @vercel/kv package read. It holds the
 * Constant Contact tokens, the rate-limit counters and undelivered inquiries.
 */
export function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

let client: Redis | null = null;

/** Lazily built so importing this module never throws; callers check kvConfigured() first or catch. */
export function kv(): Redis {
  if (!client) {
    if (!kvConfigured()) throw new Error("KV_REST_API_URL / KV_REST_API_TOKEN are not set.");
    client = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! });
  }
  return client;
}
