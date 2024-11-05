import { motion } from 'framer-motion'

function Header() {
  return (
    <section className="text-center mb-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        Powerful Features for Effortless Learning
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
      >
        Discover how LearnIt revolutionizes your learning experience
      </motion.p>
    </section>
  )
}

export default Header
