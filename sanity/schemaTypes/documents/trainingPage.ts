import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "trainingPage",
  title: "IOT Training Programs Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "stats", title: "Stat boxes" },
    { name: "cards", title: "Training for employers" },
    { name: "catalog", title: "Catalog band" },
    { name: "credentials", title: "Credentials & affiliations" },
    { name: "services", title: "What we offer" },
    { name: "courses", title: "Course areas" },
    { name: "faq", title: "Employer FAQ" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "stats",
      title: "Stat boxes",
      description:
        'The three figures under the banner, e.g. "~460,000 / Hours of instruction GTCIO can deliver each year".',
      type: "array",
      of: [{ type: "statCard" }],
      group: "stats",
    }),

    defineField({
      name: "employersTitle",
      title: "Section heading",
      type: "string",
      group: "cards",
    }),
    defineField({
      name: "employersBody",
      title: "First paragraph",
      type: "text",
      rows: 5,
      group: "cards",
    }),
    defineField({
      name: "employersBody2",
      title: "Second paragraph",
      description: "Clear this to show only one paragraph.",
      type: "text",
      rows: 4,
      group: "cards",
    }),
    defineField({
      name: "employersButton",
      title: "Button",
      type: "ctaButton",
      group: "cards",
    }),

    defineField({
      name: "catalogEyebrow",
      title: "Small gold label",
      type: "string",
      group: "catalog",
    }),
    defineField({
      name: "catalogTitle",
      title: "Heading",
      type: "string",
      group: "catalog",
    }),
    defineField({
      name: "catalogBody",
      title: "Paragraph",
      type: "text",
      rows: 3,
      group: "catalog",
    }),
    defineField({
      name: "catalogButton",
      title: "Button",
      description:
        'Points at the published training catalog. Choose "Somewhere else" and paste the catalog link.',
      type: "ctaButton",
      group: "catalog",
    }),

    defineField({
      name: "affiliationsTitle",
      title: "Section heading",
      type: "string",
      group: "credentials",
    }),
    defineField({
      name: "affiliations",
      title: "Credentials & affiliations",
      description: "Drag to reorder. Use Add item to add one.",
      type: "array",
      of: [{ type: "infoCard" }],
      group: "credentials",
    }),

    defineField({
      name: "servicesTitle",
      title: "Section heading",
      type: "string",
      group: "services",
    }),
    defineField({
      name: "services",
      title: "What we offer employers",
      description: "Drag to reorder. Use Add item to add one.",
      type: "array",
      of: [{ type: "infoCard" }],
      group: "services",
    }),

    defineField({
      name: "courseAreasTitle",
      title: "Section heading",
      type: "string",
      group: "courses",
    }),
    defineField({
      name: "courseAreasIntro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      group: "courses",
    }),
    defineField({
      name: "courseAreas",
      title: "Course areas",
      description:
        "Each area lists its courses. Drag to reorder areas, and drag courses within an area.",
      type: "array",
      of: [{ type: "courseArea" }],
      group: "courses",
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
      description: "Drag to reorder. Use Add item to add a question.",
      type: "array",
      of: [{ type: "faq" }],
      group: "faq",
    }),
  ],
  preview: {
    prepare() {
      return { title: "IOT Training Programs Page" };
    },
  },
});
