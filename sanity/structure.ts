import type { StructureResolver } from "sanity/structure";

const SINGLETONS: Array<{ id: string; type: string; title: string }> = [
  { id: "siteSettings", type: "siteSettings", title: "Site Settings" },
  { id: "homePage", type: "homePage", title: "Home Page" },
  { id: "aboutPage", type: "aboutPage", title: "About Page" },
  { id: "facilityPage", type: "facilityPage", title: "Facility Page" },
  { id: "trainingPage", type: "trainingPage", title: "Training Page" },
  { id: "iotDiplomaProgramPage", type: "iotDiplomaProgramPage", title: "IOT Diploma Program Page" },
  { id: "partnersPage", type: "partnersPage", title: "Partners Page" },
  { id: "contactPage", type: "contactPage", title: "Contact Page" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("GTCIO Content")
    .items([
      ...SINGLETONS.map((s) =>
        S.listItem()
          .id(s.id)
          .title(s.title)
          .child(S.document().schemaType(s.type).documentId(s.id))
      ),
      S.divider(),
      S.listItem()
        .id("partner")
        .title("Partners (directory)")
        .child(S.documentTypeList("partner").title("Partners")),
    ]);
