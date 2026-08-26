import "server-only";

/**
 * Sends notification emails via Microsoft Graph, using an Azure AD app
 * registration's client-credentials grant (an OTC Microsoft 365 tenant admin
 * has to register the app and grant it Mail.Send once — see PROJECT.md §5
 * for the exact steps). Unlike Constant Contact's OAuth (src/lib/constantContact.ts),
 * client-credentials tokens aren't rotated on use, so there's no refresh
 * token to persist anywhere — an in-memory cache that just re-fetches on
 * expiry is sufficient, even though it won't survive a cold serverless start.
 */

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

// Refresh a bit before actual expiry so a slow request never straddles it.
const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

let cachedToken: { token: string; expiresAt: number } | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

export function isConfigured(): boolean {
  return Boolean(
    process.env.MS_GRAPH_TENANT_ID &&
      process.env.MS_GRAPH_CLIENT_ID &&
      process.env.MS_GRAPH_CLIENT_SECRET &&
      process.env.MS_GRAPH_SENDER_EMAIL
  );
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return cachedToken.token;
  }

  const tenantId = requireEnv("MS_GRAPH_TENANT_ID");
  const clientId = requireEnv("MS_GRAPH_CLIENT_ID");
  const clientSecret = requireEnv("MS_GRAPH_CLIENT_SECRET");

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Microsoft Graph token request failed: ${response.status} ${await response.text()}`
    );
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
};

/**
 * Sends as the mailbox in MS_GRAPH_SENDER_EMAIL. The Azure app registration
 * should be scoped with an Exchange application access policy to that one
 * mailbox — Mail.Send on its own lets the app send as ANY mailbox in the
 * tenant, which is far more access than this integration needs.
 */
export async function sendMail({ to, subject, text, replyTo }: SendMailInput): Promise<void> {
  const senderEmail = requireEnv("MS_GRAPH_SENDER_EMAIL");
  const accessToken = await getAccessToken();

  const response = await fetch(`${GRAPH_BASE}/users/${encodeURIComponent(senderEmail)}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "Text", content: text },
        toRecipients: [{ emailAddress: { address: to } }],
        replyTo: [{ emailAddress: { address: replyTo } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Microsoft Graph sendMail failed: ${response.status} ${await response.text()}`);
  }
}
