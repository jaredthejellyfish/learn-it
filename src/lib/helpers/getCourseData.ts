import {
  Assessment,
  Course,
  LearningObjective,
  Lesson,
  Module,
  Resource,
  Topic,
  db,
  eq,
} from 'astro:db'

async function getCourseData(courseId: string) {
  // Get course basic info
  const course = await db
    .select()
    .from(Course)
    .where(eq(Course.id, courseId))
    .then((courses) => courses[0])

  if (!course) {
    return null
  }

  // Get topics separately
  const topics = await db
    .select()
    .from(Topic)
    .where(eq(Topic.courseId, courseId))

  // Get learning objectives separately
  const learningObjectives = await db
    .select()
    .from(LearningObjective)
    .where(eq(LearningObjective.courseId, courseId))

  // Get modules with their lessons, resources, and assessments
  const modules = await db
    .select()
    .from(Module)
    .where(eq(Module.courseId, courseId))
    .orderBy(Module.orderIndex)
    .leftJoin(Assessment, eq(Assessment.moduleId, Module.id))

  // Get all lessons and resources for this course's modules
  const moduleData = await Promise.all(
    modules.map(async ({ Module: module }) => {
      const moduleLessons = await db
        .select()
        .from(Lesson)
        .where(eq(Lesson.moduleId, module.id))
        .orderBy(Lesson.orderIndex)

      const lessonData = await Promise.all(
        moduleLessons.map(async (lesson) => {
          const resources = await db
            .select()
            .from(Resource)
            .where(eq(Resource.lessonId, lesson.id))

          return {
            ...lesson,
            resources: resources,
          }
        }),
      )

      return {
        module,
        lessons: lessonData,
      }
    }),
  )

  // Organize the data into a structured format
  const courseData = {
    course: {
      id: courseId,
      difficulty: course.difficulty,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    },
    topics: topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
    })),
    learningObjectives: learningObjectives.map((objective) => ({
      id: objective.id,
      objective: objective.objective,
    })),
    modules: moduleData.map(({ module, lessons }) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      orderIndex: module.orderIndex,
      assessment: modules.find((m) => m.Module.id === module.id)?.Assessment
        ? {
            id: modules.find((m) => m.Module.id === module.id)!.Assessment!.id,
            title: modules.find((m) => m.Module.id === module.id)!.Assessment!
              .title,
            description: modules.find((m) => m.Module.id === module.id)!
              .Assessment!.description,
          }
        : null,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        blurb: lesson.blurb,
        orderIndex: lesson.orderIndex,
        resources: lesson.resources.map((resource) => ({
          id: resource.id,
          resource: resource.resource,
          type: resource.type,
        })),
      })),
    })),
  }

  return courseData
}

export { getCourseData }
export type CourseData = Awaited<ReturnType<typeof getCourseData>>
