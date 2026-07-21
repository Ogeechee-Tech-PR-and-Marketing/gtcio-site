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
    // Studio lands on whichever tool is listed first. "Edit on page" goes first
    // so an editor arrives at the live site and can click the thing they want to
    // change, rather than at a list of documents they'd have to decode.
    // Tool names are what they read in the top bar, so avoid CMS jargon.
    presentationTool({
      title: "Edit on page",
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    structureTool({ title: "Pages", structure }),
  ],
  document: {
    // Singletons can't be created or destroyed from the Studio — only edited.
    // Form submissions arrive from the website, so they can't be hand-created either.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (option) =>
              !singletonTypes.has(option.templateId) &&
              option.templateId !== "formSubmission" &&
              option.templateId !== "constantContactAuth"
          )
        : prev,
    actions: (prev, { schemaType }) => {
      // Holds a live Constant Contact OAuth refresh token, server-managed only
      // (see the schema file's header comment). No Studio action at all — not
      // even Delete — so nobody can publish it or hand-edit a token.
      if (schemaType === "constantContactAuth") {
        return [];
      }
      if (singletonTypes.has(schemaType)) {
        return prev.filter(
          ({ action }) => action !== "duplicate" && action !== "delete"
        );
      }
      // Form submissions are written as DRAFTS on purpose: the dataset is
      // publicly readable, and drafts are the only documents that require auth
      // to read. Publishing one would put the visitor's contact details on the
      // open internet — so the only action an editor gets is Delete.
      if (schemaType === "formSubmission") {
        return prev.filter(({ action }) => action === "delete");
      }
      return prev;
    },
  },
});
