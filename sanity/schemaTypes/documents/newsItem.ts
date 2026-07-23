import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsItem",
  title: "News item",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Type",
      description:
        "Is this a press release from our office, or coverage in another outlet?",
      type: "string",
      options: {
        list: [
          { title: "GTCIO / OTC press release", value: "press" },
          { title: "In the news (outside media coverage)", value: "media" },
        ],
        layout: "radio",
      },
      initialValue: "press",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      description: "The date this was published.",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Source / outlet",
      description:
        'Where it ran, e.g. "Ogeechee Technical College", "Statesboro Herald", "WTOC".',
      type: "string",
    }),
    defineField({
      name: "url",
      title: "Link",
      description:
        "The web address of the release or article. The headline links here.",
      type: "url",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      description: "Optional. One or two sentences shown under the headline.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Thumbnail",
      description:
        "Optional. A small photo shown next to the headline on the News page. Drag the dot in the editor to set what part of the photo stays in view when it's cropped.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      title: "Thumbnail alt text",
      description: "Describe the image for screen readers, e.g. \"Ribbon-cutting ceremony at the GTCIO site.\"",
      type: "string",
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: "showOnWebsite",
      title: "Show on the website",
      description:
        "Turn this off to hide an item from the News page without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      date: "date",
      source: "source",
      showOnWebsite: "showOnWebsite",
      media: "image",
    },
    prepare({ title, category, date, source, showOnWebsite, media }) {
      const kind = category === "media" ? "In the news" : "Press release";
      const hidden = showOnWebsite === false ? "  ·  HIDDEN" : "";
      const parts = [date, source].filter(Boolean).join(" · ");
      return {
        title: `${title}${hidden}`,
        subtitle: [kind, parts].filter(Boolean).join("  —  "),
        media,
      };
    },
  },
});
