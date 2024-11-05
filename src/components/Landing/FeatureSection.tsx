import { motion } from 'framer-motion'
import { BookOpen, Clock, Zap } from 'lucide-react'

export function FeatureSection() {
  return (
    <section id="features" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Why Choose LearnIt?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Zap,
            title: 'Instant Generation',
            description: 'Get your course materials in seconds, not hours',
          },
          {
            icon: BookOpen,
            title: 'Tailored Content',
            description: 'Courses adapted to your learning style and pace',
          },
          {
            icon: Clock,
            title: 'Learn Anytime',
            description: 'Access your personalized courses 24/7',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
