import { NextRequest, NextResponse } from "next/server";
import { SITE_PIN_COOKIE } from "@/lib/site-pin";
import { SITE_URL } from "@/lib/site";

// Next.js 16 renamed Middleware to Proxy (same behaviour, same matcher API).
// Two jobs here:
//   1. Canonical host — in production, any non-canonical host that reaches
//      the app (gtcio-site.vercel.app) is 308'd to www.gtcio.org so search
//      engines see one origin. Gated on VERCEL_ENV so preview deployments,
//      which are also *.vercel.app, keep working.
//   2. The "coming soon" PIN gate — a shared PIN to keep casual visitors off
//      the site before launch, not a real auth system. See PROJECT.md §6.

const CANONICAL_HOST = new URL(SITE_URL).host;

// Requests these paths must reach with no cookie at all, or the gate can
// never be passed (the form itself) or a third party's redirect breaks
// (Constant Contact's OAuth callback — see PROJECT.md §8).
const BYPASS_PATHS = new Set([
  "/site-pin",
  "/api/site-pin",
  "/api/constant-contact/oauth/callback",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (process.env.VERCEL_ENV === "production" && host && host !== CANONICAL_HOST) {
    const canonical = new URL(request.nextUrl.pathname + request.nextUrl.search, SITE_URL);
    return NextResponse.redirect(canonical, 308);
  }

  const pin = process.env.SITE_ACCESS_PIN;
  // Unset = gate not configured. Fail OPEN so forgetting to set the env var
  // in Vercel doesn't lock everyone — site owner included — out.
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
