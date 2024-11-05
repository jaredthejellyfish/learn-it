import { motion } from 'framer-motion'
import { BookOpen, Brain, Rocket, Search } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Enter Your Topic',
    description:
      'Start by entering any topic you want to learn about. Our AI can handle subjects ranging from basic concepts to advanced theories.',
  },
  {
    icon: Brain,
    title: 'AI Analyzes and Generates',
    description:
      'Our advanced AI processes your request, analyzing vast amounts of data to create a tailored course structure and content.',
  },
  {
    icon: BookOpen,
    title: 'Course is Created',
    description:
      'Within seconds, a comprehensive course is generated, complete with lessons, quizzes, and additional resources.',
  },
  {
    icon: Rocket,
    title: 'Start Learning',
    description:
      'Dive into your personalized course immediately. As you progress, the AI adapts the content to optimize your learning experience.',
  },
]

type Props = {}

function Process({}: Props) {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-12 text-center">
        The LearnIt Process
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 dark:bg-gray-700 p-3 rounded-full mb-4">
              <step.icon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Process
