import { defineField, type FieldDefinition } from "sanity";

const DEFAULT_IMAGE_DESCRIPTION =
  "The photo behind the headline. After uploading, click Edit hotspot and drag the circle onto the part of the photo that should stay visible — the image is cropped differently on phones and computers. Leave blank to keep the current photo.";

const DEFAULT_VIDEO_DESCRIPTION =
  "Upload a new video to replace the one currently playing behind the headline. Leave blank to keep the current video. A Background photo above always takes priority over any video, current or new.";

/**
 * The image + (optionally) video fields shared by every hero. Split out from
 * `heroFields` so pages whose headline fields don't match the interior-page
 * shape (the Home page's multi-line headline, for one) can still reuse the
 * media half.
 */
export function heroMediaFields(
  group: string,
  opts?: { imageDescription?: string; includeVideo?: boolean; videoDescription?: string }
) {
  const fields: FieldDefinition[] = [
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

  if (opts?.includeVideo) {
    fields.push(
      defineField({
        name: "heroVideo",
        title: "Background video",
        description: opts?.videoDescription ?? DEFAULT_VIDEO_DESCRIPTION,
        type: "file",
        options: { accept: "video/*" },
        group,
      }),
      defineField({
        name: "heroVideoPoster",
        title: "Video preview image",
        description:
          "Shown for a moment while the new video loads, and to any visitor whose browser can't play it. Pick a still frame from the new video. Leave blank to keep the current one. Only used when you've also uploaded a Background video above.",
        type: "image",
        group,
      })
    );
  }

  return fields;
}

/**
 * The dark banner at the top of every interior page: small gold label,
 * big headline, intro paragraph, and a background photo (and, where
 * `includeVideo` is set, a background video).
 *
 * `imageDescription` overrides the help text on the photo field — used by the
 * About page, whose banner plays a video unless a photo is uploaded.
 */
export function heroFields(
  group: string,
  opts?: { imageDescription?: string; includeVideo?: boolean; videoDescription?: string }
) {
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
    ...heroMediaFields(group, opts),
  ];
}
