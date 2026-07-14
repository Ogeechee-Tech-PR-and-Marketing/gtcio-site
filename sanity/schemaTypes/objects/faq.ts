import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});
