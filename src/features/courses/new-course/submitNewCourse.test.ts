import { describe, expect, it, vi } from 'vitest'
import type { Course, CreateCourseInput } from '@/features/courses/model/course.types'
import { ApiError } from '@/shared/api/http'
import { submitNewCourse } from './submitNewCourse'
import type {
  NewCourseEditTarget,
  NormalizedNewCourseForm,
  SubmitNewCourseDependencies,
  SubmitNewCourseRequest,
} from './newCourse.types'

const validForm = (overrides: Partial<NormalizedNewCourseForm> = {}): NormalizedNewCourseForm => ({
  title: 'Curso de testes',
  description: 'Descrição válida para o curso.',
  difficulty: 'beginner',
  category: 'Tecnologia',
  imageMediaId: '507f1f77bcf86cd799439011',
  tagIds: ['tag-1'],
  ...overrides,
})

const makeCourse = (overrides: Partial<Course> = {}): Course => ({
  id: 'course-1',
  title: 'Curso de testes',
  description: 'Descrição válida para o curso.',
  shortDescription: 'Descrição válida para o curso.',
  imageMediaId: '507f1f77bcf86cd799439011',
  difficulty: 'beginner',
  estimatedTime: '8 horas',
  passingThreshold: 70,
  category: 'Tecnologia',
  tags: [],
  tagIds: ['tag-1'],
  ...overrides,
} as Course)

const expectedDefaultPayload: CreateCourseInput = {
  title: 'Curso de testes',
  description: 'Descrição válida para o curso.',
  shortDescription: 'Descrição válida para o curso.',
  imageMediaId: '507f1f77bcf86cd799439011',
  difficulty: 'beginner',
  estimatedTime: '8 horas',
  passingThreshold: 70,
  category: 'Tecnologia',
  tags: [],
  tagIds: ['tag-1'],
  rating: null,
}

const editTarget = (overrides: Partial<NewCourseEditTarget> = {}): NewCourseEditTarget => ({
  id: 'existing-course',
  estimatedTime: '12 horas',
  passingThreshold: 85,
  rating: 4.5,
  ...overrides,
})

function createDependencies(returnedCourse: Course = makeCourse()) {
  const calls: string[] = []
  const dependencies = {
    api: {
      createCourse: vi.fn(async (_payload: CreateCourseInput) => {
        calls.push('api.createCourse')
        return returnedCourse
      }),
      updateCourse: vi.fn(async (_courseId: string, _payload: CreateCourseInput) => {
        calls.push('api.updateCourse')
        return returnedCourse
      }),
      deactivateCourse: vi.fn(async (_courseId: string) => {
        calls.push('api.deactivateCourse')
        return returnedCourse
      }),
    },
    storage: {
      saveCourse: vi.fn((_course: Course) => {
        calls.push('storage.saveCourse')
      }),
      clearLocalDrafts: vi.fn(() => {
        calls.push('storage.clearLocalDrafts')
      }),
      clearEditCourse: vi.fn(() => {
        calls.push('storage.clearEditCourse')
      }),
    },
  } satisfies SubmitNewCourseDependencies

  return { calls, dependencies, api: dependencies.api, storage: dependencies.storage }
}

const request = (overrides: Partial<SubmitNewCourseRequest> = {}): SubmitNewCourseRequest => ({
  mode: 'next',
  form: validForm(),
  ...overrides,
})

