export interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  imageUrl: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  passingThreshold: number
  category: string
  rating?: number
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateCourseInput {
  id: string
  title: string
  description: string
  shortDescription: string
  imageUrl: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  passingThreshold: number
  category: string
  tags: string[]
}