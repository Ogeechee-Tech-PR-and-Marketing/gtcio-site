import "server-only";

import * as resend from "./resendMail";
import * as graph from "./graphMail";

/**
 * The one place /api/inquiry gets its email sender from. Picks the first
 * configured provider:
 *
 *   1. Resend  — RESEND_API_KEY set (Vercel Marketplace). Sends as gtcio.org.
 *   2. Graph   — all four MS_GRAPH_* set. Sends as an OTC mailbox. Kept so the
 *                institutional route can take over without a code change if
 *                OTC's tenant admin ever registers the app (PROJECT.md §5).
 *   3. none    — the route parks the submission in KV (inquiryStore.ts).
 *
 * Swap order or providers here, not in the route.
 */
type Provider = {
  name: string;
  isConfigured: () => boolean;
  sendMail: typeof resend.sendMail;
};

const PROVIDERS: Provider[] = [
  { name: "resend", isConfigured: resend.isConfigured, sendMail: resend.sendMail },
  { name: "graph", isConfigured: graph.isConfigured, sendMail: graph.sendMail },
];

function active(): Provider | undefined {
  return PROVIDERS.find((p) => p.isConfigured());
}

/** Name of the provider that will send, or null if none is configured. */
export function mailProvider(): string | null {
  return active()?.name ?? null;
}

export function isConfigured(): boolean {
  return active() !== undefined;
}

export async function sendMail(input: Parameters<Provider["sendMail"]>[0]): Promise<void> {
  const provider = active();
  if (!provider) throw new Error("No email provider is configured.");
  await provider.sendMail(input);
}
