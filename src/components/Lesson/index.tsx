import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { LessonData } from '@/lib/helpers/getLessonData'



type LessonPageProps = { data: LessonData }

export default function LessonComponent({
  data: { moduleData, lessonData, courseData, nextLesson, previousLesson },
}: LessonPageProps) {
  const module = moduleData
  const lesson = lessonData
  const course = courseData

  if (!module || !lesson || !course) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      className="container w-full px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Module {module.orderIndex}</Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="mb-4">
              Lesson {lesson.orderIndex}
            </Badge>
            <div className="flex justify-between items-center mb-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center w-full justify-end"
              >
                {previousLesson && (
                  <a
                    href={`/course/${course.id}/module/${module.id}/lesson/${previousLesson?.id}`}
                  >
                    <Button variant="outline" className="mr-2">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
                    </Button>
                  </a>
                )}
                {nextLesson && (
                  <a
                    href={`/course/${course.id}/module/${module.id}/lesson/${nextLesson?.id}`}
                  >
                    <Button variant="outline">
                      Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
              </motion.div>
            </div>
            <AnimatePresence>
              <motion.div
                className="prose dark:prose-invert max-w-none"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
