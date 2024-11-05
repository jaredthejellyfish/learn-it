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
import PQueue from 'p-queue'
import { z } from 'zod'

import { type AnalyzedCourse } from '@/lib/schemas/analyze'
import type { GenerateLesson } from '@/lib/schemas/generate-lesson'
import type { GenerateLessonAPIResponse } from '@/lib/types'

// Type definitions
interface ModuleLesson {
  title: string
  description: string
  resources: string[]
  materials: string[]
  blurb: string
  orderIndex: number
}

interface CourseModule {
  title: string
  description: string
  orderIndex: number
  lessons: ModuleLesson[]
}

const requestSchema = z.object({
  jobID: z.string().min(1),
})

// Utility function to chunk array
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize),
  )
}

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

// Create OpenAI instance
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
})

// Create queue for OpenAI calls
const openAIQueue = new PQueue({ concurrency: 4 })

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
  try {
    const result = await openAIQueue.add(async () => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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

      return content
    })

    return result ? { content: result } : null
  } catch (error) {
    console.error('OpenAI API error:', error)
    return null
  }
}

async function insertResources(
  lessonId: string,
  resources: string[],
  type: 'resource' | 'material',
): Promise<void> {
  if (!resources?.length) return

  const chunks = chunkArray(resources, 50)
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((resource: string) =>
        db
          .insert(Resource)
          .values({
            id: crypto.randomUUID(),
            lessonId,
            resource,
            type,
          })
          .run(),
      ),
    )
  }
}

async function createCourse(
  userId: string,
  courseStructure: AnalyzedCourse,
): Promise<string> {
  // Create course first
  const courseId = crypto.randomUUID()
  await db
    .insert(Course)
    .values({
      id: courseId,
      difficulty: courseStructure.difficulty || 'beginner',
      userId,
      title: courseStructure.title,
      description: courseStructure.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .run()

  // After course is created, insert topics and objectives in parallel
  await Promise.all(
    [
      // Insert topics
      courseStructure.key_topics?.length &&
        Promise.all(
          courseStructure.key_topics.map((topicName) =>
            db
              .insert(Topic)
              .values({
                id: crypto.randomUUID(),
                courseId,
                name: topicName,
              })
              .run(),
          ),
        ),
      // Insert learning objectives
      courseStructure.learning_objectives?.length &&
        Promise.all(
          courseStructure.learning_objectives.map((objective) =>
            db
              .insert(LearningObjective)
              .values({
                id: crypto.randomUUID(),
                courseId,
                objective,
              })
              .run(),
          ),
        ),
    ].filter(Boolean),
  )

  return courseId
}

async function createModule(
  module: CourseModule,
  courseId: string,
): Promise<string> {
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

  return moduleId
}

async function processModuleWithLessons(
  module: CourseModule,
  courseId: string,
  courseStructure: AnalyzedCourse,
): Promise<void> {
  // Create module first
  const moduleId = await createModule(module, courseId)

  // Generate all lesson content in parallel
  const lessonContentsPromises = module.lessons.map((lesson) =>
    generateLesson({
      title: lesson.title,
      description: lesson.description,
      resources: lesson.resources,
      materials: lesson.materials,
      blurb: lesson.blurb,
      courseTitle: courseStructure.title,
      courseDescription: courseStructure.description,
    }),
  )

  const lessonContents = await Promise.all(lessonContentsPromises)

  // Process lessons sequentially to maintain order
  for (const [index, lesson] of module.lessons.entries()) {
    const generatedContent = lessonContents[index]
    if (!generatedContent) {
      throw new Error(`Failed to generate content for lesson: ${lesson.title}`)
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

    // After lesson is inserted, handle resources and materials in parallel
    await Promise.all([
      insertResources(lessonId, lesson.resources, 'resource'),
      insertResources(lessonId, lesson.materials, 'material'),
    ])
  }

  // After all lessons are created, insert assessment if it exists
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
      // Step 1: Create course and its associated entities
      const courseId = await createCourse(job.userId, courseStructure)

      // Step 2: Process modules sequentially to maintain order
      if (courseStructure.modules) {
        for (const module of courseStructure.modules) {
          await processModuleWithLessons(module, courseId, courseStructure)
        }
      }

      // Step 3: Update job status after everything is complete
      await db
        .update(Jobs)
        .set({
          status: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(Jobs.id, jobID))
        .run()

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
      throw dbError
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
