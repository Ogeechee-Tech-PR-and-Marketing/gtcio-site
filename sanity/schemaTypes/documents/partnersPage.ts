import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "partnersPage",
  title: "Partners Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "intro", title: "Intro & button" },
    { name: "pathways", title: "Ways to partner" },
    { name: "directory", title: "Partner logos" },
    { name: "form", title: "Become a Partner form" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "introText",
      title: "Intro paragraph",
      description: "The short paragraph directly under the banner.",
      type: "text",
      rows: 3,
      group: "intro",
    }),
    defineField({
      name: "introButton",
      title: "Button",
      description: "The red button beside the intro paragraph.",
      type: "ctaButton",
      group: "intro",
    }),
    defineField({
      name: "pathwaysTitle",
      title: "Section heading",
      description: 'Currently "Partnership Pathways".',
      type: "string",
      group: "pathways",
    }),
    defineField({
      name: "pathways",
      title: "Partnership pathway cards",
      description:
        "The boxes describing ways to get involved. Drag to reorder, or use Add item to create a new one.",
      type: "array",
      of: [{ type: "pathwayCard" }],
      group: "pathways",
    }),

    defineField({
      name: "directoryTitle",
      title: "Section heading",
      description:
        'Currently "Our Partners". The logos themselves are managed under "Partner logos & info" in the left-hand menu — add a partner there and it shows up on this page automatically.',
      type: "string",
      group: "directory",
    }),
    defineField({
      name: "directoryIntro",
      title: "Section intro paragraph",
      type: "text",
      rows: 2,
      group: "directory",
    }),

    defineField({
      name: "becomePartnerTitle",
      title: "Form heading",
      description: 'Currently "Become a Partner".',
      type: "string",
      group: "form",
    }),
    defineField({
      name: "becomePartnerIntro",
      title: "Form intro paragraph",
      type: "text",
      rows: 2,
      group: "form",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Partners Page" };
    },
  },
});
