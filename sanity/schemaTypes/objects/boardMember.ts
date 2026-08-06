import { defineField, defineType } from "sanity";

/**
 * One row of the GTCIO Advisory Board roster (About Page → Advisory Board).
 * `category` splits the list into the two groups the roster is organized by
 * — voting board members vs. ex officio seats (college presidents, state
 * legislators, etc.) — so the page can render them as two labeled groups
 * instead of one flat list.
 */
export default defineType({
  name: "boardMember",
  title: "Board member",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Board Member", value: "board" },
          { title: "Ex Officio", value: "exOfficio" },
        ],
        layout: "radio",
      },
      initialValue: "board",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "title", org: "organization" },
    prepare({ title, subtitle, org }) {
      return { title, subtitle: [subtitle, org].filter(Boolean).join(" — ") };
    },
  },
});
