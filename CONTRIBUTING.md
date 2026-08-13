# Contributing to Educado Web

Thanks for your interest in contributing. Educado is an educational platform for waste pickers in Brazil, built as a partnership between the University of Brasilia (UnB) and Aalborg University (Denmark). This repository holds the web frontend.

By contributing, you agree that your contributions are licensed under the Apache License 2.0 (see [LICENSE](LICENSE)), and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting set up

Requirements: Node.js 20 or newer, npm, and access to a running instance of `educado-api`.

```bash
git clone https://github.com/ErasmusEgalitarian/educado-web.git
cd educado-web
npm ci
```

Create a `.env` file at the repository root:

```bash
VITE_API_URL=http://localhost:5001
```

Then start the dev server:

```bash
npm run dev
```

Vite serves the app on http://localhost:3000. The dev server also proxies `/api` to `http://localhost:5001`, stripping the `/api` prefix (see `vite.config.ts`). Note that application code resolves the API base from `VITE_API_URL` directly, so most requests bypass that proxy. Make sure the backend allows CORS from `http://localhost:3000` during development.

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Runs `tsc` (type-check) then `vite build`, output in `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npx tsc --noEmit` | Type-check only, no output |

There is no test suite and no linter in this repository. The quality gate is the TypeScript compiler.

## The check before you open a PR

```bash
npx tsc --noEmit
```

This must exit with zero errors. `tsconfig.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters` and `noFallthroughCasesInSwitch`, so an unused variable or parameter is enough to break the build. `npm run build` runs the same compiler pass, so a clean build implies a clean check.

## Branching and pull requests

- Default branch: `main`. It holds released code.
- Integration branch: `dev`. Day to day work lands here first.
- Create your branch off `dev`, using the prefixes already in use in this repository: `feat/`, `fix/`, `chore/`, `build/`, `docs/`. Examples: `feat/course-tags`, `fix/mobile-sidebar-corrections`.
- Open the pull request against `dev`. Promotion from `dev` to `main` happens as a separate release pull request.
- Keep pull requests focused. One concern per PR makes review far cheaper.
- Fill in the pull request template, describe how you tested the change, and attach screenshots or a short recording for anything that touches the UI.
- Rebase or merge `dev` into your branch to resolve conflicts before requesting review.

## Commit messages: Conventional Commits

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<optional scope>): <short imperative description>
```

Types in use here: `feat`, `fix`, `chore`, `build`, `docs`, `refactor`, `style`, `perf`, `test`.

Examples taken from the project history:

```
feat(courses): add image association activity to the editor
fix: load existing tags when editing a course
build(deps): bump axios from 1.13.6 to 1.16.0
chore: stop versioning local development notes
```

Guidelines: keep the subject line under roughly 72 characters, write it in the imperative mood, and put the reasoning in the body when the change is not obvious. A breaking change is marked with `!` after the type or scope, plus a `BREAKING CHANGE:` footer.

## Internationalization (i18n)

The project ships in two languages, Brazilian Portuguese (`pt-BR`) and English (`en-US`). Both translation trees live in full in `src/shared/i18n/index.ts`.

Rules:

1. **Never hardcode user-facing strings.** Every visible label, button, placeholder, `aria-label`, toast, error message and empty state goes through `t('some.nested.key')`.
2. **Add every new key to both trees.** A key present in only one language is a bug. The trees are mirrored by structure, so place the new key at the same path in `pt-BR` and `en-US`.
3. **Use nested keys grouped by screen or component**, following the existing shape (for example `landing.hero.title`, `publicNav.login`).
4. The active language resolves from `localStorage` first, falling back to `navigator.language`. `setLanguage` notifies subscribers and triggers a full re-render, so components that need to react should use `subscribeLanguage`.

## Code conventions

- **No UI framework.** Keep it vanilla TypeScript. Do not introduce React, Vue, Svelte, Tailwind, a routing library or a state library.
- **Rendering.** Pages export `render*(container: HTMLElement, ...)` functions (or a class with `init()` and `destroy()`) that write `innerHTML` and bind listeners afterwards. State changes trigger a full re-render. If a page allocates listeners or timers, expose a teardown.
- **Routing.** Use `navigate` and `replace` from `src/app/router.ts` together with the paths defined in `src/app/routes/index.ts`. Avoid `window.location.assign` in new code.
- **HTTP.** Use the `api` wrapper in `src/shared/api/http.ts`. Do not call `fetch` or axios directly from feature code.
- **Escaping.** Run user-supplied text through `escapeHtml` before interpolating it into a template string. Do not escape media URLs, since that breaks the `?token=` query.
- **Imports.** The `@/` alias points to `src/`. It is configured in both `vite.config.ts` and `tsconfig.json`.
- **Styles.** Plain CSS, one file per feature under `src/features/<name>/styles/`, globals in `src/app/styles/globals.css`. Check the existing feature stylesheets before inventing a color or a radius.

## Reporting bugs and proposing features

Open an issue using the templates in `.github/ISSUE_TEMPLATE/`. For a bug, include reproduction steps, the browser, and console output. For a feature, describe the problem before the solution.

Security vulnerabilities do not belong in public issues. Follow [SECURITY.md](SECURITY.md) instead.
