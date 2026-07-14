import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]`);

export const FACILITY_PAGE_QUERY = defineQuery(`*[_type == "facilityPage"][0]`);

export const TRAINING_PAGE_QUERY = defineQuery(`*[_type == "trainingPage"][0]`);

export const IOT_DIPLOMA_PROGRAM_PAGE_QUERY = defineQuery(
  `*[_type == "iotDiplomaProgramPage"][0]`
);

export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]`);

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
      logo
    }
  }
`);
