import { motion } from 'framer-motion'
import { BookOpen, Clock, Layers, Sparkles, Target, Zap } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description:
      'Get your course materials in seconds, not hours. Our AI-powered system quickly analyzes your topic and creates a comprehensive course structure.',
  },
  {
    icon: BookOpen,
    title: 'Tailored Content',
    description:
      'Courses are adapted to your learning style and pace. The AI considers your preferences and prior knowledge to deliver personalized learning experiences.',
  },
  {
    icon: Clock,
    title: 'Learn Anytime',
    description:
      "Access your personalized courses 24/7. Whether you're a night owl or an early bird, your AI-generated course is always ready for you.",
  },
  {
    icon: Target,
    title: 'Adaptive Learning',
    description:
      "Our AI continuously adjusts the course difficulty based on your progress, ensuring you're always challenged but never overwhelmed.",
  },
  {
    icon: Layers,
    title: 'Multi-format Content',
    description:
      'Enjoy a mix of text, images, and interactive elements in your courses. Our AI selects the best format for each concept to enhance your learning.',
  },
  {
    icon: Sparkles,
    title: 'Always Up-to-date',
    description:
      'Benefit from the latest information in your field. Our AI constantly updates course content with the newest research and developments.',
  },
]

function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </section>
  )
}

export default Features
