"use client";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanity/env";
import { resolve } from "./sanity/presentation";
import { schema, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "gtcio",
  title: "GTCIO Website",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    // Tool names are what an editor reads in the top bar, so avoid CMS jargon.
    structureTool({ title: "Pages", structure }),
    presentationTool({
      title: "Edit on page",
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  document: {
    // Singletons can't be created or destroyed from the Studio — only edited.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((option) => !singletonTypes.has(option.templateId))
        : prev,
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(
            ({ action }) => action !== "duplicate" && action !== "delete"
          )
        : prev,
  },
});
