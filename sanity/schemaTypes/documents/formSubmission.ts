import { defineField, defineType } from "sanity";

const FORM_LABELS: Record<string, string> = {
  partner: "Become a Partner",
  contact: "Contact",
  tour: "Book a Tour",
};

/**
 * A copy of every inquiry submitted through the site. Written server-side by
 * /api/inquiry so that a bounced or spam-filtered email never means a lost lead.
 * Editors read these; they never create or edit them (see sanity.config.ts).
 */
export default defineType({
  name: "formSubmission",
  title: "Form submission",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "formType",
      title: "Form",
      type: "string",
      options: {
        list: [
          { title: "Become a Partner", value: "partner" },
          { title: "Contact", value: "contact" },
          { title: "Book a Tour", value: "tour" },
        ],
      },
    }),
    defineField({ name: "reason", title: "Reason for inquiry", type: "string" }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "organization", title: "Company / organization", type: "string" }),
    defineField({ name: "preferredDate", title: "Preferred tour date", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text", rows: 5 }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
    defineField({
      name: "emailDelivered",
      title: "Email sent to staff?",
      description:
        "If this is false, the email did not go out — follow up on this inquiry manually.",
      type: "boolean",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      formType: "formType",
      reason: "reason",
      submittedAt: "submittedAt",
      emailDelivered: "emailDelivered",
    },
    prepare({ name, email, formType, reason, submittedAt, emailDelivered }) {
      const form = FORM_LABELS[formType] ?? "Inquiry";
      const when = submittedAt ? new Date(submittedAt).toLocaleDateString() : "";
      const warn = emailDelivered === false ? "⚠️ NOT EMAILED — " : "";
      return {
        title: `${warn}${name || email || "(no name)"} — ${form}`,
        subtitle: [reason, when].filter(Boolean).join("  ·  "),
      };
    },
  },
});
