import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

/**
 * One-time, human-run step: visit
 * https://gtcio-site.vercel.app/api/constant-contact/oauth/start?secret=<CONSTANT_CONTACT_SETUP_SECRET>
 * while logged into the Constant Contact account GTCIO signups should land
 * in. Redirects to Constant Contact's own login/consent screen; approving it
 * lands back on the callback route, which stores a refresh token that
 * src/lib/constantContact.ts then renews on its own forever. See PROJECT.md.
 *
 * Gated by a shared secret (not just "requires a login") because this route
 * itself has no login of its own — anyone hitting it without the secret gets
 * a 404 rather than a real redirect to Constant Contact.
 */
const AUTHORIZE_URL = "https://authz.constantcontact.com/oauth2/default/v1/authorize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const setupSecret = process.env.CONSTANT_CONTACT_SETUP_SECRET;

  if (!setupSecret || searchParams.get("secret") !== setupSecret) {
    return new NextResponse("Not found", { status: 404 });
  }

  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("CONSTANT_CONTACT_CLIENT_ID is not set.", { status: 500 });
  }

  // The state is signed with the setup secret so the CALLBACK can also verify
  // the flow began here. Without the signature, anyone who learns the client
  // ID (client IDs are semi-public in OAuth) could authorize their OWN
  // Constant Contact account and silently become the recipient of every
  // newsletter signup — the callback route alone has no secret gate.
  const nonce = crypto.randomUUID();
  const signature = createHmac("sha256", setupSecret).update(nonce).digest("hex");
  const state = `${nonce}.${signature}`;
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${SITE_URL}/api/constant-contact/oauth/callback`);
  url.searchParams.set("response_type", "code");
  // offline_access is what makes Constant Contact issue a refresh token
  // instead of just a short-lived access token.
  url.searchParams.set("scope", "contact_data offline_access");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url.toString());
  response.cookies.set("cc_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
