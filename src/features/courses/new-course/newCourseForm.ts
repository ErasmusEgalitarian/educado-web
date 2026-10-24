import type { CreateCourseInput } from '@/features/courses/model/course.types'
import { isValidMediaIdFormat } from '@/features/media/model/media-id'
import type {
  BuildCoursePayloadOptions,
  NewCourseFormInput,
  NewCourseValidationError,
  NewCourseValidationResult,
  NormalizedNewCourseForm,
} from './newCourse.types'

export const NEW_COURSE_TITLE_MIN_LENGTH = 3
export const NEW_COURSE_DESCRIPTION_MIN_LENGTH = 20
export const NEW_COURSE_DESCRIPTION_MAX_LENGTH = 400
export const NEW_COURSE_SHORT_DESCRIPTION_MAX_LENGTH = 120

export function normalizeNewCourseForm(input: NewCourseFormInput): NormalizedNewCourseForm {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    difficulty: input.difficulty,
    category: input.category.trim(),
    imageMediaId: input.imageMediaId.trim(),
    tagIds: [...input.tagIds],
  }
}

export function validateNewCourseForm(input: NormalizedNewCourseForm): NewCourseValidationResult {
  const errors: NewCourseValidationError[] = []

  if (!input.title) {
    errors.push({ field: 'title', code: 'TITLE_REQUIRED' })
  } else if (input.title.length < NEW_COURSE_TITLE_MIN_LENGTH) {
    errors.push({ field: 'title', code: 'TITLE_TOO_SHORT' })
  }

  if (!input.description) {
    errors.push({ field: 'description', code: 'DESCRIPTION_REQUIRED' })
  } else if (input.description.length < NEW_COURSE_DESCRIPTION_MIN_LENGTH) {
    errors.push({ field: 'description', code: 'DESCRIPTION_TOO_SHORT' })
  } else if (input.description.length > NEW_COURSE_DESCRIPTION_MAX_LENGTH) {
    errors.push({ field: 'description', code: 'DESCRIPTION_TOO_LONG' })
  }

  if (!input.category) {
    errors.push({ field: 'category', code: 'CATEGORY_REQUIRED' })
  }

  if (!input.imageMediaId) {
    errors.push({ field: 'imageMediaId', code: 'IMAGE_REQUIRED' })
  } else if (!isValidMediaIdFormat(input.imageMediaId)) {
    errors.push({ field: 'imageMediaId', code: 'IMAGE_INVALID_FORMAT' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function buildCreateCoursePayload(
  input: NormalizedNewCourseForm,
  options: BuildCoursePayloadOptions = {},
): CreateCourseInput {
  return {
    title: input.title,
    description: input.description,
    shortDescription: input.description.slice(0, NEW_COURSE_SHORT_DESCRIPTION_MAX_LENGTH),
    imageMediaId: input.imageMediaId,
    difficulty: input.difficulty,
    estimatedTime: options.estimatedTime || '8 horas',
    passingThreshold: options.passingThreshold ?? 70,
    category: input.category,
    tags: [],
    tagIds: [...input.tagIds],
    rating: options.rating ?? null,
  }
}
