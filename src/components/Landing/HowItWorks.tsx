import { motion } from 'framer-motion'

type Props = {}

export function HowItWorks({}: Props) {
  return (
    <section id="how-it-works" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
        {[
          {
            step: 1,
            title: 'Enter Your Topic',
            description: 'Type in any subject you want to learn about',
          },
          {
            step: 2,
            title: 'AI Generates Content',
            description: 'Our AI creates a tailored course in seconds',
          },
          {
            step: 3,
            title: 'Start Learning',
            description: 'Access your personalized course immediately',
          },
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {step.step}
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
