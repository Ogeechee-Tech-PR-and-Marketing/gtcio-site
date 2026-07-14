import { defineField, defineType } from "sanity";

export default defineType({
  name: "statCard",
  title: "Stat",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value (the big number/text)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label (the caption underneath)", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
