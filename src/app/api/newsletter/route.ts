import { NextResponse } from "next/server";
import { addNewsletterSignup } from "@/lib/constantContact";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { clean, isEmail, readJsonBody } from "@/lib/sanitize";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  botcheck?: string;
};

const MAX_EMAIL = 254; // RFC 5321 upper bound
const MAX_NAME = 100;
const MAX_BODY_BYTES = 5_000; // three short fields; same guard as /api/inquiry
const RATE_LIMIT = { limit: 5, windowSeconds: 10 * 60 }; // per IP

export async function POST(request: Request) {
  // Cheap pre-check; the real cap is enforced on the bytes read below.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  if (!(await rateLimit({ key: "newsletter", ip: clientIp(request), ...RATE_LIMIT }))) {
    return NextResponse.json(
      { error: "Too many sign-up attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const parsed = await readJsonBody<Payload>(request, MAX_BODY_BYTES);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.status === 413 ? "Request too large." : "Invalid request." },
      { status: parsed.status }
    );
  }
  const { body } = parsed;

  // Honeypot: real people never fill this in. Pretend it worked so bots don't retry.
  if (body.botcheck) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email, MAX_EMAIL);
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const firstName = clean(body.firstName, MAX_NAME);
  const lastName = clean(body.lastName, MAX_NAME);

  try {
    await addNewsletterSignup({ email, firstName, lastName });
  } catch (error) {
    console.error("[newsletter] Constant Contact sign-up failed", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
