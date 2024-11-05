export interface AnalyzedCourseAPIResponse {
  error: boolean
  updatedJob: {
    topic: string
    id: string
    status: string
    query: string
    blurb: string
    course_structure: unknown
    createdAt: Date
    updatedAt: Date
  } | null
}

export interface NewJobAPIResponse {
  success: boolean
  error: string | null
  redirect: string | null
}

export interface GenerateLessonAPIResponse {
  error: boolean
  courseId: string | null
  data: {
    modules: Array<{
      moduleIndex: number
      lessons: Array<{
        content: string
        lessonIndex: number
      }>
    }>
  } | null
  message?: string
}
