import type { CourseDifficulty, CreateCourseInput } from '@/features/courses/model/course.types'

export type NewCourseSubmitMode = 'draft' | 'next' | 'review'

export type NewCourseField = 'title' | 'description' | 'category' | 'imageMediaId'

export type NewCourseValidationErrorCode =
  | 'TITLE_REQUIRED'
  | 'TITLE_TOO_SHORT'
  | 'DESCRIPTION_REQUIRED'
  | 'DESCRIPTION_TOO_SHORT'
  | 'DESCRIPTION_TOO_LONG'
  | 'CATEGORY_REQUIRED'
  | 'IMAGE_REQUIRED'
  | 'IMAGE_INVALID_FORMAT'

export interface NewCourseFormInput {
  title: string
  description: string
  difficulty: CourseDifficulty
  category: string
  imageMediaId: string
  tagIds: readonly string[]
}

export interface NormalizedNewCourseForm {
  title: string
  description: string
  difficulty: CourseDifficulty
  category: string
  imageMediaId: string
  tagIds: string[]
}

export interface NewCourseValidationError {
  field: NewCourseField
  code: NewCourseValidationErrorCode
}

export interface NewCourseValidationResult {
  isValid: boolean
  errors: NewCourseValidationError[]
}

export type NewCourseFormDraft = Omit<NewCourseFormInput, 'tagIds'> & {
  selectedTagIds: string[]
}

export type BuildCoursePayloadOptions = Partial<
  Pick<CreateCourseInput, 'estimatedTime' | 'passingThreshold' | 'rating'>
>
