export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatusFilter = 'active' | 'inactive' | 'all'
export type ActivityType = 'video_pause' | 'true_false' | 'text_reading' | 'multiple_choice'

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  ownerId: string
  title: string
  shortDescription: string
  description: string
  imageUrl: string
  difficulty: CourseDifficulty
  estimatedTime: string
  passingThreshold: number
  category: string
  tags: string[]
  rating?: number | null
  isActive: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  reusableTags?: Tag[]
}

export interface CourseListQuery {
  status?: CourseStatusFilter
  category?: string
  difficulty?: CourseDifficulty
  q?: string
}

export interface Section {
  id: string
  courseId: string
  title: string
  videoUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  sectionId: string
  title: string | null
  type: ActivityType
  order: number
  pauseTimestamp: number | null
  textPages: string[] | null
  question: string | null
  imageUrl: string | null
  options: string[] | null
  correctAnswer: boolean | number | null
  icon: string | null
  createdAt: string
  updatedAt: string
}

export type CreateSectionInput = {
  id: string
  courseId: string
  title: string
  videoUrl?: string | null
  thumbnailUrl?: string | null
  duration?: number | null
  order: number
}

export type UpdateSectionInput = Partial<CreateSectionInput>

export type CreateActivityInput = {
  id: string
  sectionId: string
  type: ActivityType
  order: number
  title?: string
  pauseTimestamp?: number | null
  textPages?: string[]
  question?: string
  imageUrl?: string
  options?: string[]
  correctAnswer?: boolean | number | null
  icon?: string
}

export type UpdateActivityInput = Partial<CreateActivityInput>

export type CreateCourseInput = Pick<
  Course,
  | 'title'
  | 'description'
  | 'shortDescription'
  | 'imageUrl'
  | 'difficulty'
  | 'estimatedTime'
  | 'passingThreshold'
  | 'category'
  | 'tags'
> & {
  rating?: number | null
  tagIds?: string[]
}

export type UpdateCourseInput = CreateCourseInput

export interface CreateTagInput {
  name: string
  description?: string | null
  isActive?: boolean
}

export type UpdateTagInput = Partial<CreateTagInput>