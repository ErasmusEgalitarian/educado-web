import type { Tag } from '@/features/courses/model/course.types'
import type { NewCourseFormDraft } from './newCourse.types'

export type FormDraftFields = Partial<
  Record<'title' | 'description' | 'difficulty' | 'category' | 'imageMediaId', string>
>

export function buildFormDraft(
  fields: FormDraftFields,
  selectedTags: readonly Pick<Tag, 'id'>[],
): NewCourseFormDraft {
  return {
    title: fields.title ?? '',
    description: fields.description ?? '',
    difficulty: (fields.difficulty || 'beginner') as NewCourseFormDraft['difficulty'],
    category: fields.category ?? '',
    imageMediaId: fields.imageMediaId ?? '',
    selectedTagIds: selectedTags.map((tag) => tag.id),
  }
}
