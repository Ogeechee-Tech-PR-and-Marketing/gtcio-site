import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "trainingPage",
  title: "Training Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "cards", title: "Students & Employers" },
    { name: "faq", title: "Employer FAQ" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "studentsBody",
      title: '"For Students" box',
      type: "text",
      rows: 3,
      group: "cards",
    }),
    defineField({
      name: "employersBody",
      title: '"For Employers" box',
      type: "text",
      rows: 3,
      group: "cards",
    }),

    defineField({
      name: "faqTitle",
      title: "FAQ heading",
      type: "string",
      group: "faq",
    }),
    defineField({
      name: "employerFaqs",
      title: "Questions & answers",
      type: "array",
      of: [{ type: "faq" }],
      group: "faq",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Training Page" };
    },
  },
});
