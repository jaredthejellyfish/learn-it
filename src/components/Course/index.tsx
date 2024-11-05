import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  List,
  Target,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseData } from '@/lib/helpers/getCourseData'



export default function CourseComponent({
  data: courseData,
}: {
  data: CourseData
}) {
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean
  }>({})

  if (!courseData) {
    return null
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 text-center"
      >
        {courseData.course.title}
      </motion.h1>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span>
              <strong>Difficulty:</strong>{' '}
              <Badge variant="outline">{courseData.course.difficulty}</Badge>
            </span>
            <span>
              <strong>Created:</strong>{' '}
              {new Date(
                courseData.course.createdAt ?? new Date(),
              ).toLocaleDateString()}
            </span>
            <span>
              <strong>Last Updated:</strong>{' '}
              {new Date(
                courseData.course.updatedAt ?? new Date(),
              ).toLocaleDateString()}
            </span>
            <span className="flex flex-col">
              <strong className="mb-2 mt-4">Description</strong>
              {courseData.course.description}
            </span>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2" />
              Topics Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {courseData.topics.map((topic) => (
                <li key={topic.id} className="flex items-center justify-start">
                  <span className="mr-2">•</span>
                  {topic.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective) => (
                <li
                  key={objective.id}
                  className="flex items-center justify-start"
                >
                  <span className="mr-2">•</span>
                  {objective.objective}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <GraduationCap className="mr-2" />
          Course Modules
        </h2>
        {courseData.modules.map((module) => (
          <Card key={module.id} className="mb-4">
            <CardHeader>
              <Button
                onClick={() => toggleModule(module.id)}
                className="w-full justify-between hover:bg-transparent"
                variant="ghost"
              >
                <a
                  href={`/course/${courseData.course.id}/module/${module.id}`}
                  className="hover:bg-neutral-700/20 py-2.5 px-4 rounded-lg"
                >
                  <span className="text-xl font-semibold">{module.title}</span>
                </a>
                {expandedModules[module.id] ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CardHeader>
            <AnimatePresence>
              {expandedModules[module.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <span className="text-gray-600 dark:text-gray-300 mb-4">
                      {module.description}
                    </span>
                    <h3 className="font-semibold mt-4 mb-2">Lessons:</h3>
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-2 border-b last:border-b-0 dark:border-gray-700"
                      >
                        <h4 className="font-medium flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {lesson.title}
                        </h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {lesson.blurb}
                        </span>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg flex flex-col">
                      <h3 className="font-semibold mb-2">Module Assessment:</h3>
                      <span className="text-sm font-medium mb-1.5">
                        {module.assessment?.title}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {module.assessment?.description}
                      </span>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </motion.section>
    </div>
  )
}
