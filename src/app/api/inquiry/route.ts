import { NextResponse } from "next/server";
import { isConfigured as graphConfigured, sendMail } from "@/lib/graphMail";
import { addNewsletterSignup } from "@/lib/constantContact";

const FORM_TYPES = ["partner", "contact", "tour"] as const;
type FormType = (typeof FORM_TYPES)[number];

type Payload = {
  formType?: string;
  // The Contact form's reason checkboxes submit an array (one or more can be
  // checked); the Partner form's reason dropdown submits a single string.
  reason?: string | string[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  preferredDate?: string;
  message?: string;
  // Contact form only — "Sign me up for GTCIO's newsletter" checkbox.
  newsletterOptIn?: boolean;
  botcheck?: string;
};

// Fixed recipients — no per-request "to" field is needed the way Web3Forms
// needed a separate access key per address, since Microsoft Graph's sendMail
// takes an arbitrary recipient on every call from one shared credential.
const NOTIFY_EMAIL = "jmoore@ogeecheetech.edu"; // general inquiries — Jan Moore
const NOTIFY_EMAIL_MEDIA = "spayne@ogeecheetech.edu"; // media inquiries — Sean Payne

// Field length caps. Generous for real people, tight enough that nobody can
// stuff megabytes into the dataset or the notification email.
const MAX_SHORT = 200; // names, phone, organization, reason, date
const MAX_EMAIL = 254; // RFC 5321 upper bound
const MAX_MESSAGE = 5000;
const MAX_BODY_BYTES = 20_000;
const MAX_REASONS = 20; // the real checkbox list only has a handful; this just bounds a direct POST

/**
 * The exact label of the Contact form checkbox (contactPage.contactReasons in
 * the Studio) that routes the notification to Sean Payne instead of Jan Moore.
 * Renaming that checkbox in the Studio silently breaks this — update it here too.
 */
const MEDIA_REASON = "media inquiry";

function isFormType(v: unknown): v is FormType {
  return typeof v === "string" && (FORM_TYPES as readonly string[]).includes(v);
}

/**
 * Trim, cap length, and collapse newlines/control characters. Several of these
 * values end up in the notification email's subject line — never let a
 * submitted value smuggle CR/LF toward anything that builds email headers.
 */
function clean(value: string | undefined, max: number): string {
  return (value ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanReasons(value: string | string[] | undefined): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values
    .slice(0, MAX_REASONS)
    .map((v) => clean(v, MAX_SHORT))
    .filter(Boolean);
}

function buildSubject(formType: FormType, reason: string, who: string) {
  const prefix = {
    partner: "GTCIO Partnership Inquiry",
    contact: "GTCIO Contact",
    tour: "GTCIO Tour Request",
  }[formType];

  return [prefix, reason, who].filter(Boolean).join(" — ");
}

export async function POST(request: Request) {
  // Reject oversized payloads before parsing them.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

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

  const { formType } = body;
  if (!isFormType(formType)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 400 });
  }

  const email = clean(body.email, MAX_EMAIL);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const firstName = clean(body.firstName, MAX_SHORT);
  const lastName = clean(body.lastName, MAX_SHORT);
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const organization = clean(body.organization, MAX_SHORT);
  const reasons = cleanReasons(body.reason);
  const reasonText = reasons.join(", ");
  const phone = clean(body.phone, MAX_SHORT);
  const preferredDate = clean(body.preferredDate, MAX_SHORT);
  const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE);
  const subject = buildSubject(formType, reasonText, organization || name);

  // "Media inquiry" routes to Sean Payne; everything else (and a submission with
  // no reason at all, e.g. the Partner/Tour forms which don't use this concept)
  // routes to Jan Moore. Both fire when a Contact submission checks "Media
  // inquiry" alongside another reason, since each covers a different audience.
  const includesMedia = reasons.some((r) => r.toLowerCase() === MEDIA_REASON);
  const includesOther = reasons.length === 0 || reasons.some((r) => r.toLowerCase() !== MEDIA_REASON);
  const recipients: { to: string; audience: string }[] = [];
  if (includesOther) {
    recipients.push({ to: NOTIFY_EMAIL, audience: "general (Jan Moore)" });
  }
  if (includesMedia) {
    recipients.push({ to: NOTIFY_EMAIL_MEDIA, audience: "media (Sean Payne)" });
  }

  // Contact form's "sign me up for the newsletter" checkbox. Best-effort and
  // independent of the rest of this handler — a failure here shouldn't turn a
  // successful inquiry into an error response, so it's caught and logged only.
  // No formSubmission field records the opt-in (see PROJECT.md §11: Constant
  // Contact's own list is the record of truth for subscriptions, same as the
  // footer sign-up form).
  if (formType === "contact" && body.newsletterOptIn) {
    try {
      await addNewsletterSignup({ email, firstName, lastName });
    } catch (error) {
      console.error("[inquiry] newsletter opt-in failed", error);
    }
  }

  // One shared Microsoft Graph credential can send to any address, so unlike
  // Web3Forms' per-recipient access keys, "configured" is a single yes/no —
  // but a submission that needs to reach both Jan and Sean still sends two
  // separate notifications, since each is its own sendMail call.
  const anyRecipientConfigured = graphConfigured();
  let allDelivered = true;

  if (!anyRecipientConfigured) {
    console.warn(
      "[inquiry] Microsoft Graph is not configured — no notification email sent for this submission."
    );
    allDelivered = false;
  }

  const bodyText = [
    `Reason for inquiry: ${reasonText || "(not specified)"}`,
    `Name: ${name || "(not given)"}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not given)"}`,
    `Company / organization: ${organization || "(not given)"}`,
    ...(formType === "tour" ? [`Preferred date: ${preferredDate || "(not given)"}`] : []),
    "",
    message || "(no message)",
  ].join("\n");

  for (const recipient of recipients) {
    if (!anyRecipientConfigured) continue;

    try {
      await sendMail({
        to: recipient.to,
        subject,
        text: bodyText,
        replyTo: email, // so staff can just hit Reply
      });
    } catch (error) {
      allDelivered = false;
      console.error(`[inquiry] email delivery to ${recipient.audience} threw`, error);
    }
  }

  // "Delivered" means every intended recipient got it — a partial send (e.g.
  // Jan's address rejected the message but Sean's went through) still needs
  // manual follow-up.
  const emailDelivered = anyRecipientConfigured && allDelivered;

  // Email is the only record of a submission now (the Sanity inbox that used
  // to save every inquiry as a backup was removed with the CMS). If it wasn't
  // delivered, the inquiry is genuinely lost — say so rather than showing a
  // thank-you for something that vanished.
  if (!emailDelivered) {
    return NextResponse.json(
      { error: "Something went wrong on our end. Please email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
