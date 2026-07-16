import { defineField } from "sanity";

const DEFAULT_IMAGE_DESCRIPTION =
  "The photo behind the headline. After uploading, click Edit hotspot and drag the circle onto the part of the photo that should stay visible — the image is cropped differently on phones and computers. Leave blank to keep the current photo.";

/**
 * The dark banner at the top of every interior page: small gold label,
 * big headline, intro paragraph, and a background photo.
 *
 * `imageDescription` overrides the help text on the photo field — used by the
 * About page, whose banner plays a video unless a photo is uploaded.
 */
export function heroFields(group: string, opts?: { imageDescription?: string }) {
  return [
    defineField({
      name: "heroEyebrow",
      title: "Small label above the headline",
      description: "The little gold text at the top. Leave blank to hide it.",
      type: "string",
      group,
    }),
    defineField({
      name: "heroTitle",
      title: "Headline",
      description: "The big text in the dark banner at the top of the page.",
      type: "string",
      validation: (r) => r.required(),
      group,
    }),
    defineField({
      name: "heroDescription",
      title: "Intro paragraph",
      description: "The paragraph under the headline. Leave blank to hide it.",
      type: "text",
      rows: 3,
      group,
    }),
    defineField({
      name: "heroImage",
      title: "Background photo",
      description: opts?.imageDescription ?? DEFAULT_IMAGE_DESCRIPTION,
      type: "image",
      options: { hotspot: true },
      group,
    }),
    defineField({
      name: "heroImageAlt",
      title: "Photo description (for screen readers)",
      description:
        "A short description of what's in the photo, for visually impaired visitors. Only needed if you upload a new photo.",
      type: "string",
      group,
    }),
  ];
}
