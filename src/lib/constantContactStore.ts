import "server-only";

import { kv } from "@vercel/kv";

/**
 * Persistent store for the Constant Contact OAuth tokens. Constant Contact
 * rotates the refresh token on every use, so a build-time env var can't hold
 * it — this needs a store a running serverless function can read AND write.
 * Vercel KV (Upstash Redis) fills that role; it requires a KV store
 * connected to this Vercel project (Project → Storage → Create Database).
 * Until one exists, every call here throws, which surfaces to the newsletter
 * form as "Constant Contact is not connected yet" — the same failure mode as
 * before the one-time OAuth setup runs (PROJECT.md §8).
 */

const KV_KEY = "constantContactAuth";

export type ConstantContactAuth = {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  listId?: string;
  updatedAt?: string;
};

export async function getConstantContactAuth(): Promise<ConstantContactAuth | null> {
  return (await kv.get<ConstantContactAuth>(KV_KEY)) ?? null;
}

/** Full replace — used by the OAuth callback, so re-running setup is always safe. */
export async function setConstantContactAuth(record: ConstantContactAuth): Promise<void> {
  await kv.set(KV_KEY, record);
}

/** Partial merge — for updating single fields (cached list id, refreshed tokens). */
export async function patchConstantContactAuth(
  patch: Partial<ConstantContactAuth>
): Promise<void> {
  const current = await getConstantContactAuth();
  await kv.set(KV_KEY, { ...current, ...patch });
}
