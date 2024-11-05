import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Brain, Loader2, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Progress } from '@/components/ui/progress'
import type {
  AnalyzedCourseAPIResponse,
  GenerateLessonAPIResponse,
} from '@/lib/types'

const analyze = async (jobId: string) => {
  try {
    const res = await fetch('/api/generator/analyze', {
      method: 'POST',
      body: JSON.stringify({ jobID: jobId }),
    })
    const data = (await res.json()) as AnalyzedCourseAPIResponse
    return data
  } catch (e) {
    return { error: true, updatedJob: null }
  }
}

const generateLessons = async (jobId: string) => {
  try {
    const res = await fetch('/api/generator/generate-lessons', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobID: jobId }),
    })
    const data = (await res.json()) as GenerateLessonAPIResponse
    return data
  } catch (e) {
    console.error('Generate lessons error:', e)
    return {
      error: true,
      courseId: null,
      data: null,
      message: 'An error occurred while generating lessons',
    } satisfies GenerateLessonAPIResponse
  }
}

export default function CourseGeneratingPage({
  topic,
  jobId,
}: {
  topic?: string
  jobId?: string
}) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!jobId) {
      window.location.href = '/'
      return
    }

    const runAnalyzeAndGenerate = async () => {
      try {
        // Run analysis first
        const analyzeResult = await analyze(jobId)
        console.log('Analyze result:', analyzeResult)

        if (analyzeResult.error) {
          console.error('Analysis failed')
          window.location.href = '/'
          return
        }

        setProgress(40)

        // Start generation after analysis is complete
        const generateResult = await generateLessons(jobId)
        console.log('Generate result:', generateResult)

        if (generateResult.error) {
          console.error('Generation failed')
          window.location.href = '/'
          return
        }

        setProgress(90)

        // Set complete and redirect
        setIsComplete(true)
        setTimeout(() => {
          if (generateResult.courseId) {
            window.location.href = `/course/${generateResult.courseId}`
          } else {
            window.location.href = '/'
          }
        }, 1500)
      } catch (error) {
        console.error('Error in generation process:', error)
        window.location.href = '/'
      }
    }

    runAnalyzeAndGenerate()
  }, [jobId])

  // Update current step based on progress
  useEffect(() => {
    const step = Math.floor(progress / 25)
    setCurrentStep(step > 3 ? 3 : step)
  }, [progress])

  const steps = [
    { icon: Brain, text: 'Analyzing your topic' },
    { icon: BookOpen, text: 'Structuring course content' },
    { icon: Sparkles, text: 'Generating lessons and quizzes' },
    { icon: Zap, text: 'Finalizing your personalized course' },
  ]

  return (
    <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Generating Your Course
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
          Sit tight! Our AI is crafting a personalized learning experience
          {topic && ` about ${topic}`} just for you.
        </p>
      </motion.div>

      <div className="w-full max-w-3xl mb-12">
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-right text-lg font-semibold">{progress}% Complete</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center ${
              index <= currentStep
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            <div className="mr-4">
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="w-8 h-8" />
                </motion.div>
              ) : index === currentStep ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8" />
                </motion.div>
              ) : (
                <step.icon className="w-8 h-8" />
              )}
            </div>
            <span className="text-lg font-semibold">{step.text}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Your Course is Ready!</h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Exciting! Your personalized AI-generated course is now available.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isComplete && (
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Did You Know?</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              LearnIt uses advanced machine learning algorithms to create
              courses tailored to your learning style and pace.
            </p>
          </motion.div>
        </div>
      )}
    </main>
  )
}
