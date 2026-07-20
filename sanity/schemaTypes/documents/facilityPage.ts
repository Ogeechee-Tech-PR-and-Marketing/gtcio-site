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

    // The "Book a Tour form" fields (bookTourTitle, bookTourIntro,
    // tourNoticeHeading, tourNotice) are deliberately removed here — tour
    // booking is off the site entirely until it launches 2026-10-26 (Jake,
    // 2026-07-20). The section is also removed from facility/page.tsx. Values
    // already in the dataset are left alone (just unreachable from the
    // Studio); re-add these four fields with the "tour" group verbatim to
    // restore editing, and the old copy will still be there.
  ],
  preview: {
    prepare() {
      return { title: "Facility Page" };
    },
  },
});
