import {
  Course,
  Lesson,
  Module,
  and,
  asc,
  db,
  desc,
  eq,
  gt,
  lt,
} from 'astro:db'

export async function getLessonData(
  lessonId: string,
  moduleId: string,
  courseId: string,
) {
  if (!lessonId || !moduleId || !courseId) {
    return { lessonData: null, moduleData: null, courseData: null }
  }

  // Batch the queries in a single transaction
  const [lesson, module, course] = await db.batch([
    db.select().from(Lesson).where(eq(Lesson.id, lessonId)).limit(1),
    db.select().from(Module).where(eq(Module.id, moduleId)).limit(1),
    db.select().from(Course).where(eq(Course.id, courseId)).limit(1),
  ])

  const [nextLesson, previousLesson] = await db.batch([
    db
      .select({
        id: Lesson.id,
        orderIndex: Lesson.orderIndex,
      })
      .from(Lesson)
      .where(
        and(
          eq(Lesson.moduleId, moduleId),
          gt(Lesson.orderIndex, lesson[0]?.orderIndex ?? 0),
        ),
      )
      .orderBy(asc(Lesson.orderIndex))
      .limit(1),
    db
      .select({
        id: Lesson.id,
        orderIndex: Lesson.orderIndex,
      })
      .from(Lesson)
      .where(
        and(
          eq(Lesson.moduleId, moduleId),
          lt(Lesson.orderIndex, lesson[0]?.orderIndex ?? 0),
        ),
      )
      .orderBy(desc(Lesson.orderIndex))
      .limit(1),
  ])

  return {
    moduleData: module[0],
    lessonData: lesson[0],
    courseData: course[0],
    nextLesson: nextLesson[0],
    previousLesson: previousLesson[0],
  }
}

export type LessonData = Awaited<ReturnType<typeof getLessonData>>
