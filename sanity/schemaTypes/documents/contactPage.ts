import { defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "form", title: "Contact form" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "contactReasons",
      title: "\"Reason for contacting\" dropdown",
      description:
        'The choices someone picks from on the Contact form (one at a time). Whatever they choose becomes the subject line of the email GTCIO receives, so keep these short and specific. Drag to reorder. Renaming "Media inquiry" breaks its routing to Sean Payne — see the code comment in src/app/api/inquiry/route.ts before changing that one.',
      type: "array",
      of: [{ type: "string" }],
      group: "form",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
        subtitle: "Addresses and phone numbers live in Site Settings",
      };
    },
  },
});
