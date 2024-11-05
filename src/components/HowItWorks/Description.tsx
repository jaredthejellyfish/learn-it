import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '../ui/button'

type Props = {}

function Description({}: Props) {
  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
      >
        <div>
          <h2 className="mb-6 text-3xl font-bold">
            The Power of AI in Your Learning Journey
          </h2>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            LearnIt harnesses the latest advancements in artificial intelligence
            to revolutionize the way you learn. Our platform creates
            personalized, adaptive courses tailored to your specific needs and
            learning style.
          </p>
          <Button size="lg">
            Try It Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg bg-gradient-to-br from-purple-200 to-purple-50 p-8 shadow-lg dark:bg-gray-700 dark:from-purple-900 dark:to-purple-500/70"
        >
          <h3 className="mb-4 text-2xl font-semibold">Quick Start</h3>
          <ol className="list-inside list-decimal space-y-2 text-gray-600 dark:text-gray-300">
            <li>Enter your desired topic</li>
            <li>Wait a few seconds for AI generation</li>
            <li>Start your personalized course</li>
            <li>Learn at your own pace</li>
            <li>Track your progress and adapt</li>
          </ol>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Description
