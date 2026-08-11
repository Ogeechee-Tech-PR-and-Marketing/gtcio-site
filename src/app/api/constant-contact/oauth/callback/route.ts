import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { setConstantContactAuth } from "@/lib/constantContactStore";
import { SITE_URL } from "@/lib/site";

const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";

function textResponse(body: string, status: number) {
  return new NextResponse(body, { status, headers: { "Content-Type": "text/plain" } });
}

/**
 * The state minted by the start route is `<nonce>.<hmac(nonce, setup secret)>`.
 * Verifying the signature here — not just cookie equality — is what ties the
 * callback back to the secret-gated start step. Cookie equality alone is NOT
 * enough: an attacker completing a flow in their own browser controls their
 * own cookies, so they could otherwise connect their own Constant Contact
 * account and quietly receive every future newsletter signup.
 */
function isValidState(state: string): boolean {
  const setupSecret = process.env.CONSTANT_CONTACT_SETUP_SECRET;
  if (!setupSecret) return false;
  const [nonce, signature] = state.split(".");
  if (!nonce || !signature) return false;
  const expected = createHmac("sha256", setupSecret).update(nonce).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const cookieState = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)cc_oauth_state=([^;]+)/)?.[1];

  if (error) {
    return textResponse(`Constant Contact authorization failed: ${error}`, 400);
  }
  if (!code || !state || !cookieState || state !== cookieState || !isValidState(state)) {
    return textResponse(
      "Invalid or expired authorization request. Start over at /api/constant-contact/oauth/start.",
      400
    );
  }

  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID;
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return textResponse("CONSTANT_CONTACT_CLIENT_ID / CONSTANT_CONTACT_CLIENT_SECRET are not set.", 500);
  }

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${SITE_URL}/api/constant-contact/oauth/callback`,
    }),
  });

  if (!tokenResponse.ok) {
    return textResponse(
      `Token exchange failed: ${tokenResponse.status} ${await tokenResponse.text()}`,
      502
    );
  }

  const tokens = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  // Full replace: re-running setup (e.g. to reconnect after a revoke) should
  // overwrite the stale tokens, not merge with them.
  await setConstantContactAuth({
    accessToken: tokens.access_token,
    accessTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    refreshToken: tokens.refresh_token,
    updatedAt: new Date().toISOString(),
  });

  const response = textResponse(
    "Constant Contact is connected. New footer sign-ups will now be added to the \"GTCIO Website Sign-ups\" list. You can close this tab.",
    200
  );
  response.cookies.delete("cc_oauth_state");
  return response;
}
