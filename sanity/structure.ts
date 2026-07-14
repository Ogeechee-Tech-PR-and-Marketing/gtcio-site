import type { StructureResolver } from "sanity/structure";

const PAGES: Array<{ id: string; title: string }> = [
  { id: "homePage", title: "Home Page" },
  { id: "aboutPage", title: "About Page" },
  { id: "iotDiplomaProgramPage", title: "IOT Diploma Program Page" },
  { id: "facilityPage", title: "Facility Page" },
  { id: "trainingPage", title: "Training Page" },
  { id: "partnersPage", title: "Partners Page" },
  { id: "contactPage", title: "Contact Page" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("GTCIO Website")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site Settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),

      S.divider(),

      // Listed in the same order as the site's navigation bar.
      ...PAGES.map((page) =>
        S.listItem()
          .id(page.id)
          .title(page.title)
          .child(
            S.document()
              .schemaType(page.id)
              .documentId(page.id)
              .title(page.title)
          )
      ),

      S.divider(),

      S.listItem()
        .id("partner")
        .title("Partner logos & info")
        .child(
          S.documentTypeList("partner")
            .title("Partner logos & info")
            .defaultOrdering([
              { field: "order", direction: "asc" },
              { field: "name", direction: "asc" },
            ])
        ),
    ]);