describe('submitNewCourse — criação sem rascunho', () => {
  it('cria o curso e direciona para as seções no modo next', async () => {
    const course = makeCourse()
    const { api, storage, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'next' }), dependencies)

    expect(result).toEqual({ status: 'navigateToSections', flow: 'create', operation: 'create', course })
    expect(api.createCourse).toHaveBeenCalledWith(expectedDefaultPayload)
    expect(api.updateCourse).not.toHaveBeenCalled()
    expect(api.deactivateCourse).not.toHaveBeenCalled()
    expect(storage.saveCourse).toHaveBeenCalledWith(course)
    expect(storage.clearLocalDrafts).not.toHaveBeenCalled()
  })

  it('cria o curso e direciona para a revisão no modo review', async () => {
    const course = makeCourse()
    const { api, storage, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'review' }), dependencies)

    expect(result).toEqual({ status: 'navigateToReview', flow: 'create', operation: 'create', course })
    expect(api.createCourse).toHaveBeenCalledTimes(1)
    expect(api.deactivateCourse).not.toHaveBeenCalled()
    expect(storage.saveCourse).toHaveBeenCalledWith(course)
  })

  it('salva como rascunho desativando o curso e limpando os dados locais, nessa ordem', async () => {
    const course = makeCourse({ id: 'created-course' })
    const { api, storage, calls, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'draft' }), dependencies)

    expect(result).toEqual({ status: 'draftSaved', flow: 'create', operation: 'create', course })
    expect(api.deactivateCourse).toHaveBeenCalledWith('created-course')
    expect(storage.clearEditCourse).not.toHaveBeenCalled()
    expect(calls).toEqual([
      'api.createCourse',
      'storage.saveCourse',
      'api.deactivateCourse',
      'storage.clearLocalDrafts',
    ])
  })
})

describe('submitNewCourse — rascunho existente', () => {
  it('atualiza o rascunho com o payload padrão em vez de criar outro curso', async () => {
    const course = makeCourse({ id: 'draft-1' })
    const { api, storage, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'next', draftCourseId: 'draft-1' }), dependencies)

    expect(result).toEqual({ status: 'navigateToSections', flow: 'create', operation: 'update', course })
    expect(api.updateCourse).toHaveBeenCalledWith('draft-1', expectedDefaultPayload)
    expect(api.createCourse).not.toHaveBeenCalled()
    expect(storage.saveCourse).toHaveBeenCalledWith(course)
  })

  it('salva novamente como rascunho atualizando e desativando o mesmo curso', async () => {
    const course = makeCourse({ id: 'draft-1' })
    const { api, calls, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'draft', draftCourseId: 'draft-1' }), dependencies)

    expect(result).toMatchObject({ status: 'draftSaved', flow: 'create', operation: 'update' })
    expect(api.deactivateCourse).toHaveBeenCalledWith('draft-1')
    expect(calls).toEqual([
      'api.updateCourse',
      'storage.saveCourse',
      'api.deactivateCourse',
      'storage.clearLocalDrafts',
    ])
  })
})

describe('submitNewCourse — edição de curso existente', () => {
  it('preserva tempo estimado, nota de corte e avaliação do curso editado', async () => {
    const course = makeCourse({ id: 'existing-course' })
    const { api, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'review', editCourse: editTarget() }), dependencies)

    expect(result).toEqual({ status: 'navigateToReview', flow: 'edit', operation: 'update', course })
    expect(api.updateCourse).toHaveBeenCalledWith('existing-course', {
      ...expectedDefaultPayload,
      estimatedTime: '12 horas',
      passingThreshold: 85,
      rating: 4.5,
    })
    expect(api.createCourse).not.toHaveBeenCalled()
  })

  it('direciona para as seções no modo next', async () => {
    const { dependencies } = createDependencies()

    const result = await submitNewCourse(request({ mode: 'next', editCourse: editTarget() }), dependencies)

    expect(result).toMatchObject({ status: 'navigateToSections', flow: 'edit', operation: 'update' })
  })

  it('salva como rascunho desativando o curso e encerrando o modo de edição', async () => {
    const course = makeCourse({ id: 'existing-course' })
    const { api, calls, dependencies } = createDependencies(course)

    const result = await submitNewCourse(request({ mode: 'draft', editCourse: editTarget() }), dependencies)

    expect(result).toEqual({ status: 'draftSaved', flow: 'edit', operation: 'update', course })
    expect(api.deactivateCourse).toHaveBeenCalledWith('existing-course')
    expect(calls).toEqual([
      'api.updateCourse',
      'storage.saveCourse',
      'api.deactivateCourse',
      'storage.clearLocalDrafts',
      'storage.clearEditCourse',
    ])
  })

  it('prioriza o curso editado quando também existe um rascunho armazenado', async () => {
    const { api, dependencies } = createDependencies()

    await submitNewCourse(
      request({ mode: 'next', draftCourseId: 'draft-1', editCourse: editTarget({ id: 'existing-course' }) }),
      dependencies,
    )

    expect(api.updateCourse).toHaveBeenCalledWith('existing-course', expect.any(Object))
  })
})

