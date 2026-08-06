import { NextRequest, NextResponse } from "next/server";
import { SITE_PIN_COOKIE } from "@/lib/site-pin";

// Basic "coming soon" gate — a shared PIN to keep casual visitors off the
// site before launch, not a real auth system. See PROJECT.md §6.

// Requests these paths must reach with no cookie at all, or the gate can
// never be passed (the form itself) or a third party's redirect breaks
// (Constant Contact's OAuth callback — see PROJECT.md §11).
const BYPASS_PATHS = new Set([
  "/site-pin",
  "/api/site-pin",
  "/api/constant-contact/oauth/callback",
]);

export function middleware(request: NextRequest) {
  const pin = process.env.SITE_ACCESS_PIN;
  // Unset = gate not configured yet. Fail OPEN so forgetting to set the env
  // var in Vercel doesn't lock everyone, including Jake, out of the site.
  if (!pin) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (BYPASS_PATHS.has(pathname)) return NextResponse.next();

  if (request.cookies.get(SITE_PIN_COOKIE)?.value === pin) {
    return NextResponse.next();
  }

  const gateUrl = new URL("/site-pin", request.url);
  gateUrl.searchParams.set("next", pathname + request.nextUrl.search);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mov|pdf|docx?|xlsx?|txt|xml|webmanifest|woff2?)$).*)",
  ],
};
