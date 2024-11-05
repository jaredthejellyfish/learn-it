import { column, defineDb, defineTable } from 'astro:db'

// Main course table
const Course = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    difficulty: column.text(), // Will store 'beginner', 'intermediate', 'advanced'
    title: column.text(),
    description: column.text(),
    userId: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
})

// Topics table for key_topics
const Topic = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    courseId: column.text({ references: () => Course.columns.id }),
    name: column.text(),
  },
  indexes: [{ on: ['courseId', 'name'], unique: true }],
})

// Learning objectives table
const LearningObjective = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    courseId: column.text({ references: () => Course.columns.id }),
    objective: column.text(),
  },
  indexes: [{ on: ['courseId'] }],
})

// Modules table
const Module = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    courseId: column.text({ references: () => Course.columns.id }),
    title: column.text(),
    description: column.text(),
    orderIndex: column.number(), // To maintain module order
  },
  indexes: [{ on: ['courseId', 'orderIndex'], unique: true }],
})

// Lessons table
const Lesson = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    moduleId: column.text({ references: () => Module.columns.id }),
    title: column.text(),
    description: column.text(),
    content: column.text(),
    blurb: column.text(),
    orderIndex: column.number(), // To maintain lesson order
  },
  indexes: [{ on: ['moduleId', 'orderIndex'], unique: true }],
})

// Resources table for lesson resources
const Resource = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    lessonId: column.text({ references: () => Lesson.columns.id }),
    resource: column.text(),
    type: column.text(), // 'resource' or 'material'
  },
  indexes: [{ on: ['lessonId', 'type'] }],
})

// Assessments table
const Assessment = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    moduleId: column.text({ references: () => Module.columns.id }),
    title: column.text(),
    description: column.text(),
  },
  indexes: [{ on: ['moduleId'] }],
})

// Jobs table (keeping your existing table)
const Jobs = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    topic: column.text(),
    query: column.text(),
    status: column.text(),
    blurb: column.text(),
    userId: column.text(),
    courseId: column.text({
      optional: true,
      references: () => Course.columns.id,
    }),
    course_structure: column.json({ optional: true }),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
})

export default defineDb({
  tables: {
    Course,
    Topic,
    LearningObjective,
    Module,
    Lesson,
    Resource,
    Assessment,
    Jobs,
  },
})
