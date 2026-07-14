import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "intro", title: "Intro section" },
    { name: "cards", title: "Three cards" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Small label above the headline",
      description: "The little gold text over the video.",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Headline",
      description:
        "The huge text over the video. Press Enter to split it onto a second line — right now it breaks after \"Make things work.\"",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({
      name: "heroDescription",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
      group: "hero",
    }),

    defineField({
      name: "sectionTitle",
      title: "Section heading",
      description: 'Currently "Training the next generation".',
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "sectionBody",
      title: "Section paragraph",
      type: "text",
      rows: 4,
      group: "intro",
    }),

    defineField({
      name: "studentsCard",
      title: "Students card",
      description: "Links to the IOT Diploma Program page.",
      type: "pathwayCard",
      group: "cards",
    }),
    defineField({
      name: "employersCard",
      title: "Employers card",
      description: "Links to the Training page.",
      type: "pathwayCard",
      group: "cards",
    }),
    defineField({
      name: "partnersCard",
      title: "Partners card",
      description: "Links to the Partners page.",
      type: "pathwayCard",
      group: "cards",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
        subtitle: "The background video needs a developer to change",
      };
    },
  },
});
