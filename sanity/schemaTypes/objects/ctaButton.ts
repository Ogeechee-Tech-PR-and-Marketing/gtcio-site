import { defineField, defineType } from "sanity";

/**
 * A button. Editors choose where it goes from a list of real pages rather than
 * typing a web address, so a button can't be pointed at a page that doesn't
 * exist. "Somewhere else" reveals a URL box for genuinely external links.
 *
 * The values here must stay in sync with DESTINATIONS in sanity/lib/links.ts,
 * which turns them into real hrefs.
 */
export default defineType({
  name: "ctaButton",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button text",
      description: "Shown on the button. Short — two or three words.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "destination",
      title: "Where it goes",
      type: "string",
      options: {
        list: [
          { title: "Home page", value: "home" },
          { title: "About page", value: "about" },
          { title: "IOT Training Programs page", value: "training" },
          { title: "IOT Diploma Program page", value: "iot" },
          { title: "Facility page", value: "facility" },
          // "tour" removed 2026-07-20 — tour booking is off the site until
          // 2026-10-26. Restore this option (value must stay "tour" to match
          // DESTINATIONS in sanity/lib/links.ts) once it's back.
          { title: "Partners page", value: "partners" },
          { title: "Partners page — Become a Partner form", value: "becomePartner" },
          { title: "News page", value: "news" },
          { title: "Contact page", value: "contact" },
          { title: "Apply at Ogeechee Tech (ogeecheetech.edu/admissions/next-steps)", value: "apply" },
          { title: "Somewhere else (type a web address)", value: "external" },
        ],
      },
      initialValue: "contact",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "externalUrl",
      title: "Web address",
      description:
        'Only needed if you picked "Somewhere else" above. Opens in a new tab.',
      type: "url",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"], allowRelative: false }).custom((url, ctx) => {
          const dest = (ctx.parent as { destination?: string })?.destination;
          if (dest === "external" && !url) return "Add a web address, or pick a page above instead.";
          return true;
        }),
      hidden: ({ parent }) => parent?.destination !== "external",
    }),
  ],
  preview: {
    select: { title: "label", destination: "destination", externalUrl: "externalUrl" },
    prepare({ title, destination, externalUrl }) {
      return {
        title: title || "(no button text)",
        subtitle: destination === "external" ? externalUrl : `→ ${destination ?? "?"}`,
      };
    },
  },
});
