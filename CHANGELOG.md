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