describe('submitNewCourse — falhas', () => {
  it('classifica erro de referência de mídia sem persistir nem navegar', async () => {
    const { api, storage, dependencies } = createDependencies()
    const error = new ApiError(422, { code: 'MEDIA_NOT_FOUND' })
    api.createCourse.mockRejectedValueOnce(error)

    const result = await submitNewCourse(request({ mode: 'next' }), dependencies)

    expect(result).toEqual({
      status: 'mediaReferenceError',
      flow: 'create',
      operation: 'create',
      code: 'MEDIA_NOT_FOUND',
      error,
    })
    expect(storage.saveCourse).not.toHaveBeenCalled()
  })

  it('classifica erro de mídia também durante a edição', async () => {
    const { api, dependencies } = createDependencies()
    const error = new ApiError(403, { code: 'FORBIDDEN' })
    api.updateCourse.mockRejectedValueOnce(error)

    const result = await submitNewCourse(request({ mode: 'review', editCourse: editTarget() }), dependencies)

    expect(result).toMatchObject({ status: 'mediaReferenceError', flow: 'edit', operation: 'update', code: 'FORBIDDEN' })
  })

  it('devolve erro geral de criação quando a API falha sem código de mídia', async () => {
    const { api, storage, dependencies } = createDependencies()
    const error = new ApiError(500, { code: 'INTERNAL_ERROR' })
    api.createCourse.mockRejectedValueOnce(error)

    const result = await submitNewCourse(request({ mode: 'review' }), dependencies)

    expect(result).toEqual({ status: 'submitError', flow: 'create', operation: 'create', error })
    expect(storage.saveCourse).not.toHaveBeenCalled()
  })

  it('devolve erro geral de atualização quando a edição falha', async () => {
    const { api, dependencies } = createDependencies()
    const error = new Error('network down')
    api.updateCourse.mockRejectedValueOnce(error)

    const result = await submitNewCourse(request({ mode: 'next', editCourse: editTarget() }), dependencies)

    expect(result).toEqual({ status: 'submitError', flow: 'edit', operation: 'update', error })
  })

  it('mantém o curso persistido, mas não limpa os dados locais, quando a desativação falha', async () => {
    const course = makeCourse()
    const { api, storage, dependencies } = createDependencies(course)
    const error = new ApiError(500)
    api.deactivateCourse.mockRejectedValueOnce(error)

    const result = await submitNewCourse(request({ mode: 'draft', editCourse: editTarget() }), dependencies)

    expect(result).toEqual({ status: 'submitError', flow: 'edit', operation: 'update', error })
    expect(storage.saveCourse).toHaveBeenCalledWith(course)
    expect(storage.clearLocalDrafts).not.toHaveBeenCalled()
    expect(storage.clearEditCourse).not.toHaveBeenCalled()
  })
})

describe('submitNewCourse — branches da implementação', () => {
  it('trata identificador de rascunho vazio como ausência de rascunho', async () => {
    const { api, dependencies } = createDependencies()

    const result = await submitNewCourse(request({ draftCourseId: '' }), dependencies)

    expect(result).toMatchObject({ operation: 'create' })
    expect(api.createCourse).toHaveBeenCalledTimes(1)
    expect(api.updateCourse).not.toHaveBeenCalled()
  })

  it('aplica os valores padrão quando o curso editado não possui tempo estimado nem avaliação', async () => {
    const { api, dependencies } = createDependencies()

    await submitNewCourse(
      request({ editCourse: editTarget({ estimatedTime: '', rating: undefined }) }),
      dependencies,
    )

    expect(api.updateCourse).toHaveBeenCalledWith('existing-course', {
      ...expectedDefaultPayload,
      passingThreshold: 85,
    })
  })

  it('preserva nota de corte zero do curso editado', async () => {
    const { api, dependencies } = createDependencies()

    await submitNewCourse(request({ editCourse: editTarget({ passingThreshold: 0 }) }), dependencies)

    expect(api.updateCourse).toHaveBeenCalledWith(
      'existing-course',
      expect.objectContaining({ passingThreshold: 0 }),
    )
  })
})
