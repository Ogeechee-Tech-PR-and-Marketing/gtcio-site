import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { apiVersion, dataset, projectId } from "../env";

/**
 * The site's main data path: every page fetches through `sanityFetch`, and
 * `<SanityLive>` (rendered in the (site) layout) revalidates statically
 * prerendered pages when content changes.
 *
 * ⚠️ The client config below is partly DEAD CODE by design of defineLive: it
 * rewrites the client with `{allowReconfigure: false, useCdn: true,
 * perspective: 'published'}` — editing `useCdn`/`perspective` here changes
 * nothing. If a page shows stale content, this file is not the fix; see
 * PROJECT.md §8 ("A build can bake in stale Sanity data") and §4's cache notes.
 */
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const token = process.env.SANITY_API_READ_TOKEN;

// browserToken looks alarming but is safe: next-sanity only exposes it to the
// browser while Draft Mode is active — i.e. for an editor previewing via the
// Studio, who is already authenticated to Sanity. Regular visitors never
// receive it. serverToken is what lets static builds read draft-perspective
// data during preview.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});
