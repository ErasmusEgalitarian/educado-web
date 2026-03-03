export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  title: string
  shortDescription: string
  description: string
  imageUrl: string
  difficulty: CourseDifficulty
  estimatedTime: string
  passingThreshold: number
  category: string
  tags: string[]
  createdAt?: string
  rating?: number
}

export type CreateCourseInput = Omit<Course, 'createdAt' | 'rating'>