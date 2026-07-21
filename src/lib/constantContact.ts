import "server-only";

import { writeClient } from "@/sanity/lib/writeClient";

/**
 * Adds a website newsletter sign-up to Constant Contact.
 *
 * Auth is a one-time OAuth authorization-code grant, run manually by a human
 * once (see src/app/api/constant-contact/oauth/start/route.ts and
 * PROJECT.md's Constant Contact section for the exact steps). After that,
 * this module refreshes its own access token forever using the stored
 * refresh token — no further human involvement.
 *
 * Tokens live in a single Sanity draft document (never published — see
 * sanity/schemaTypes/documents/constantContactAuth.ts for why) rather than an
 * env var, because Constant Contact rotates the refresh token on every use:
 * each refresh call returns a NEW refresh token that must be saved for next
 * time, which only a writable store (not a build-time env var) can do.
 */

const AUTH_DOC_ID = "drafts.constantContactAuth";
const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";
const API_BASE = "https://api.cc.email/v3";
const LIST_NAME = "GTCIO Website Sign-ups";

// Refresh a bit before actual expiry so a slow request never straddles it.
const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

type AuthDoc = {
  _id: string;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  listId?: string;
};

function basicAuthHeader(): string {
  const id = process.env.CONSTANT_CONTACT_CLIENT_ID;
  const secret = process.env.CONSTANT_CONTACT_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "CONSTANT_CONTACT_CLIENT_ID / CONSTANT_CONTACT_CLIENT_SECRET are not set."
    );
  }
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

async function getAuthDoc(): Promise<AuthDoc | null> {
  // perspective: "raw" is required here — the client's default perspective
  // excludes draft documents from _id-based queries entirely (confirmed
  // 2026-07-21: an unqualified query for "drafts.constantContactAuth"
  // silently returned null even though the doc existed), which would make
  // every access-token refresh think Constant Contact was never connected.
  return writeClient.fetch<AuthDoc | null>(
    `*[_id == $id][0]`,
    { id: AUTH_DOC_ID },
    { perspective: "raw" }
  );
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Constant Contact token refresh failed: ${response.status} ${await response.text()}`
    );
  }

  return response.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

async function getAccessToken(): Promise<string> {
  const doc = await getAuthDoc();
  if (!doc?.refreshToken) {
    throw new Error(
      "Constant Contact is not connected yet — run the one-time setup at /api/constant-contact/oauth/start (see PROJECT.md)."
    );
  }

  const expiresAt = doc.accessTokenExpiresAt ? new Date(doc.accessTokenExpiresAt).getTime() : 0;
  if (doc.accessToken && expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return doc.accessToken;
  }

  const refreshed = await refreshAccessToken(doc.refreshToken);

  await writeClient
    .patch(AUTH_DOC_ID)
    .set({
      accessToken: refreshed.access_token,
      accessTokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      // Constant Contact rotates this on every refresh — the old value stops
      // working, so the new one MUST be saved or the next refresh fails.
      refreshToken: refreshed.refresh_token,
      updatedAt: new Date().toISOString(),
    })
    .commit();

  return refreshed.access_token;
}

async function findExistingListId(accessToken: string): Promise<string | undefined> {
  const response = await fetch(`${API_BASE}/contact_lists?limit=1000`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(
      `Constant Contact list lookup failed: ${response.status} ${await response.text()}`
    );
  }
  const { lists } = (await response.json()) as { lists: { list_id: string; name: string }[] };
  return lists.find((list) => list.name === LIST_NAME)?.list_id;
}

async function createList(accessToken: string): Promise<string> {
  const response = await fetch(`${API_BASE}/contact_lists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: LIST_NAME,
      description: "Sign-ups from the gtcio-site.vercel.app footer newsletter form.",
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Constant Contact list creation failed: ${response.status} ${await response.text()}`
    );
  }
  const created = (await response.json()) as { list_id: string };
  return created.list_id;
}

// Cached on the auth doc after the first call so every later sign-up skips
// the list lookup entirely.
async function getListId(accessToken: string): Promise<string> {
  const doc = await getAuthDoc();
  if (doc?.listId) return doc.listId;

  const listId = (await findExistingListId(accessToken)) ?? (await createList(accessToken));

  await writeClient.patch(AUTH_DOC_ID).set({ listId }).commit();
  return listId;
}

export async function addNewsletterSignup(email: string): Promise<void> {
  const accessToken = await getAccessToken();
  const listId = await getListId(accessToken);

  // /contacts/sign_up_form is purpose-built for opt-in web forms: it upserts
  // by email address (no separate lookup needed) and is meant only for
  // contacts who explicitly asked to be signed up, which this form is.
  const response = await fetch(`${API_BASE}/contacts/sign_up_form`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      list_memberships: [listId],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Constant Contact sign-up failed: ${response.status} ${await response.text()}`
    );
  }
}
