import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

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
  botcheck?: string;
};

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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

  const name = [clean(body.firstName, MAX_SHORT), clean(body.lastName, MAX_SHORT)]
    .filter(Boolean)
    .join(" ");
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
  const recipients: { accessKey: string | undefined; audience: string }[] = [];
  if (includesOther) {
    recipients.push({ accessKey: process.env.WEB3FORMS_ACCESS_KEY, audience: "general (Jan Moore)" });
  }
  if (includesMedia) {
    recipients.push({ accessKey: process.env.WEB3FORMS_ACCESS_KEY_MEDIA, audience: "media (Sean Payne)" });
  }

  const submission = {
    // The dataset is publicly readable (the website reads it without a token), so
    // a plain published document here would expose the visitor's name, email, and
    // phone to anyone on the internet. Draft documents (ids under "drafts.") are
    // only readable with authentication, and the Studio inbox lists them just the
    // same — so every submission is written as a draft. sanity.config.ts removes
    // the Publish action for this type so one can't be made public by accident.
    _id: `drafts.${crypto.randomUUID()}`,
    _type: "formSubmission",
    formType,
    reason: reasonText || undefined,
    name: name || undefined,
    email,
    phone: phone || undefined,
    organization: organization || undefined,
    preferredDate: preferredDate || undefined,
    message: message || undefined,
    submittedAt: new Date().toISOString(),
  };

  // Record the inquiry BEFORE attempting email. If mail delivery fails, bounces,
  // or lands in a spam folder, the lead still exists in the Studio inbox.
  let submissionId: string | undefined;
  try {
    const created = await writeClient.create({ ...submission, emailDelivered: false });
    submissionId = created._id;
  } catch (error) {
    console.error("[inquiry] failed to save submission to Sanity", error);
  }

  // Each recipient needs its own Web3Forms key (the key bakes in who receives
  // it — there's no per-request "to" field), so a submission that needs to
  // reach both Jan and Sean sends two separate notifications.
  let anyRecipientConfigured = false;
  let allDelivered = true;

  for (const recipient of recipients) {
    if (!recipient.accessKey) {
      console.warn(
        `[inquiry] no Web3Forms access key configured for ${recipient.audience} — no email sent to that recipient.`
      );
      allDelivered = false;
      continue;
    }
    anyRecipientConfigured = true;

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: recipient.accessKey,
          subject,
          from_name: "GTCIO Website",
          replyto: email, // so staff can just hit Reply
          "Reason for inquiry": reasonText || "(not specified)",
          Name: name || "(not given)",
          Email: email,
          Phone: phone || "(not given)",
          "Company / organization": organization || "(not given)",
          ...(formType === "tour"
            ? { "Preferred date": preferredDate || "(not given)" }
            : {}),
          Message: message || "(no message)",
        }),
      });

      const result = await response.json().catch(() => ({}));
      const delivered = response.ok && result?.success !== false;

      if (!delivered) {
        allDelivered = false;
        console.error(`[inquiry] Web3Forms rejected the submission for ${recipient.audience}`, result);
      }
    } catch (error) {
      allDelivered = false;
      console.error(`[inquiry] email delivery to ${recipient.audience} threw`, error);
    }
  }

  // "Delivered" means every intended recipient got it — a partial send (e.g.
  // Jan notified but Sean's key isn't configured yet) still needs manual follow-up.
  const emailDelivered = anyRecipientConfigured && allDelivered;

  if (submissionId && emailDelivered) {
    try {
      await writeClient.patch(submissionId).set({ emailDelivered: true }).commit();
    } catch (error) {
      console.error("[inquiry] failed to flag submission as emailed", error);
    }
  }

  // If we couldn't save AND couldn't email, the inquiry is genuinely lost — say so
  // rather than showing a thank-you for something that vanished.
  if (!submissionId && !emailDelivered) {
    return NextResponse.json(
      { error: "Something went wrong on our end. Please email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
