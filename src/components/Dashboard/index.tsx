import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Search, Zap } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { UserCourses } from '@/lib/helpers/getUserCourses'

export default function UserDashboard({ courses }: { courses: UserCourses }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses?.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <main className="container mx-auto px-4 py-8 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Your Generated Courses
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 w-full"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your courses..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredCourses?.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full"
            >
              <Card className="flex flex-col h-full w-full transition-all duration-200 hover:shadow-lg">
                <CardHeader className="flex-none">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-200">
                    {course.title}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {course.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {course.description.slice(0, 200)}...
                  </p>
                </CardContent>
                <CardFooter className="flex-none mt-auto">
                  <Button className="w-full group" asChild>
                    <a
                      href={`/course/${course.id}`}
                      className="w-full hover:no-underline flex items-center justify-center"
                    >
                      Continue Learning{' '}
                      <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8 w-full"
          >
            <p className="text-xl text-gray-600 dark:text-gray-300">
              No courses found. Try adjusting your search.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center w-full"
        >
          <Button size="lg" className="group">
            Generate New Course{' '}
            <Zap className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          </Button>
        </motion.div>
      </main>
    </>
  )
}
