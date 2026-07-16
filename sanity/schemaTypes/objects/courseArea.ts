import { defineField, defineType } from "sanity";

export default defineType({
  name: "courseArea",
  title: "Course area",
  type: "object",
  fields: [
    defineField({
      name: "area",
      title: "Area name",
      description: 'e.g. "Robotics" or "PLCs & Controls".',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "courses",
      title: "Courses in this area",
      description: "One course per line. Use Add item for each course.",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "area", courses: "courses" },
    prepare({ title, courses }) {
      const n = courses?.length ?? 0;
      return { title, subtitle: `${n} course${n === 1 ? "" : "s"}` };
    },
  },
});
