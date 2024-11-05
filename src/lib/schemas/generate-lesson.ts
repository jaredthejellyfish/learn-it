import { z } from 'astro/zod'

const GenerateLesson = z.object({
  content: z.string(),
})

export type GenerateLesson = z.infer<typeof GenerateLesson>
