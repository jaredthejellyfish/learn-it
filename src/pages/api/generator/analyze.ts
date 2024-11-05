import type { APIRoute } from 'astro'
import { Jobs, db, eq, isDbError } from 'astro:db'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'

import {
  AnalyzeCourse,
  type AnalyzedCourse,
  emptyCourse,
} from '@/lib/schemas/analyze'
import type { AnalyzedCourseAPIResponse } from '@/lib/types'

interface RequestBody {
  jobID: string
}

const courseGenerator = (query: string, blurb: string, topic: string) => `
# Course Generation Template

<query>
${query}
</query>

<topic>
${topic}
</topic>

<blurb>
${blurb}
</blurb>

## Generation Instructions

1. ANALYZE REQUEST
- Extract key skills and topics from blurb
- Identify core learning objectives
- Determine appropriate skill progression
- Map essential concepts
- Define scope boundaries

2. STRUCTURE CONTENT
- Break down into logical modules
- Design progressive skill building
- Balance theory and hands-on practice
- Include safety fundamentals
- Plan practical demonstrations
- Create hands-on exercises

3. DESIGN LESSONS
For each module:
- Clear learning goals
- Step-by-step instructions
- Practical examples
- Guided practice sessions
- Essential equipment/materials needed
- Safety considerations
- Common mistakes to avoid
- Tips for success

4. CREATE ASSESSMENTS
- Skill checkpoints
- Practice exercises
- Practical demonstrations
- Final projects
- Self-evaluation guides

5. DEFINE RESOURCES
- Required tools/equipment
- Basic ingredients
- Safety guidelines
- Reference materials
- Practice exercises

## Quality Requirements
- Clear, actionable instructions
- Generate a minimum of 5 modules with 5 lessons each
- Logical skill progression
- Safety-first approach
- Practical, hands-on focus
- Measurable outcomes
- Beginner-friendly language
`

async function analyzeCourse(
  query: string,
  topic: string,
  blurb: string,
): Promise<AnalyzedCourse> {
  const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY,
  })

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: courseGenerator(query, blurb, topic),
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: zodResponseFormat(AnalyzeCourse, 'modules'),
  })

  const event = completion.choices[0]?.message.parsed

  if (!event) {
    return emptyCourse
  }

  return event
}

export const POST: APIRoute = async (ctx) => {
  try {
    // Validate request body
    const body = (await ctx.request.json()) as RequestBody
    if (!body.jobID) {
      return new Response(
        JSON.stringify({
          error: true,
          updatedJob: null,
        } satisfies AnalyzedCourseAPIResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const job = await db
      .select()
      .from(Jobs)
      .where(eq(Jobs.id, body.jobID))
      .get()

    if (!job) {
      return new Response(
        JSON.stringify({
          error: true,
          updatedJob: null,
        } satisfies AnalyzedCourseAPIResponse),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Generate topic using GPT-4
    const course = await analyzeCourse(job.query, job.topic, job.blurb)

    if (course === emptyCourse) {
      return new Response(
        JSON.stringify({
          error: true,
          updatedJob: null,
        } satisfies AnalyzedCourseAPIResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const updatedJob = await db
      .update(Jobs)
      .set({
        course_structure: course,
        status: 'generating',
      })
      .where(eq(Jobs.id, body.jobID))
      .returning()
      .get()

    return new Response(
      JSON.stringify({
        error: false,
        updatedJob,
      } satisfies AnalyzedCourseAPIResponse),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (e) {
    if (isDbError(e)) {
      return new Response(
        JSON.stringify({
          error: true,
          updatedJob: null,
        } satisfies AnalyzedCourseAPIResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    console.error('Unexpected error:', e)
    return new Response(
      JSON.stringify({
        error: true,
        updatedJob: null,
      } satisfies AnalyzedCourseAPIResponse),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
