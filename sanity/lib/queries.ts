import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

// heroVideo is a file field: unlike images, a file asset reference has no
// self-contained URL, so it must be dereferenced (asset->) to get one.
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    ...,
    heroVideo{..., asset->}
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0]{
    ...,
    heroVideo{..., asset->}
  }
`);

export const FACILITY_PAGE_QUERY = defineQuery(`*[_type == "facilityPage"][0]`);

export const TRAINING_PAGE_QUERY = defineQuery(`*[_type == "trainingPage"][0]`);

export const IOT_DIPLOMA_PROGRAM_PAGE_QUERY = defineQuery(
  `*[_type == "iotDiplomaProgramPage"][0]`
);

export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]`);

/**
 * Like the Partners page, news items are pulled straight from newsItem documents,
 * so creating one in the Studio publishes it — no separate list to maintain.
 *
 * `items` is deliberately a sibling of `page`, not nested inside it. When it was
 * nested (`*[_type == "newsPage"][0]{..., "items": ...}`) the whole result was
 * null until the newsPage singleton existed — and it did not exist for months,
 * because News is the one page with no seeded copy for anyone to open and save.
 * News items were therefore invisible on the site no matter how many an editor
 * created: the same silent no-op the Partners reference list used to cause.
 * A root-level object projection always returns an object, so the list renders
 * even if the singleton is missing and only the page's own headings fall back.
 */
export const NEWS_PAGE_QUERY = defineQuery(`
  {
    "page": *[_type == "newsPage"][0],
    "items": *[_type == "newsItem" && showOnWebsite != false] | order(date desc){
      _id,
      category,
      title,
      date,
      source,
      url,
      excerpt
    }
  }
`);

/**
 * Partners are pulled straight from the partner documents rather than a
 * hand-maintained list on the page, so creating a partner in the Studio is all
 * it takes to get them onto the site.
 */
export const PARTNERS_PAGE_QUERY = defineQuery(`
  *[_type == "partnersPage"][0]{
    ...,
    "partners": *[_type == "partner" && showOnWebsite != false] | order(order asc, name asc){
      _id,
      name,
      description,
      logo,
      website
    }
  }
`);
