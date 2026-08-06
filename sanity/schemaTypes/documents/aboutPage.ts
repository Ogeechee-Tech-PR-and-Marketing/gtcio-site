import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "mission", title: "Mission" },
    { name: "history", title: "History" },
    { name: "advisory", title: "Advisory Board" },
    { name: "bda", title: "Development Authority" },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    ...heroFields("hero", {
      imageDescription:
        "The About banner plays a video of the robotics lab, so this is normally left empty. Upload a photo here only if you want a still photo INSTEAD of the video — the video stops being used as soon as a photo is set. Remove the photo to get the video back.",
      includeVideo: true,
      videoDescription:
        "Replace the robotics-lab video that plays by default. Leave blank to keep the current video. Uploading a Background photo above always wins over any video.",
    }),

    defineField({
      name: "missionStatement",
      title: "Mission statement",
      description:
        "The formal mission statement, shown large at the top of the Mission section. Keep it to one sentence.",
      type: "text",
      rows: 2,
      group: "mission",
    }),
    defineField({
      name: "missionBody",
      title: "Mission paragraph",
      description: "The supporting paragraph under the mission statement.",
      type: "text",
      rows: 5,
      group: "mission",
    }),
    defineField({
      name: "missionNote",
      title: "Small note under the paragraph",
      description:
        "Currently the italic disclaimer about wording pending sign-off. Clear this field to remove it from the page.",
      type: "string",
      group: "mission",
    }),
    defineField({
      name: "missionQuote",
      title: "Quote",
      description: "Type the quote without quotation marks — they're added automatically.",
      type: "text",
      rows: 3,
      group: "mission",
    }),
    defineField({
      name: "missionQuoteAttribution",
      title: "Who said it",
      description: 'Name and title, e.g. "Jan Moore — Vice President for Economic Development".',
      type: "string",
      group: "mission",
    }),

    defineField({
      name: "bdaTitle",
      title: "Section heading",
      type: "string",
      group: "bda",
    }),
    defineField({
      name: "bdaBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "bda",
    }),
    defineField({
      name: "bdaQuote",
      title: "Quote",
      description: "Type the quote without quotation marks — they're added automatically.",
      type: "text",
      rows: 4,
      group: "bda",
    }),
    defineField({
      name: "bdaQuoteAttribution",
      title: "Who said it",
      type: "string",
      group: "bda",
    }),

    defineField({
      name: "historyTitle",
      title: "Section heading",
      type: "string",
      group: "history",
    }),
    defineField({
      name: "historyBody",
      title: "Paragraph",
      type: "text",
      rows: 5,
      group: "history",
    }),
    defineField({
      name: "historyTimeline",
      title: "Project timeline",
      description:
        "The milestones shown as a scrolling horizontal timeline. Drag to reorder — they display in the order listed here, so keep them oldest-first.",
      type: "array",
      of: [{ type: "timelineEvent" }],
      group: "history",
    }),
    defineField({
      name: "historyNote",
      title: "Small note under the timeline",
      description: "Clear this field to remove the italic note from the page.",
      type: "string",
      group: "history",
    }),

    defineField({
      name: "advisoryTitle",
      title: "Section heading",
      type: "string",
      group: "advisory",
    }),
    defineField({
      name: "advisoryBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "advisory",
    }),
    defineField({
      name: "advisoryMembers",
      title: "Board roster",
      description:
        "Drag to reorder within a category. Set each person's Category to Board Member or Ex Officio — the page groups and labels them separately.",
      type: "array",
      of: [{ type: "boardMember" }],
      group: "advisory",
    }),
    defineField({
      name: "advisoryNote",
      title: "Small note under the roster",
      description: "Clear this field to remove the italic note from the page.",
      type: "string",
      group: "advisory",
    }),

    defineField({
      name: "faqs",
      title: "Questions & answers",
      description: "Drag to reorder. Use Add item to add a new question.",
      type: "array",
      of: [{ type: "faq" }],
      group: "faq",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
