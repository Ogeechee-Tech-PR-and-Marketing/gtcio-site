import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "mission", title: "Mission" },
    { name: "bda", title: "Development Authority" },
    { name: "history", title: "History of Partnership" },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "missionBody",
      title: "Mission paragraph",
      type: "text",
      rows: 5,
      group: "mission",
    }),
    defineField({
      name: "missionNote",
      title: "Small note under the paragraph",
      description:
        "Currently the italic disclaimer about wording pending sign-off. Clear this field to remove it from the page.",
      type: "string",
      group: "mission",
    }),
    defineField({
      name: "missionQuote",
      title: "Quote",
      description: "Type the quote without quotation marks — they're added automatically.",
      type: "text",
      rows: 3,
      group: "mission",
    }),
    defineField({
      name: "missionQuoteAttribution",
      title: "Who said it",
      description: 'Name and title, e.g. "Jan Moore — Vice President for Economic Development".',
      type: "string",
      group: "mission",
    }),

    defineField({
      name: "bdaTitle",
      title: "Section heading",
      type: "string",
      group: "bda",
    }),
    defineField({
      name: "bdaBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "bda",
    }),
    defineField({
      name: "bdaQuote",
      title: "Quote",
      description: "Type the quote without quotation marks — they're added automatically.",
      type: "text",
      rows: 4,
      group: "bda",
    }),
    defineField({
      name: "bdaQuoteAttribution",
      title: "Who said it",
      type: "string",
      group: "bda",
    }),

    defineField({
      name: "historyBody",
      title: "Paragraph",
      type: "text",
      rows: 5,
      group: "history",
    }),
    defineField({
      name: "historyNote",
      title: "Small note under the paragraph",
      description: "Clear this field to remove the italic note from the page.",
      type: "string",
      group: "history",
    }),

    defineField({
      name: "faqs",
      title: "Questions & answers",
      description: "Drag to reorder. Use Add item to add a new question.",
      type: "array",
      of: [{ type: "faq" }],
      group: "faq",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
