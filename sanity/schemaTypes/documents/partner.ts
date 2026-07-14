import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Organization name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "logo" },
  },
});
