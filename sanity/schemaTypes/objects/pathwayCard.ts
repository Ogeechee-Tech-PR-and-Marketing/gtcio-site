import { defineField, defineType } from "sanity";

export default defineType({
  name: "pathwayCard",
  title: "Card",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
