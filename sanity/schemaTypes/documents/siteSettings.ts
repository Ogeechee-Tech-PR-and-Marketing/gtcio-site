import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "bannerOrgText",
      title: "Top banner text — left side",
      description: 'The thin black banner at the very top of every page, before the red divider. E.g. "WELCOME TO THE GTCIO"',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bannerParentText",
      title: "Top banner text — right side",
      description: 'The part after the red divider. E.g. "A DIVISION OF OGEECHEE TECHNICAL COLLEGE"',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "address", title: "Street address", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Main phone number", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "programContact",
      title: "Program Questions contact",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name & title", type: "string" }),
        defineField({ name: "office", title: "Office", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),
    defineField({
      name: "mediaContact",
      title: "Media Inquiries contact",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
