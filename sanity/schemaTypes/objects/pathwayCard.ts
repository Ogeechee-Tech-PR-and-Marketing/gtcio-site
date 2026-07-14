import { defineField, defineType } from "sanity";

export default defineType({
  name: "pathwayCard",
  title: "Card",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Card heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Card text", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
