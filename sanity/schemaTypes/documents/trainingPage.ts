import { defineField, defineType } from "sanity";

export default defineType({
  name: "trainingPage",
  title: "Training Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),

    defineField({ name: "studentsBody", title: "\"For Students\" card text", type: "text", rows: 3 }),
    defineField({ name: "employersBody", title: "\"For Employers\" card text", type: "text", rows: 3 }),

    defineField({ name: "faqTitle", title: "Employer FAQ heading", type: "string" }),
    defineField({
      name: "employerFaqs",
      title: "Employer FAQ",
      type: "array",
      of: [{ type: "faq" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Training Page" };
    },
  },
});
