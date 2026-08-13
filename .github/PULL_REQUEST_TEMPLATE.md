## Description

What does this pull request change, and why?

## Related issues

Closes #

## Type of change

- [ ] `feat`: new feature
- [ ] `fix`: bug fix
- [ ] `refactor`: code change that neither fixes a bug nor adds a feature
- [ ] `docs`: documentation only
- [ ] `chore` / `build`: tooling, dependencies, configuration
- [ ] `style`: formatting or visual styling only
- [ ] Breaking change

## How to test

Steps a reviewer can follow to verify the change:

1.
2.
3.

## Screenshots

For any UI change, include before and after. Include the mobile viewport if `/student/*` or the responsive layout is affected.

## Checklist

- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `npm run build` completes successfully.
- [ ] The branch targets `dev` and follows the `feat/`, `fix/`, `chore/`, `build/` or `docs/` naming.
- [ ] Commits follow Conventional Commits.
- [ ] Every new user-facing string goes through `t()` and exists in both `pt-BR` and `en-US` in `src/shared/i18n/index.ts`. No hardcoded UI text.
- [ ] Navigation uses `navigate` / `replace` from `src/app/router.ts` and the paths in `src/app/routes/index.ts`.
- [ ] HTTP calls go through the `api` wrapper in `src/shared/api/http.ts`.
- [ ] User-supplied text interpolated into HTML is escaped using the module's own local `escapeHtml` (there is no shared helper to import; media URLs are not escaped).
- [ ] No UI framework, state library or routing library was introduced.
- [ ] I tested with both the `USER` and `ADMIN` roles, if the change touches navigation or permissions.
- [ ] No secrets, tokens or `.env` files are included in this pull request.

## Notes for reviewers

Anything worth flagging: known limitations, follow-up work, decisions you would like a second opinion on.
