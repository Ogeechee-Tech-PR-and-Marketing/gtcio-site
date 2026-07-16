import { defineField, defineType } from "sanity";

/**
 * A titled box with a sentence or two under it. Used for the credential,
 * service, and focus-area grids. Deliberately generic — one type an editor
 * learns once and recognises everywhere.
 */
export default defineType({
  name: "infoCard",
  title: "Box",
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
  ],
  preview: {
    select: { title: "title", subtitle: "detail" },
  },
});
