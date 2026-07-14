import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({
      name: "heroTitle",
      title: "Hero headline",
      description: "Each line becomes its own line on the page. Keep it short.",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 4 }),
    defineField({ name: "sectionTitle", title: "\"Training the next generation\" heading", type: "string" }),
    defineField({ name: "sectionBody", title: "\"Training the next generation\" paragraph", type: "text", rows: 4 }),
    defineField({
      name: "studentsCard",
      title: "Students card",
      type: "pathwayCard",
      description: "Links to the IOT Diploma Program page",
    }),
    defineField({
      name: "employersCard",
      title: "Employers card",
      type: "pathwayCard",
      description: "Links to the Training page",
    }),
    defineField({
      name: "partnersCard",
      title: "Partners card",
      type: "pathwayCard",
      description: "Links to the Partners page",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
