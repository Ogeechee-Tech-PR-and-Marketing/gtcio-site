import { defineField, defineType } from "sanity";

/**
 * Server-managed OAuth connection to Constant Contact. Holds the tokens that
 * let /api/newsletter add a sign-up without a human in the loop.
 *
 * NEVER PUBLISHED. This document only ever exists as a draft
 * (_id: "drafts.constantContactAuth") — the production dataset is publicly
 * readable (see PROJECT.md §5's formSubmission note for the same trap), and a
 * published copy of this doc would put a live OAuth refresh token on the open
 * internet. sanity.config.ts strips every Studio action for this type (not
 * even Publish/Delete), and it's deliberately left out of structure.ts's nav —
 * nobody should ever open this in the Studio. Only
 * src/app/api/constant-contact/oauth/callback/route.ts and
 * src/lib/constantContact.ts read or write it, using the write token.
 */
export default defineType({
  name: "constantContactAuth",
  title: "Constant Contact connection (internal — do not edit)",
  type: "document",
  fields: [
    defineField({ name: "accessToken", title: "Access token", type: "string" }),
    defineField({
      name: "accessTokenExpiresAt",
      title: "Access token expires at",
      type: "string",
      description: "ISO datetime.",
    }),
    defineField({ name: "refreshToken", title: "Refresh token", type: "string" }),
    defineField({
      name: "listId",
      title: "\"GTCIO Website Sign-ups\" list ID",
      type: "string",
      description: "Cached after the list is found or created once, on first use.",
    }),
    defineField({ name: "updatedAt", title: "Last updated", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Constant Contact connection (internal)" };
    },
  },
});
