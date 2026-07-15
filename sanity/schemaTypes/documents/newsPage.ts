import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "newsPage",
  title: "News Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "sections", title: "Section headings" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "introText",
      title: "Intro paragraph",
      description: "Short paragraph under the banner, above the news lists.",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "pressTitle",
      title: "Press releases heading",
      description: 'Heading over the GTCIO / OTC press releases, e.g. "Press Releases".',
      type: "string",
      group: "sections",
    }),
    defineField({
      name: "mediaTitle",
      title: "Media coverage heading",
      description: 'Heading over outside coverage, e.g. "In the News".',
      type: "string",
      group: "sections",
    }),
  ],
  preview: {
    prepare() {
      return { title: "News Page" };
    },
  },
});
