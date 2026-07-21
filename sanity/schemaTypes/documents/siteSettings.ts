import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "banner", title: "Top banner", default: true },
    { name: "contact", title: "Address & contacts" },
    { name: "newsletter", title: "Newsletter signup (footer)" },
  ],
  fields: [
    defineField({
      name: "bannerOrgText",
      title: "Top banner — left side",
      description:
        'The thin black strip at the very top of every page, before the red line. Currently "WELCOME TO THE GTCIO".',
      type: "string",
      validation: (r) => r.required(),
      group: "banner",
    }),
    defineField({
      name: "bannerParentText",
      title: "Top banner — right side",
      description:
        'The part after the red line. Currently "A DIVISION OF OGEECHEE TECHNICAL COLLEGE".',
      type: "string",
      validation: (r) => r.required(),
      group: "banner",
    }),
    defineField({
      name: "footerTagline",
      title: "Tagline under the logo",
      description: "Shown in the black footer and on the Contact page.",
      type: "string",
      validation: (r) => r.required(),
      group: "banner",
    }),

    defineField({
      name: "address",
      title: "Street address",
      description: "Shown in the footer of every page and on the Contact page.",
      type: "string",
      validation: (r) => r.required(),
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Main phone number",
      type: "string",
      validation: (r) => r.required(),
      group: "contact",
    }),
    defineField({
      name: "programContact",
      title: "Program Questions contact",
      description: "Shown on the Contact page.",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "name", title: "Name & job title", type: "string" }),
        defineField({ name: "office", title: "Office / building", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),
    defineField({
      name: "mediaContact",
      title: "Media Inquiries contact",
      description: "Shown on the Contact page, formatted the same as the Program Questions contact above.",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "name", title: "Name & job title", type: "string" }),
        defineField({ name: "office", title: "Office / building", type: "string", description: "Leave blank to hide." }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),

    defineField({
      name: "newsletterEyebrow",
      title: "Small gold label",
      description: "Shown in the footer's newsletter signup, on every page.",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterTitle",
      title: "Heading",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterBody",
      title: "Paragraph",
      type: "text",
      rows: 3,
      group: "newsletter",
    }),
    defineField({
      name: "newsletterButtonLabel",
      title: "Button text",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterConfirmation",
      title: "Thank-you message",
      description: "Shown in place of the form after someone signs up.",
      type: "text",
      rows: 2,
      group: "newsletter",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Banner, address, and contacts used across every page",
      };
    },
  },
});
