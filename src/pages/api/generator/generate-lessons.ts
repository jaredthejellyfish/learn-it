import type { APIRoute } from 'astro'
import {
  Assessment,
  Course,
  Jobs,
  LearningObjective,
  Lesson,
  Module,
  Resource,
  Topic,
  db,
  eq,
  isDbError,
} from 'astro:db'
import OpenAI from 'openai'
import { z } from 'zod'

import { type AnalyzedCourse } from '@/lib/schemas/analyze'
import type { GenerateLesson } from '@/lib/schemas/generate-lesson'
import type { GenerateLessonAPIResponse } from '@/lib/types'

// Request validation schema
const requestSchema = z.object({
  jobID: z.string().min(1),
})

// Template literal type for better type safety
const lessonGenerator = ({
  title,
  description,
  resources,
  materials,
  blurb,
  courseTitle,
  courseDescription,
}: {
  title: string
  description: string
  resources: string[]
  materials: string[]
  blurb: string
  courseTitle: string
  courseDescription: string
}) => `# Lesson Generation Template

<context>
Course: ${courseTitle}
Course Description: ${courseDescription}
</context>

<lessonDetails>
Title: ${title}
Description: ${description}
Resources: ${resources.join(', ')}
Materials: ${materials.join(', ')}
Overview: ${blurb}
</lessonDetails>

## Generation Instructions

1. LESSON STRUCTURE
Create a comprehensive lesson that includes:
- Opening hook/engagement
- Clear learning objectives
- Key concepts and definitions
- Real-world examples
- Interactive elements
- Practice activities
- Knowledge check points
- Summary and takeaways

2. CONTENT REQUIREMENTS
- Define all terminology clearly
- Provide practical exercises
- Add discussion points
- List common misconceptions
- Highlight best practices
- Make it engaging and interactive
- Use language that is easy to understand
- Do not include external links or resources
- Do not include any images
- Lessons should be extensive and detailed

3. DELIVERY FORMAT
Structure the lesson as:
- Introduction
- Main content
- Activities
- Discussion
- Summary

## Quality Guidelines
- All content must be actionable and practical
- Use clear, jargon-free language
- Include real-world applications
- Ensure logical flow between concepts
- Build from simple to complex ideas
- Incorporate engagement points
- Allow for student interaction
- Provide concrete examples

## Output Format
- Output should be in markdown format and have no other formatting
- Output should only contain the content of the lesson and nothing else`

