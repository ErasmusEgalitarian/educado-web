import type {
  Course,
  CourseDifficulty,
  CreateCourseInput,
  UpdateCourseInput,
} from '@/features/courses/model/course.types'
import type { MediaReferenceErrorCode } from '@/features/media/model/media-reference-error'

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

export type NewCourseSubmitFlow = 'create' | 'edit'

export type NewCourseSubmitOperation = 'create' | 'update'

export interface NewCourseSubmitApi {
  createCourse(payload: CreateCourseInput): Promise<Course>
  updateCourse(courseId: string, payload: UpdateCourseInput): Promise<Course>
  deactivateCourse(courseId: string): Promise<unknown>
}

export interface NewCourseSubmitStorage {
  saveCourse(course: Course): void
  clearLocalDrafts(): void
  clearEditCourse(): void
}

export interface SubmitNewCourseDependencies {
  api: NewCourseSubmitApi
  storage: NewCourseSubmitStorage
}

export type NewCourseEditTarget = Pick<Course, 'id' | 'estimatedTime' | 'passingThreshold' | 'rating'>

export interface SubmitNewCourseRequest {
  mode: NewCourseSubmitMode
  form: NormalizedNewCourseForm
  draftCourseId?: string | null
  editCourse?: NewCourseEditTarget | null
}

interface SubmitNewCourseOutcome {
  flow: NewCourseSubmitFlow
  operation: NewCourseSubmitOperation
}

export type SubmitNewCourseResult =
  | (SubmitNewCourseOutcome & { status: 'draftSaved'; course: Course })
  | (SubmitNewCourseOutcome & { status: 'navigateToSections'; course: Course })
  | (SubmitNewCourseOutcome & { status: 'navigateToReview'; course: Course })
  | (SubmitNewCourseOutcome & { status: 'mediaReferenceError'; code: MediaReferenceErrorCode; error: unknown })
  | (SubmitNewCourseOutcome & { status: 'submitError'; error: unknown })
