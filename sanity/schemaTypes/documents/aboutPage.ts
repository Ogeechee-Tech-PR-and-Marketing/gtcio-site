import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),

    defineField({ name: "missionBody", title: "Mission paragraph", type: "text", rows: 5 }),
    defineField({ name: "missionNote", title: "Mission note (small italic disclaimer, if any)", type: "string" }),
    defineField({ name: "missionQuote", title: "Mission quote", type: "text", rows: 3 }),
    defineField({ name: "missionQuoteAttribution", title: "Mission quote attribution", type: "string" }),

    defineField({ name: "bdaTitle", title: "\"Development Authority\" section heading", type: "string" }),
    defineField({ name: "bdaBody", title: "\"Development Authority\" paragraph", type: "text", rows: 4 }),
    defineField({ name: "bdaQuote", title: "\"Development Authority\" quote", type: "text", rows: 4 }),
    defineField({ name: "bdaQuoteAttribution", title: "\"Development Authority\" quote attribution", type: "string" }),

    defineField({ name: "historyBody", title: "History of Partnership paragraph", type: "text", rows: 5 }),
    defineField({ name: "historyNote", title: "History note (small italic disclaimer, if any)", type: "string" }),

    defineField({
      name: "faqs",
      title: "FAQ",
      type: "array",
      of: [{ type: "faq" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
