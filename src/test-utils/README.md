# test-utils

Helpers compartilhados de teste (fora do `include` `src/**/*.test.ts`).

## homePage.ts

Monta as telas do fluxo de criacao de curso de `HomePage.ts` (cujas funcoes nao sao exportadas) no jsdom.

- `mountNewCourseScreen(opts?)`, `mountSectionsScreen(opts?)`, `mountReviewScreen(opts?)`: gravam o `sessionStorage`, chamam `renderHomePage` e esperam a carga async. Devolvem `{ container, mocks }`.
- `opts`: `{ role?: 'USER' | 'ADMIN', tags?: Tag[], formDraft?, draft? }`.
- `resetHomePageTestState()`: `destroyHomePage`, limpa DOM, storages e mocks. Use em `afterEach`.
- `makeTag(overrides?)`, `flushPromises()`, `homePageMocks`.

`vi.mock` e hoisted e so funciona no arquivo de teste, entao cada teste declara:

```ts
vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

afterEach(resetHomePageTestState)

it('exemplo', async () => {
  const { container, mocks } = await mountNewCourseScreen({ tags: [makeTag()] })
  expect(container.querySelector('#new-course-title')).not.toBeNull()
  expect(mocks.tagsApi.getTags).toHaveBeenCalled()
})
```

Exemplo completo: `src/__tests__/homePage.helper.smoke.test.ts`. Rodar: `npx vitest run`.
