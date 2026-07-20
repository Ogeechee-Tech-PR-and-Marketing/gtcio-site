import { defineArrayMember, defineField, defineType } from "sanity";
import { heroFields } from "../heroFields";

const resourceLink = defineArrayMember({
  name: "resourceLink",
  title: "Resource",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Link text", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "url",
      title: "Web address",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

const curriculumStage = defineArrayMember({
  name: "curriculumStage",
  title: "Stage",
  type: "object",
  fields: [
    defineField({ name: "stage", title: "Stage name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "What it covers", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "stage", subtitle: "detail" } },
});

const programOption = defineArrayMember({
  name: "programOption",
  title: "Option",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Program name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "code",
      title: "Program code",
      description: 'Optional, e.g. "IS32". Shown in grey after the name.',
      type: "string",
    }),
    defineField({ name: "detail", title: "Short description", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "name", subtitle: "detail" } },
});

const jobDuty = defineArrayMember({
  name: "jobDuty",
  title: "Duty",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Duty", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "What it involves", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "detail" } },
});

const payRange = defineArrayMember({
  name: "payRange",
  title: "Pay tier",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Pay range",
      description: 'The big red figure, e.g. "$55k – $70k".',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Who earns it",
      description: 'The caption underneath, e.g. "Working Technician (a few years in)".',
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export default defineType({
  name: "iotDiplomaProgramPage",
  title: "IOT Diploma Program Page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "whatIs", title: "What is IOT?" },
    { name: "curriculum", title: "Curriculum" },
    { name: "careers", title: "Careers" },
    { name: "pay", title: "Jobs & pay" },
    { name: "faq", title: "FAQ" },
    { name: "apply", title: "Apply band" },
  ],
  fields: [
    ...heroFields("hero"),

    defineField({
      name: "whatIsTitle",
      title: "Section heading",
      type: "string",
      group: "whatIs",
    }),
    defineField({
      name: "whatIsBody",
      title: "Paragraph below the video",
      description: "The video itself is still a placeholder and needs a developer to add.",
      type: "text",
      rows: 4,
      group: "whatIs",
    }),

    defineField({
      name: "nonTraditionalHeading",
      title: "Non-traditional program note heading",
      description:
        "OTC's own program page flags this as a non-traditional program (one gender under 25% of the field's workforce) and links to support resources. Mirrored here.",
      type: "string",
      group: "whatIs",
    }),
    defineField({
      name: "nonTraditionalBody",
      title: "Non-traditional program note body",
      type: "text",
      rows: 3,
      group: "whatIs",
    }),
    defineField({
      name: "nonTraditionalResources",
      title: "Support resource links",
      type: "array",
      of: [resourceLink],
      group: "whatIs",
    }),

    defineField({
      name: "curriculumTitle",
      title: "Curriculum heading",
      type: "string",
      group: "curriculum",
    }),
    defineField({
      name: "curriculumStages",
      title: "Curriculum stages",
      description: 'The three numbered boxes. "Stage 1", "Stage 2" etc. are numbered automatically.',
      type: "array",
      of: [curriculumStage],
      group: "curriculum",
    }),
    defineField({
      name: "moreWaysTitle",
      title: '"More than one way in" heading',
      type: "string",
      group: "curriculum",
    }),
    defineField({
      name: "moreWaysBody",
      title: '"More than one way in" paragraph',
      type: "text",
      rows: 3,
      group: "curriculum",
    }),
    defineField({
      name: "programOptions",
      title: "Diploma and certificate options",
      type: "array",
      of: [programOption],
      group: "curriculum",
    }),

    defineField({
      name: "careersTitle",
      title: "Careers heading",
      type: "string",
      group: "careers",
    }),
    defineField({
      name: "careers",
      title: "Job titles",
      description: "Each one shows as a red outlined tag. Add one job title per item.",
      type: "array",
      of: [{ type: "string" }],
      group: "careers",
    }),
    defineField({
      name: "careersNote",
      title: "Paragraph under the job titles",
      type: "text",
      rows: 2,
      group: "careers",
    }),
    defineField({
      name: "jobDutiesTitle",
      title: '"What the job looks like" heading',
      type: "string",
      group: "careers",
    }),
    defineField({
      name: "jobDuties",
      title: "Day-to-day duties",
      type: "array",
      of: [jobDuty],
      group: "careers",
    }),

    defineField({
      name: "payTitle",
      title: "Section heading",
      type: "string",
      group: "pay",
    }),
    defineField({
      name: "payRanges",
      title: "Pay tiers",
      type: "array",
      of: [payRange],
      group: "pay",
    }),
    defineField({
      name: "timeToComplete",
      title: "Time to complete",
      description: "Still a placeholder — replace once the final program length is confirmed.",
      type: "text",
      rows: 2,
      group: "pay",
    }),
    defineField({
      name: "approximateCost",
      title: "Approximate cost",
      description: "Still a placeholder — replace once the final tuition figure is confirmed.",
      type: "text",
      rows: 2,
      group: "pay",
    }),

    defineField({
      name: "studentFaqTitle",
      title: "FAQ heading",
      type: "string",
      group: "faq",
    }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      type: "array",
      of: [{ type: "faq" }],
      group: "faq",
    }),
    defineField({
      name: "applyHeading",
      title: "Heading",
      description: "The black band at the very bottom of the page.",
      type: "string",
      group: "apply",
    }),
    defineField({
      name: "applyButton",
      title: "Button",
      description: 'Points at Ogeechee Tech\'s application page by default.',
      type: "ctaButton",
      group: "apply",
    }),
  ],
  preview: {
    prepare() {
      return { title: "IOT Diploma Program Page" };
    },
  },
});
