import { classifyMediaReferenceError } from '@/features/media/model/media-reference-error'
import { buildCreateCoursePayload } from './newCourseForm'
import type {
  BuildCoursePayloadOptions,
  NewCourseEditTarget,
  NewCourseSubmitFlow,
  NewCourseSubmitOperation,
  SubmitNewCourseDependencies,
  SubmitNewCourseRequest,
  SubmitNewCourseResult,
} from './newCourse.types'

function getEditPayloadOptions(editCourse: NewCourseEditTarget): BuildCoursePayloadOptions {
  return {
    estimatedTime: editCourse.estimatedTime,
    passingThreshold: editCourse.passingThreshold,
    rating: editCourse.rating,
  }
}

export async function submitNewCourse(
  request: SubmitNewCourseRequest,
  { api, storage }: SubmitNewCourseDependencies,
): Promise<SubmitNewCourseResult> {
  const { mode, form, editCourse } = request
  const flow: NewCourseSubmitFlow = editCourse ? 'edit' : 'create'
  const targetCourseId = editCourse ? editCourse.id : request.draftCourseId || null
  const operation: NewCourseSubmitOperation = targetCourseId ? 'update' : 'create'

  try {
    const payload = buildCreateCoursePayload(form, editCourse ? getEditPayloadOptions(editCourse) : undefined)
    const course = targetCourseId
      ? await api.updateCourse(targetCourseId, payload)
      : await api.createCourse(payload)

    storage.saveCourse(course)

    if (mode === 'draft') {
      await api.deactivateCourse(course.id)
      storage.clearLocalDrafts()
      if (flow === 'edit') storage.clearEditCourse()
      return { status: 'draftSaved', flow, operation, course }
    }

    if (mode === 'next') {
      return { status: 'navigateToSections', flow, operation, course }
    }

    return { status: 'navigateToReview', flow, operation, course }
  } catch (error) {
    const code = classifyMediaReferenceError(error)
    if (code) {
      return { status: 'mediaReferenceError', flow, operation, code, error }
    }

    return { status: 'submitError', flow, operation, error }
  }
}
