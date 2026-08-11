import "server-only";

import { kv } from "@vercel/kv";

/**
 * Persistent store for the Constant Contact OAuth tokens — moved off Sanity
 * 2026-08-11 when the CMS was removed. Constant Contact rotates the refresh
 * token on every use, so a build-time env var can't hold it; this needs a
 * store a running serverless function can read AND write. Vercel KV (backed
 * by Upstash Redis) fills the same role Sanity's `drafts.constantContactAuth`
 * document used to. Requires a KV store connected to this Vercel project
 * (Project → Storage → Create Database) — until one exists, every call here
 * throws, which surfaces as "Constant Contact is not connected yet" to the
 * newsletter form, same failure mode as before the one-time OAuth setup runs.
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

/** Full replace — mirrors the old Sanity `createOrReplace` used by the OAuth callback. */
export async function setConstantContactAuth(record: ConstantContactAuth): Promise<void> {
  await kv.set(KV_KEY, record);
}

/** Partial merge — mirrors the old Sanity `.patch(id).set({...}).commit()` calls. */
export async function patchConstantContactAuth(
  patch: Partial<ConstantContactAuth>
): Promise<void> {
  const current = await getConstantContactAuth();
  await kv.set(KV_KEY, { ...current, ...patch });
}
