import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
