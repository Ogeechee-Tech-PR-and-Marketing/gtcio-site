import { defineField, defineType } from "sanity";
import { heroMediaFields } from "../heroFields";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "intro", title: "Intro section" },
    { name: "cards", title: "Three cards" },
    { name: "partnerBand", title: "Red partner band" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Small label above the headline",
      description:
        "The little gold text over the video. Leave this empty to hide it — it is empty on purpose right now.",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Headline",
      description:
        "The huge text over the video. Keep it short — it is sized to sit on ONE line on a computer screen, and a longer headline will wrap onto two.",
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
      name: "heroButtons",
      title: "Buttons",
      description:
        "The buttons under the intro paragraph. The first one is red, the rest are outlined. Drag to reorder.",
      type: "array",
      of: [{ type: "ctaButton" }],
      validation: (r) => r.max(4),
      group: "hero",
    }),
    ...heroMediaFields("hero", {
      imageDescription:
        "The Home banner plays a looping construction video by default, so this is normally left empty. Upload a photo here only if you want a still photo INSTEAD of the video — the video stops being used as soon as a photo is set. Remove the photo to get the video back.",
      includeVideo: true,
      videoDescription:
        "Replace the looping construction video that plays by default. Leave blank to keep the current video. Uploading a Background photo above always wins over any video.",
    }),

    defineField({
      name: "sectionTitle",
      title: "Section heading",
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "sectionBody",
      title: "Section paragraph",
      type: "text",
      rows: 5,
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
      description: "Links to the IOT Training Programs page.",
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

    defineField({
      name: "partnerBandTitle",
      title: "Heading",
      type: "string",
      group: "partnerBand",
    }),
    defineField({
      name: "partnerBandBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "partnerBand",
    }),
    defineField({
      name: "partnerBandButton",
      title: "Button",
      type: "ctaButton",
      group: "partnerBand",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
