import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { apiVersion, dataset, projectId } from "../env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});
