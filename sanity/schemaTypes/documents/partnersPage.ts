import { defineField, defineType } from "sanity";

export default defineType({
  name: "partnersPage",
  title: "Partners Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),

    defineField({ name: "introText", title: "Intro paragraph (next to the \"How to Become a Partner\" button)", type: "text", rows: 3 }),

    defineField({ name: "pathwaysTitle", title: "\"Partnership Pathways\" heading", type: "string" }),
    defineField({
      name: "pathways",
      title: "Partnership pathway cards",
      type: "array",
      of: [{ type: "pathwayCard" }],
    }),

    defineField({ name: "directoryTitle", title: "\"Our Partners\" heading", type: "string" }),
    defineField({ name: "directoryIntro", title: "\"Our Partners\" intro paragraph", type: "text", rows: 2 }),
    defineField({
      name: "directory",
      title: "Partner directory",
      description: "Drag to reorder. This controls the order partners appear in on the page.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "partner" }] }],
    }),

    defineField({ name: "becomePartnerTitle", title: "\"Become a Partner\" heading", type: "string" }),
    defineField({ name: "becomePartnerIntro", title: "\"Become a Partner\" intro paragraph", type: "text", rows: 2 }),
  ],
  preview: {
    prepare() {
      return { title: "Partners Page" };
    },
  },
});
