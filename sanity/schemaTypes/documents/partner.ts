import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Organization name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description:
        "A PNG, JPG, or SVG of the company logo. It gets shrunk to fit the box whole — nothing is cropped — so any shape works. A transparent background looks best.",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      description: "One sentence about the organization. Shown under the logo.",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      description:
        "Optional. The organization's website, e.g. https://www.georgiapower.com. When set, the partner's block links out to it.",
      type: "url",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "showOnWebsite",
      title: "Show on the website",
      description:
        "Turn this off to hide a partner from the Partners page without deleting them.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      description:
        "Lower numbers appear first (1, 2, 3…). Partners without a number are listed last, alphabetically.",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      description: "description",
      media: "logo",
      order: "order",
      showOnWebsite: "showOnWebsite",
    },
    prepare({ title, description, media, order, showOnWebsite }) {
      const prefix = typeof order === "number" ? `${order}. ` : "";
      const hidden = showOnWebsite === false ? "  ·  HIDDEN" : "";
      return {
        title: `${prefix}${title}${hidden}`,
        subtitle: description,
        media,
      };
    },
  },
});
