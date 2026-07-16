import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "trainingPage",
  title: "Training Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "cards", title: "Training for employers" },
    { name: "faq", title: "Employer FAQ" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "employersBody",
      title: '"Training for employers" opening paragraph',
      description:
        "The first paragraph under the Training for employers heading. The credentials, services, and course lists further down the page are fixed and not editable here.",
      type: "text",
      rows: 5,
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
