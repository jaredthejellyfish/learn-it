import { Course, db, eq } from 'astro:db'

export const getUserCourses = async (userId: string) => {
  return await db.select().from(Course).where(eq(Course.userId, userId))
}

export type UserCourse = Awaited<ReturnType<typeof getUserCourses>>[number]
export type UserCourses = Awaited<ReturnType<typeof getUserCourses>>
