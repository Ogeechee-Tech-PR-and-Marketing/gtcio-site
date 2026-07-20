import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

/**
 * The Credentials page. Top-level nav item between IOT Diploma Program and
 * Facility (added 2026-07-20); absorbed the old
 * /iot-diploma-program/certifications page.
 *
 * Only the *framing* is editable here. The credential glossary itself, SACA's
 * tier ladder, and the list of accreditations are reference data in
 * src/lib/iot-curriculum.ts and src/lib/credentials.ts — third-party
 * certification facts rather than marketing copy (PROJECT.md §4).
 *
 * The five accreditations shown near the bottom are authored on the **IOT
 * Training Programs Page** ("Credentials & affiliations"), because they appear
 * on both pages and an editor should only ever update them once. There is
 * deliberately no second copy of that field here.
 *
 * Groups are listed in the order the sections appear on the page.
 */
export default defineType({
  name: "credentialsPage",
  title: "Credentials Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "earn", title: "What you leave with" },
    { name: "saca", title: "What SACA is" },
    { name: "ladder", title: "How credentials stack" },
    { name: "glossary", title: "Credential list" },
    { name: "affiliations", title: "Why it counts" },
    { name: "cta", title: "Apply band" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({ name: "earnTitle", title: "Section heading", type: "string", group: "earn" }),
    defineField({
      name: "earnBody",
      title: "Intro paragraph",
      description:
        "The three cards underneath (SACA count, FANUC, OSHA 10) are generated from the program data and can't be edited here.",
      type: "text",
      rows: 3,
      group: "earn",
    }),

    defineField({
      name: "sacaTitle",
      title: "Section heading",
      description:
        "The explanation of SACA underneath is reference copy from the program brochure and needs a developer to change.",
      type: "string",
      group: "saca",
    }),

    defineField({ name: "ladderTitle", title: "Section heading", type: "string", group: "ladder" }),
    defineField({
      name: "ladderBody",
      title: "Intro paragraph",
      description: "The three tiers below it (Associate, Specialist, Professional) are fixed.",
      type: "text",
      rows: 3,
      group: "ladder",
    }),

    defineField({
      name: "glossaryTitle",
      title: "Section heading",
      type: "string",
      group: "glossary",
    }),
    defineField({
      name: "glossaryBody",
      title: "Intro paragraph",
      description:
        "The credentials themselves come from the program brochure and need a developer to change.",
      type: "text",
      rows: 3,
      group: "glossary",
    }),

    defineField({
      name: "affiliationsTitle",
      title: "Section heading",
      type: "string",
      group: "affiliations",
    }),
    defineField({
      name: "affiliationsBody",
      title: "Intro paragraph",
      description:
        "⚠️ The five accreditations listed under this are edited on the IOT Training Programs Page, under \"Credentials & affiliations\" — they show on both pages, so you only update them once.",
      type: "text",
      rows: 3,
      group: "affiliations",
    }),

    defineField({ name: "ctaHeading", title: "Heading", type: "string", group: "cta" }),
    defineField({ name: "ctaBody", title: "Paragraph", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "applyButton", title: "Button", type: "ctaButton", group: "cta" }),
  ],
  preview: {
    prepare() {
      return { title: "Credentials Page" };
    },
  },
});
