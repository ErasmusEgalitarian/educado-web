# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open source project documentation: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, GitHub issue and pull request templates.
- Apache License 2.0 (`LICENSE`) and the `license` field in `package.json`.

## [1.0.1]

### Added

- Public institutional site: landing, about, solution, institutions and contact pages.
- Mobile student experience under `/student/*`: my courses, explore, profile, course detail, certificates, leaderboard, rating and registration.
- Course editor with sections and activities, including the image association activity, drag and drop reordering, and pause timestamps on video lessons.
- Media bank with image and video upload, parallel chunk upload and token-authenticated streaming.
- Administration area: users, institutions and registration review.
- Authentication flow: login, registration with email code for registered institution domains, profile editing and password reset.
- Internationalization in Brazilian Portuguese (`pt-BR`) and English (`en-US`), with a language switcher.
- Mobile responsive sidebar and responsive layout for the admin and dashboard areas.
- Production packaging: multi-stage `Dockerfile` (`node:20-alpine` build, `nginx:alpine` serve) with `VITE_API_URL` as a build argument, plus an `nginx.conf` with SPA fallback, gzip and long-lived caching for hashed assets.

### Changed

- Navigation moved to a client side SPA router built on the History API, replacing full page reloads.
- Media loading and lesson media library loading were optimized.

### Fixed

- Existing tags now load when editing a course.
- Language switcher moved into the mobile sidebar, with scroll snap disabled on mobile.
- Video playback issues in lessons.
