import { defineField, defineType } from "sanity";

export default defineType({
  name: "timelineEvent",
  title: "Timeline milestone",
  type: "object",
  fields: [
    defineField({
      name: "date",
      title: "When",
      description:
        'Shown in red above the milestone, e.g. "July 2022" or "October 15, 2026". Type it however you want it to read.',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "What happened",
      description: 'A short headline, e.g. "Initial funding approved".',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "detail",
      title: "More detail",
      description: "Optional. A sentence of extra context shown under the headline.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", date: "date", detail: "detail" },
    prepare({ title, date, detail }) {
      return {
        title: [date, title].filter(Boolean).join("  —  "),
        subtitle: detail,
      };
    },
  },
});
