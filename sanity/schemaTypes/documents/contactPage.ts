import { defineType } from "sanity";
import { heroFields } from "../heroFields";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [{ name: "hero", title: "Top of page", default: true }],
  fields: [
    ...heroFields("hero"),
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
