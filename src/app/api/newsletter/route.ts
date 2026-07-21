import { NextResponse } from "next/server";
import { addNewsletterSignup } from "@/lib/constantContact";

type Payload = {
  email?: string;
  botcheck?: string;
};

const MAX_EMAIL = 254; // RFC 5321 upper bound

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

  const email = (body.email ?? "").trim().slice(0, MAX_EMAIL);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await addNewsletterSignup(email);
  } catch (error) {
    console.error("[newsletter] Constant Contact sign-up failed", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
