import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'

vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

/** Smoke test do helper: so prova que a tela de novo curso monta. */
describe('test-utils/homePage (smoke test)', () => {
  afterEach(resetHomePageTestState)

  it('monta a tela de novo curso e carrega as tags', async () => {
    const { container, mocks } = await mountNewCourseScreen()

    expect(container.querySelector('#new-course-title')).not.toBeNull()
    expect(mocks.tagsApi.getTags).toHaveBeenCalledTimes(1)
  })
})
