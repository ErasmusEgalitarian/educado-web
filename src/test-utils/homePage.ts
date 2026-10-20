/**
 * Helper para montar as telas do fluxo de criacao de curso (HomePage.ts) nos testes.
 *
 * O arquivo de teste PRECISA declarar os vi.mock abaixo (vi.mock e hoisted e so
 * funciona dentro do proprio arquivo de teste). Sem factory, o Vitest faz
 * automock: todas as funcoes viram vi.fn() que devolve undefined.
 *
 *   vi.mock('@/shared/api/auth-session')
 *   vi.mock('@/features/courses/api/courses.api')
 *   vi.mock('@/features/courses/api/sections.api')
 *   vi.mock('@/features/courses/api/activities.api')
 *   vi.mock('@/features/courses/api/tags.api')
 *   vi.mock('@/features/media/api/media.api')
 *   vi.mock('@/features/media/services/upload-manager')
 *   vi.mock('@/shared/ui/toast')
 *
 * Os mocks usados pelo helper (e que o teste pode reconfigurar) sao devolvidos
 * em `mocks`. Chame resetHomePageTestState() em beforeEach/afterEach.
 */
import { vi } from 'vitest'
import { renderHomePage, destroyHomePage } from '@/app/pages/HomePage'
import { tagsApi } from '@/features/courses/api/tags.api'
import { coursesApi } from '@/features/courses/api/courses.api'
import { sectionsApi } from '@/features/courses/api/sections.api'
import { activitiesApi } from '@/features/courses/api/activities.api'
import { mediaApi } from '@/features/media/api/media.api'
import { uploadManager } from '@/features/media/services/upload-manager'
import { toast } from '@/shared/ui/toast'
import type { Course, Tag } from '@/features/courses/model/course.types'

export type HomePageRole = 'USER' | 'ADMIN'

const VIEW_KEY = 'educado.courses.homeView'
const DRAFT_KEY = 'educado.courses.draft'
const FORM_DRAFT_KEY = 'educado.courses.formDraft'

export const homePageMocks = {
  tagsApi: vi.mocked(tagsApi),
  coursesApi: vi.mocked(coursesApi),
  sectionsApi: vi.mocked(sectionsApi),
  activitiesApi: vi.mocked(activitiesApi),
  mediaApi: vi.mocked(mediaApi),
  uploadManager: vi.mocked(uploadManager),
  toast: vi.mocked(toast),
}

export type HomePageMocks = typeof homePageMocks

export function makeTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: 'tag-1',
    name: 'Matematica',
    slug: 'matematica',
    description: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

/** Espera as promises pendentes (ex.: a IIFE async de carga de tags) resolverem. */
export async function flushPromises() {
  for (let i = 0; i < 5; i += 1) {
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }
}

export type MountOptions = {
  role?: HomePageRole
  /** Tags devolvidas por tagsApi.getTags (default: []). */
  tags?: Tag[]
  /** Objeto gravado em 'educado.courses.formDraft' antes de montar. */
  formDraft?: Record<string, unknown>
  /** Objeto gravado em 'educado.courses.draft' (usado por 'sections' e 'review'). */
  draft?: Partial<Course>
}

export type MountedScreen = {
  container: HTMLElement
  mocks: HomePageMocks
}

async function mountView(view: 'create' | 'sections' | 'review', opts: MountOptions): Promise<MountedScreen> {
  homePageMocks.tagsApi.getTags.mockResolvedValue(opts.tags ?? [])

  sessionStorage.setItem(VIEW_KEY, view)
  if (opts.formDraft) sessionStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(opts.formDraft))
  if (opts.draft) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(opts.draft))

  const container = document.createElement('div')
  document.body.appendChild(container)
  renderHomePage(container, opts.role ?? 'USER')
  await flushPromises()

  return { container, mocks: homePageMocks }
}

/** Tela "Novo curso" (view 'create'). */
export function mountNewCourseScreen(opts: MountOptions = {}) {
  return mountView('create', opts)
}

/** Tela de secoes (view 'sections'); passe `draft` com o curso em rascunho. */
export function mountSectionsScreen(opts: MountOptions = {}) {
  return mountView('sections', opts)
}

/** Tela de revisao (view 'review'); passe `draft` com o curso em rascunho. */
export function mountReviewScreen(opts: MountOptions = {}) {
  return mountView('review', opts)
}

export function resetHomePageTestState() {
  destroyHomePage()
  document.body.innerHTML = ''
  sessionStorage.clear()
  localStorage.clear()
  vi.clearAllMocks()
}