async function generateLesson({
  title,
  description,
  resources,
  materials,
  blurb,
  courseTitle,
  courseDescription,
}: {
  title: string
  description: string
  resources: string[]
  materials: string[]
  blurb: string
  courseTitle: string
  courseDescription: string
}): Promise<GenerateLesson | null> {
  const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY,
  })

  try {
    const completion = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: lessonGenerator({
            title,
            description,
            resources,
            materials,
            blurb,
            courseTitle,
            courseDescription,
          }),
        },
      ],
    })

    const content = completion.choices[0]?.message.content

    if (!content) {
      console.error('No content generated from OpenAI')
      return null
    }

    return { content }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return null
  }
}
export const POST: APIRoute = async (ctx) => {
  try {
    const rawBody = await ctx.request.json()
    const validationResult = requestSchema.safeParse(rawBody)

    const userId =
      (await ctx.locals.currentUser().then((user) => user?.id)) ?? null

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: true,
          data: null,
          courseId: null,
          message: 'User not found',
        } satisfies GenerateLessonAPIResponse),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: true,
          data: null,
          courseId: null,
          message: 'Invalid request body',
        } satisfies GenerateLessonAPIResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { jobID } = validationResult.data

    // Fetch job from database
    const job = await db.select().from(Jobs).where(eq(Jobs.id, jobID)).get()

    if (!job) {
      return new Response(
        JSON.stringify({
          error: true,
          data: null,
          courseId: null,
          message: 'Job not found',
        } satisfies GenerateLessonAPIResponse),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const courseStructure = job.course_structure as AnalyzedCourse

    try {
      // Start with course creation since it's the root entity
      const courseId = crypto.randomUUID()
      await db
        .insert(Course)
        .values({
          id: courseId,
          difficulty: courseStructure.difficulty || 'beginner', // Providing a default
          userId: job.userId,
          title: courseStructure.title,
          description: courseStructure.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .run()

      // Insert topics for the course
      if (courseStructure.key_topics?.length) {
        await Promise.all(
          courseStructure.key_topics.map(async (topicName) => {
            await db
              .insert(Topic)
              .values({
                id: crypto.randomUUID(),
                courseId,
                name: topicName,
              })
              .run()
          }),
        )
      }

      // Insert learning objectives
      if (courseStructure.learning_objectives?.length) {
        await Promise.all(
          courseStructure.learning_objectives.map(async (objective) => {
            await db
              .insert(LearningObjective)
              .values({
                id: crypto.randomUUID(),
                courseId,
                objective,
              })
              .run()
          }),
        )
      }

      // Insert modules and their related entities
      if (courseStructure.modules?.length) {
        for (const module of courseStructure.modules) {
          // Create module
          const moduleId = crypto.randomUUID()
          await db
            .insert(Module)
            .values({
              id: moduleId,
              courseId,
              title: module.title,
              description: module.description,
              orderIndex: module.orderIndex,
            })
            .run()

          // Generate and insert lessons for this module
          if (module.lessons?.length) {
            for (const lesson of module.lessons) {
              const generatedContent = await generateLesson({
                title: lesson.title,
                description: lesson.description,
                resources: lesson.resources,
                materials: lesson.materials,
                blurb: lesson.blurb,
                courseTitle: courseStructure.title,
                courseDescription: courseStructure.description,
              })

              if (!generatedContent) {
                throw new Error(
                  `Failed to generate content for lesson: ${lesson.title}`,
                )
              }

              // Insert lesson
              const lessonId = crypto.randomUUID()
              await db
                .insert(Lesson)
                .values({
                  id: lessonId,
                  moduleId,
                  title: lesson.title,
                  description: lesson.description,
                  content: generatedContent.content,
                  blurb: lesson.blurb,
                  orderIndex: lesson.orderIndex,
                })
                .run()

              // Insert resources
              if (lesson.resources?.length) {
                await Promise.all(
                  lesson.resources.map(async (resource) => {
                    await db
                      .insert(Resource)
                      .values({
                        id: crypto.randomUUID(),
                        lessonId,
                        resource,
                        type: 'resource',
                      })
                      .run()
                  }),
                )
              }

              // Insert materials
              if (lesson.materials?.length) {
                await Promise.all(
                  lesson.materials.map(async (material) => {
                    await db
                      .insert(Resource)
                      .values({
                        id: crypto.randomUUID(),
                        lessonId,
                        resource: material,
                        type: 'material',
                      })
                      .run()
                  }),
                )
              }
            }
          }

          // Insert assessment if it exists for this module
          const moduleAssessment = courseStructure.assessments?.find(
            (assessment) => assessment.module_name === module.title,
          )

          if (moduleAssessment) {
            await db
              .insert(Assessment)
              .values({
                id: crypto.randomUUID(),
                moduleId,
                title: moduleAssessment.title,
                description: moduleAssessment.description,
              })
              .run()
          }
        }
      }

      // Update job status
      await db
        .update(Jobs)
        .set({
          status: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(Jobs.id, jobID))
        .run()

      // Return success response
      return new Response(
        JSON.stringify({
          error: false,
          data: {
            modules: courseStructure.modules.map((module) => ({
              moduleIndex: module.orderIndex,
              lessons: module.lessons.map((lesson) => ({
                content: ' ',
                lessonIndex: lesson.orderIndex,
              })),
            })),
          },
          courseId,
        } satisfies GenerateLessonAPIResponse),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      )
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      throw dbError // Re-throw to be caught by outer catch block
    }
  } catch (e) {
    if (isDbError(e)) {
      console.error('Database error details:', e)
      return new Response(
        JSON.stringify({
          error: true,
          data: null,
          courseId: null,
          message: `Database error: ${e.message}`,
        } satisfies GenerateLessonAPIResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    console.error('Unexpected error:', e)
    return new Response(
      JSON.stringify({
        error: true,
        data: null,
        courseId: null,
        message: 'Internal server error',
      } satisfies GenerateLessonAPIResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
