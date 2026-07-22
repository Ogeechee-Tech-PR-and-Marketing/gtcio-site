import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

/**
 * Called by the Studio's Presentation ("Edit on page") tool — see
 * sanity.config.ts's presentationTool previewUrl — never by visitors directly.
 * defineEnableDraftMode validates a per-request preview secret (the
 * `sanity.previewUrlSecret` system documents in the dataset) before setting
 * the draft-mode cookie, so no extra auth gate is needed here. It requires
 * SANITY_API_READ_TOKEN; without it, Edit-on-page preview silently fails.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
