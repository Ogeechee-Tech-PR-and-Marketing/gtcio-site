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

function isFormType(v: unknown): v is FormType {
  return typeof v === "string" && (FORM_TYPES as readonly string[]).includes(v);
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

  const email = body.email?.trim() ?? "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const name = [body.firstName, body.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const organization = body.organization?.trim() ?? "";
  const reason = body.reason?.trim() ?? "";
  const subject = buildSubject(formType, reason, organization || name);

  const submission = {
    _type: "formSubmission",
    formType,
    reason: reason || undefined,
    name: name || undefined,
    email,
    phone: body.phone?.trim() || undefined,
    organization: organization || undefined,
    preferredDate: body.preferredDate?.trim() || undefined,
    message: body.message?.trim() || undefined,
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
          Phone: body.phone?.trim() || "(not given)",
          "Company / organization": organization || "(not given)",
          ...(formType === "tour"
            ? { "Preferred date": body.preferredDate?.trim() || "(not given)" }
            : {}),
          Message: body.message?.trim() || "(no message)",
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
