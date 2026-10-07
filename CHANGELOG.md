# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow Semantic Versioning.
This file covers the web platform (website and API), not the EvalSuite Python package.

## [Unreleased]

### Added

- Website: home, documentation (MDX), registry-driven metric reference and explorer, playground with an
  in-browser demo engine, benchmarks methodology, research, roadmap, release notes, about.
- Accounts: registration, sign-in, dashboard with personal API keys, usage counters, password change,
  password reset by email and account deletion.
- API (FastAPI): authenticated `/evaluate` with an interim NumPy engine, metric registry, health and
  readiness endpoints, Redis-backed rate limiting, JSON access logs with request ids.
- Alembic migrations, Docker images for the website and API, Docker Compose stack, CI covering lint, types,
  unit, component, API (PostgreSQL, Redis, SQLite), migration drift, full-stack integration, image builds
  and dependency audits.

### Added (downloads)

- `/download` page and homepage Download button serving package files from the website itself, with SHA-256
  checksums, verification and install-from-file instructions; `npm run release:add` publishes a release.
- Mandatory email step before downloading, used for security notices about the downloaded version; signed,
  10-minute, single-file download links; `/unsubscribe` page. Migration `0003` adds download subscribers.
- `pip install evalsuite` command with a copy button on the homepage and download page.

### Added (site)

- Only personal email addresses (shared allowlist in `src/data/personal-email-domains.json`) are accepted
  for registration and downloads, enforced by the API and the forms.
- Anonymous unique-visitor counter on the homepage (`/api/v1/stats`); stores only a peppered hash of a
  random browser id. Migration `0004`.
- Footer shows live local date and time, the browser's connection-speed estimate, and an on-demand
  download speed test (`/speedtest.bin`, 512 KiB).
- Responsive improvements: hamburger navigation below 1280px, tighter section spacing on phones, no
  negative margins that could cause sideways scrolling, two-column footer on small screens.

### Fixed

- Playground: changing the interval method after an invalid bootstrap setting no longer blocks later runs;
  hidden settings are not validated, a message explains when a run did not start, and the resamples box can
  be cleared while typing.
- API requests that fail at the network level are retried once (free hosts wake up slowly) and the error
  names the API address and likely causes instead of a generic "unavailable".
- CI: pip caching points at `backend/pyproject.toml`; two end-to-end checks matched duplicate text.

### Fixed (API)

- Unexpected errors (for example an SMTP failure) no longer lose their CORS headers, which browsers reported
  as "could not reach the API".
- Emails are sent in the background and a delivery failure never fails the request; it is logged without
  the recipient address.

### Fixed (Docker)

- The website image failed to build because `next build` type-checked the test files, one of which reads
  `backend/` (excluded from the image). The build now type-checks application code only
  (`tsconfig.build.json`); tests remain covered by `npm run typecheck`.

### Fixed (CI)

- The Python 3.10 job failed `pip-audit` on the outdated pip and setuptools bundled with that Python image
  (not on EvalSuite's dependencies); CI now upgrades the build tools before installing.

### Fixed (Redis)

- A read-only Redis user (for example Upstash `default_ro`) made every rate-limited request fail with an
  "internal error". Readiness now tests a write, and Redis failures return a clear 503 with the cause logged.

### Changed (CORS)

- The API always allows its own `EVALSUITE_SITE_URL` as a CORS origin, and logs the origin of any rejected
  preflight, so a stale `EVALSUITE_CORS_ORIGINS` can no longer silently block the website.

### Added (email)

- `EVALSUITE_EMAIL_BACKEND=brevo` sends through Brevo's HTTPS API (for hosts that block SMTP); the Render
  Blueprint uses SMTP port 2525 by default.

### Added (CORS)

- Optional `EVALSUITE_CORS_ORIGIN_REGEX` to allow Vercel per-deployment preview addresses.

### Added (deployment)

- Free-hosting setup: `render.yaml` Blueprint for the API, `DEPLOY.md` guide (Vercel, Render, Neon, Upstash,
  Brevo), `npm run check:deploy` post-deployment smoke check, optional keep-warm workflow.
- The API container honours `PORT` and `WEB_CONCURRENCY`; `postgres://` database URLs are accepted.

### Changed (UI)

- Checkboxes use one modern style on every page: rounded, gradient fill with a white tick, hover, focus
  ring and press feedback; falls back to native controls in Windows high-contrast mode.

### Changed

- Registration now requires full name, date of birth, role, country, intended use and acceptance of the
  terms; organisation is optional.
- API access is limited to account holders aged 18 or over, checked at registration, key creation and on
  every API-key request. The date of birth is never returned by the API.
- One active API key per account, enforced by a partial unique index; keys can be rotated in one step.
  Migration `0002` keeps only the newest active key for existing accounts.

### Security

- Argon2id password hashing; sessions bound to the password version; HMAC-peppered API keys shown once;
  single-use, short-lived reset links carried in the URL fragment; enumeration-resistant responses; body
  size limits; strict CORS; no request bodies or credentials in logs.
