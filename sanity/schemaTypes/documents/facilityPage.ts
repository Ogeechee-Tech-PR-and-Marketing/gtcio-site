import { defineArrayMember, defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

const galleryPhoto = defineArrayMember({
  name: "galleryPhoto",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      description: 'Optional label shown with the photo, e.g. "Automation Lab".',
      type: "string",
    }),
    defineField({
      name: "alt",
      title: "Photo description (for screen readers)",
      type: "string",
    }),
  ],
});

export default defineType({
  name: "facilityPage",
  title: "Facility Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "stats", title: "Stats & overview" },
    { name: "focus", title: "What it's built around" },
    { name: "gallery", title: "Photo gallery" },
    { name: "tour", title: "Book a Tour form" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "stats",
      title: "Stat boxes",
      description: 'The three figures across the top, e.g. "$27M / Facility investment".',
      type: "array",
      of: [{ type: "statCard" }],
      group: "stats",
    }),
    defineField({
      name: "overviewTitle",
      title: "Overview heading",
      type: "string",
      group: "stats",
    }),
    defineField({
      name: "overviewBody",
      title: "Overview paragraph",
      type: "text",
      rows: 4,
      group: "stats",
    }),

    defineField({
      name: "focusAreasTitle",
      title: "Section heading",
      type: "string",
      group: "focus",
    }),
    defineField({
      name: "focusAreasIntro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      group: "focus",
    }),
    defineField({
      name: "focusAreas",
      title: "The areas",
      description:
        "The areas of advanced manufacturing the center was planned around. Drag to reorder, or use Add item to add one.",
      type: "array",
      of: [{ type: "infoCard" }],
      group: "focus",
    }),

    defineField({
      name: "galleryTitle",
      title: "Gallery heading",
      type: "string",
      group: "gallery",
    }),
    defineField({
      name: "gallery",
      title: "Photos",
      description:
        "Upload real photos of the facility here. Until you add at least one, the page shows grey PHOTO PLACEHOLDER boxes.",
      type: "array",
      of: [galleryPhoto],
      options: { layout: "grid" },
      group: "gallery",
    }),

    defineField({
      name: "bookTourTitle",
      title: "Form heading",
      type: "string",
      group: "tour",
    }),
    defineField({
      name: "bookTourIntro",
      title: "Form intro paragraph",
      type: "text",
      rows: 3,
      group: "tour",
    }),
    defineField({
      name: "tourNoticeHeading",
      title: "Notice banner heading",
      description:
        'The bold line of the yellow banner, e.g. "Tour booking opens October 26, 2026".',
      type: "string",
      group: "tour",
    }),
    defineField({
      name: "tourNotice",
      title: "Notice banner text",
      description:
        "The yellow banner above the tour form. Use it for temporary messages like tour booking not being open yet. Clear BOTH this and the heading above to remove the banner once tours can be booked.",
      type: "text",
      rows: 3,
      group: "tour",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Facility Page" };
    },
  },
});
