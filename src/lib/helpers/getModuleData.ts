import { Course, Lesson, Module, db, eq } from 'astro:db'

export async function getModuleData(moduleId: string, courseId: string) {
  if (!moduleId) {
    return { moduleData: null, lessonsData: [], courseData: null }
  }

  const module = await db
    .select()
    .from(Module)
    .where(eq(Module.id, moduleId))
    .get()

  const lessons = await db
    .select()
    .from(Lesson)
    .orderBy(Lesson.orderIndex)
    .where(eq(Lesson.moduleId, moduleId))

  const course = await db
    .select()
    .from(Course)
    .where(eq(Course.id, courseId))
    .get()

  return { moduleData: module, lessonsData: lessons, courseData: course }
}

export type ModuleData = Awaited<ReturnType<typeof getModuleData>>
