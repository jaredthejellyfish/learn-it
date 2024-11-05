import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import type { NewJobAPIResponse } from '@/lib/types'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function CourseGenerator() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    let redirect: string | null = null
    setLoading(true)
    try {
      const response = await fetch('/api/new-job', {
        method: 'POST',
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        alert('Failed to generate job')
      }

      const data = (await response.json()) as NewJobAPIResponse

      redirect = data.redirect
    } catch (error) {
      console.error(error as Error)
    } finally {
      setLoading(false)
      if (redirect) {
        window.location.href = redirect
      }
    }
  }
  return (
    <section className="text-center mb-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        Learn Anything, Anytime
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
      >
        AI-powered courses generated in real-time, tailored to your interests
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
      >
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Input
            type="text"
            placeholder="Enter a topic..."
            className="w-full md:w-96 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button
            size="lg"
            className="w-full md:w-auto h-11"
            onClick={handleSubmit}
          >
            {loading ? 'Generating...' : 'Generate Course'}{' '}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
