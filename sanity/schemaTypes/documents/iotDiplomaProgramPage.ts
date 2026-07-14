import { defineArrayMember, defineField, defineType } from "sanity";

const curriculumStage = defineArrayMember({
  name: "curriculumStage",
  title: "Stage",
  type: "object",
  fields: [
    defineField({ name: "stage", title: "Stage name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
});

const programOption = defineArrayMember({
  name: "programOption",
  title: "Option",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "code", title: "Program code (optional)", type: "string" }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
});

const jobDuty = defineArrayMember({
  name: "jobDuty",
  title: "Duty",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
});

export default defineType({
  name: "iotDiplomaProgramPage",
  title: "IOT Diploma Program Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroDescription", title: "Hero paragraph", type: "text", rows: 3 }),

    defineField({ name: "whatIsTitle", title: "\"What is IOT?\" heading", type: "string" }),
    defineField({ name: "whatIsBody", title: "\"What is IOT?\" paragraph (below the video)", type: "text", rows: 4 }),

    defineField({ name: "curriculumTitle", title: "Curriculum heading", type: "string" }),
    defineField({ name: "curriculumStages", title: "Curriculum stages", type: "array", of: [curriculumStage] }),

    defineField({ name: "moreWaysTitle", title: "\"More than one way in\" heading", type: "string" }),
    defineField({ name: "moreWaysBody", title: "\"More than one way in\" paragraph", type: "text", rows: 3 }),
    defineField({ name: "programOptions", title: "Program options", type: "array", of: [programOption] }),

    defineField({ name: "careersTitle", title: "Careers heading", type: "string" }),
    defineField({ name: "careers", title: "Career titles", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "careersNote", title: "Careers note paragraph", type: "text", rows: 2 }),

    defineField({ name: "jobDutiesTitle", title: "\"What the job looks like\" heading", type: "string" }),
    defineField({ name: "jobDuties", title: "Job duties", type: "array", of: [jobDuty] }),

    defineField({ name: "payTitle", title: "\"Jobs & pay\" heading", type: "string" }),
    defineField({
      name: "payRanges",
      title: "Pay ranges (Value = the dollar range, Label = the tier name)",
      type: "array",
      of: [{ type: "statCard" }],
    }),
    defineField({ name: "timeToComplete", title: "Time to complete", type: "text", rows: 2 }),
    defineField({ name: "approximateCost", title: "Approximate cost", type: "text", rows: 2 }),

    defineField({ name: "studentFaqTitle", title: "Student FAQ heading", type: "string" }),
    defineField({ name: "faqs", title: "Student FAQ", type: "array", of: [{ type: "faq" }] }),

    defineField({ name: "applyHeading", title: "Closing \"Apply\" heading", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "IOT Diploma Program Page" };
    },
  },
});
