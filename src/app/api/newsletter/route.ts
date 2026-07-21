import { NextResponse } from "next/server";
import { addNewsletterSignup } from "@/lib/constantContact";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  botcheck?: string;
};

const MAX_EMAIL = 254; // RFC 5321 upper bound
const MAX_NAME = 100;

// Matches api/inquiry/route.ts's clean(): strip control characters, trim, cap
// length. Built via `new RegExp` (not a /.../ literal) so the \u escapes stay
// as literal source text through this file's write path.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001f\\u007f]+", "g");

function clean(value: string | undefined, max: number): string {
  return (value ?? "").replace(CONTROL_CHARS, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this in. Pretend it worked so bots don't retry.
  if (body.botcheck) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email, MAX_EMAIL);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
