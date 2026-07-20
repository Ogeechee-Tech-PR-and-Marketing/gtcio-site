import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

const FORM_TYPES = ["partner", "contact", "tour"] as const;
type FormType = (typeof FORM_TYPES)[number];

type Payload = {
  formType?: string;
  reason?: string;
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
  const reason = clean(body.reason, MAX_SHORT);
  const phone = clean(body.phone, MAX_SHORT);
  const preferredDate = clean(body.preferredDate, MAX_SHORT);
  const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE);
  const subject = buildSubject(formType, reason, organization || name);

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
    reason: reason || undefined,
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

  let emailDelivered = false;
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (accessKey) {
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject,
          from_name: "GTCIO Website",
          replyto: email, // so staff can just hit Reply
          "Reason for inquiry": reason || "(not specified)",
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
      emailDelivered = response.ok && result?.success !== false;

      if (!emailDelivered) {
        console.error("[inquiry] Web3Forms rejected the submission", result);
      }
    } catch (error) {
      console.error("[inquiry] email delivery threw", error);
    }
  } else {
    console.warn(
      "[inquiry] WEB3FORMS_ACCESS_KEY is not set — submission saved to Sanity only, no email sent."
    );
  }

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
