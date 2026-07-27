import { defineField, defineType } from "sanity";

/**
 * A titled accreditation box, same shape as `infoCard`, plus a "Show on"
 * field. Split out from `infoCard` specifically for
 * `trainingPage.affiliations` (2026-07-27) — the one field two pages read
 * (PROJECT.md §4) needed a way to say "this accreditation only applies to
 * employer training" without also growing that field on Facility's focus
 * areas or Training's own service cards, which don't need it.
 */
export default defineType({
  name: "affiliationCard",
  title: "Accreditation box",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "detail",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "showOn",
      title: "Show on",
      description:
        "Both pages by default. Diploma students only earn FANUC and SACA credentials, so an accreditation that's employer-training-only (Mitsubishi Electric, Rockwell) should be limited to the Training page — it would otherwise show on the Credentials page and overstate what a student leaves with.",
      type: "string",
      options: {
        list: [
          { title: "Both pages", value: "both" },
          { title: "IOT Training Programs page only (employers)", value: "employer" },
          { title: "Credentials page only (students)", value: "student" },
        ],
        layout: "radio",
      },
      initialValue: "both",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "detail" },
  },
});
