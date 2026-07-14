import { defineField, defineType } from "sanity";

export default defineType({
  name: "facilityPage",
  title: "Facility Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),

    defineField({
      name: "stats",
      title: "Stat row (e.g. \"$27M\" / \"Facility investment\")",
      type: "array",
      of: [{ type: "statCard" }],
    }),

    defineField({ name: "overviewTitle", title: "Overview heading", type: "string" }),
    defineField({ name: "overviewBody", title: "Overview paragraph", type: "text", rows: 4 }),

    defineField({ name: "galleryTitle", title: "Gallery heading", type: "string" }),
    defineField({
      name: "galleryLabels",
      title: "Gallery placeholder labels",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({ name: "bookTourTitle", title: "\"Book a Tour\" heading", type: "string" }),
    defineField({ name: "bookTourIntro", title: "\"Book a Tour\" intro paragraph", type: "text", rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Facility Page" };
    },
  },
});
