import type { SchemaTypeDefinition } from "sanity";

import faq from "./objects/faq";
import statCard from "./objects/statCard";
import pathwayCard from "./objects/pathwayCard";
import timelineEvent from "./objects/timelineEvent";
import infoCard from "./objects/infoCard";
import courseArea from "./objects/courseArea";
import ctaButton from "./objects/ctaButton";

import siteSettings from "./documents/siteSettings";
import partner from "./documents/partner";
import newsItem from "./documents/newsItem";
import formSubmission from "./documents/formSubmission";
import homePage from "./documents/homePage";
import aboutPage from "./documents/aboutPage";
import facilityPage from "./documents/facilityPage";
import trainingPage from "./documents/trainingPage";
import iotDiplomaProgramPage from "./documents/iotDiplomaProgramPage";
import partnersPage from "./documents/partnersPage";
import newsPage from "./documents/newsPage";
import contactPage from "./documents/contactPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    faq,
    statCard,
    pathwayCard,
    timelineEvent,
    infoCard,
    courseArea,
    ctaButton,
    siteSettings,
    partner,
    newsItem,
    formSubmission,
    homePage,
    aboutPage,
    facilityPage,
    trainingPage,
    iotDiplomaProgramPage,
    partnersPage,
    newsPage,
    contactPage,
  ],
};

/**
 * Pages that exist exactly once. These are pinned in the sidebar and cannot be
 * created, duplicated, or deleted from the Studio.
 */
export const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "facilityPage",
  "trainingPage",
  "iotDiplomaProgramPage",
  "partnersPage",
  "newsPage",
  "contactPage",
]);
