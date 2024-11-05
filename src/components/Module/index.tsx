import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ModuleData } from '@/lib/helpers/getModuleData'



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
}

export default function ModuleComponent({ data }: { data: ModuleData }) {
  const { moduleData, lessonsData } = data

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <motion.div variants={itemVariants} className="w-full">
        <Card className="mb-8 w-full">
          <CardHeader>
            <CardTitle>{moduleData?.title}</CardTitle>
            <CardDescription>{moduleData?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Module {moduleData?.orderIndex}</Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.h2 className="text-2xl font-bold mb-4" variants={itemVariants}>
        Lessons
      </motion.h2>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full"
        variants={containerVariants}
      >
        {lessonsData?.map((lesson) => (
          <motion.div
            key={lesson.id}
            variants={itemVariants}
            className="w-full h-full"
            aria-label={`Go to lesson ${lesson.orderIndex}: ${lesson.title}`}
          >
            <a
              href={`/course/${moduleData?.courseId}/module/${moduleData?.id}/lesson/${lesson.id}`}
              className="block h-full w-full hover:no-underline group"
            >
              <Card className="h-full w-full transition-all duration-200 hover:shadow-lg text-start">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors duration-200">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Lesson {lesson.orderIndex}</Badge>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
