import type { SchemaTypeDefinition } from "sanity";

import faq from "./objects/faq";
import statCard from "./objects/statCard";
import pathwayCard from "./objects/pathwayCard";

import siteSettings from "./documents/siteSettings";
import partner from "./documents/partner";
import homePage from "./documents/homePage";
import aboutPage from "./documents/aboutPage";
import facilityPage from "./documents/facilityPage";
import trainingPage from "./documents/trainingPage";
import iotDiplomaProgramPage from "./documents/iotDiplomaProgramPage";
import partnersPage from "./documents/partnersPage";
import contactPage from "./documents/contactPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    faq,
    statCard,
    pathwayCard,
    siteSettings,
    partner,
    homePage,
    aboutPage,
    facilityPage,
    trainingPage,
    iotDiplomaProgramPage,
    partnersPage,
    contactPage,
  ],
};

export const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "facilityPage",
  "trainingPage",
  "iotDiplomaProgramPage",
  "partnersPage",
  "contactPage",
]);
