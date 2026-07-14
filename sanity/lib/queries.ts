import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]`);

export const FACILITY_PAGE_QUERY = defineQuery(`*[_type == "facilityPage"][0]`);

export const TRAINING_PAGE_QUERY = defineQuery(`*[_type == "trainingPage"][0]`);

export const IOT_DIPLOMA_PROGRAM_PAGE_QUERY = defineQuery(
  `*[_type == "iotDiplomaProgramPage"][0]`
);

export const PARTNERS_PAGE_QUERY = defineQuery(`
  *[_type == "partnersPage"][0]{
    ...,
    directory[]->{
      _id,
      name,
      description,
      logo
    }
  }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]`);
