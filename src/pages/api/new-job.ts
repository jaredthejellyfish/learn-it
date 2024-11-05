import type { APIRoute } from 'astro'
import { Jobs, db, isDbError } from 'astro:db'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import type { NewJobAPIResponse } from '@/lib/types'

interface RequestBody {
  query: string
}

const GeneratedCourse = z.object({
  topic: z.string(),
  blurb: z.string(),
})

async function generateTopic(query: string): Promise<{
  topic: string | null
  blurb: string | null
}> {
  const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY,
  })

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that generates concise, relevant topics along with brief blurbs based on user queries. Respond with just the topic and its corresponding blurb, separated by a newline or a clear delimiter, with no additional text. The blurb you generate should be one paragraph and contain a brief explanation of the generated course. The topic and blurb you generate will be used to complete the message:\nSit tight! Our AI is crafting a personalized learning experience about <topic> just for you. \nBlurb: <blurb>',
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: zodResponseFormat(GeneratedCourse, 'course'),
  })

  const event = completion.choices[0]?.message.parsed

  if (!event) {
    return { topic: null, blurb: null }
  }

  return event
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Validate request body
    const body = (await request.json()) as RequestBody
    if (!body.query) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing query in request body',
          redirect: null,
        } satisfies NewJobAPIResponse),
        { status: 400 },
      )
    }

    const userId = (await locals.currentUser().then((user) => user?.id)) ?? null

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found',
          redirect: null,
        } satisfies NewJobAPIResponse),
        { status: 400 },
      )
    }

    // Generate topic using GPT-4
    const { topic, blurb } = await generateTopic(body.query)

    if (!topic || !blurb) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to generate topic',
          redirect: null,
        } satisfies NewJobAPIResponse),
        { status: 400 },
      )
    }

    // Insert into database
    const data = await db
      .insert(Jobs)
      .values({
        id: crypto.randomUUID(),
        topic: topic,
        blurb: blurb,
        query: body.query,
        userId: userId,
        status: 'Starting',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get()

    if (data) {
      return new Response(
        JSON.stringify({
          success: true,
          error: null,
          redirect: `/generating?topic=${encodeURIComponent(
            data.topic,
          )}&jobID=${data.id}`,
        } satisfies NewJobAPIResponse),
        { status: 201 },
      )
    }

    return new Response(null, { status: 201 })
  } catch (e) {
    if (isDbError(e)) {
      return new Response(
        JSON.stringify({
          redirect: null,
          success: false,
          error: `Cannot insert job: ${e.message}`,
        } satisfies NewJobAPIResponse),
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
        redirect: null,
        success: false,
        error: 'An unexpected error occurred',
      } satisfies NewJobAPIResponse),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
