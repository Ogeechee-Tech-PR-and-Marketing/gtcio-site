import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Plain read client. Which of the three Sanity clients to use:
 * - Page data fetching → `sanityFetch` from ./live.ts (handles caching,
 *   tags, and draft-mode preview). Pages should not use this client.
 * - Writes (form submissions, Constant Contact tokens) → ./writeClient.ts
 *   (server-only, carries the write token).
 * - This client → everything else: the draft-mode enable route (which adds
 *   the read token via withConfig) and any one-off published-content reads.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
