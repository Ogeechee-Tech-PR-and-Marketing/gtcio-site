import { defineField, defineType } from "sanity";

export default defineType({
  name: "statCard",
  title: "Stat",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "The big figure",
      description: 'The large bold text, e.g. "$27M" or "40,000 sq ft".',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Caption underneath",
      description: 'The small grey text below it, e.g. "Facility investment".',
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
