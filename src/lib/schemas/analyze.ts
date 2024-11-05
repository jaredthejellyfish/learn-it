import { z } from 'astro/zod'

const AnalyzeCourse = z.object({
  title: z.string(),
  description: z.string(),
  key_topics: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  learning_objectives: z.array(z.string()),
  modules: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      orderIndex: z.number(),
      lessons: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          resources: z.array(z.string()),
          materials: z.array(z.string()),
          blurb: z.string(),
          orderIndex: z.number(),
        }),
      ),
    }),
  ),
  assessments: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      module_name: z.string(),
    }),
  ),
})

export const emptyCourse: AnalyzedCourse = {
  title: '',
  description: '',
  key_topics: [],
  difficulty: 'beginner',
  learning_objectives: [],
  modules: [],
  assessments: [],
}

export { AnalyzeCourse }
export type AnalyzedCourse = z.infer<typeof AnalyzeCourse>
