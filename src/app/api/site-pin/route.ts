import { NextRequest, NextResponse } from "next/server";
import { SITE_PIN_COOKIE } from "@/lib/site-pin";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submitted = String(formData.get("pin") ?? "").trim();
  const next = safeNext(String(formData.get("next") ?? ""));
  const pin = process.env.SITE_ACCESS_PIN;

  if (!pin || submitted !== pin) {
    const url = new URL("/site-pin", request.url);
    url.searchParams.set("next", next);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(SITE_PIN_COOKIE, pin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
