# EvalSuite web platform

Website, documentation portal, metric reference, playground, accounts and HTTP API for **EvalSuite**, a
planned Python package for unified machine learning, clinical, statistical, segmentation and
object-detection evaluation.

> The EvalSuite package has **not been released**. The site marks package features as planned, and the API
> evaluates with an **interim NumPy engine** that labels itself in every response.

## Architecture

```
                 ┌──────────────────────────── website (Next.js 16, static + client) ───────────────────────────┐
 browser ──────▶ │ docs (MDX) · metric registry · playground · sign-in · dashboard                               │
                 │        └─ EvaluationClient ─┬─ MockEvaluationClient (in-browser demo)                         │
                 │                             └─ ApiEvaluationClient ─┐       AccountClient ─┐                 │
                 └─────────────────────────────────────────────────────┼──────────────────────┼─────────────────┘
                                                                       ▼                      ▼
                 ┌──────────────────────────── API (FastAPI, backend/) ─────────────────────────────────────────┐
                 │ /evaluate (API key or session) · /auth/* · /keys · /usage · /metrics · /health[/ready]          │
                 │ Argon2id passwords · HS256 sessions bound to password version · HMAC-peppered API keys          │
                 │ Redis sliding-window rate limits · JSON access logs (no bodies) · interim NumPy engine          │
                 └───────────────┬───────────────────────────────┬──────────────────────────────┬──────────────┘
                                 ▼                               ▼                              ▼
                         PostgreSQL (Alembic)                  Redis                    SMTP (reset emails)
```

## Repository layout

| Path                                                       | Contents                                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/app`                                                  | Routes (statically generated); docs pages are MDX                                             |
| `src/components`                                           | Layout, home, docs, metrics, playground, auth, roadmap, UI primitives                         |
| `src/lib/api`                                              | `EvaluationClient` interface, mock and API clients, `AccountClient`, typed `/api/v1` contract |
| `src/lib/metrics`, `src/data`                              | Zod-validated metric registry and references, roadmap, release notes                          |
| `backend/app`                                              | FastAPI application, models, routers, security, rate limiting, email, interim engine          |
| `backend/migrations`                                       | Alembic migrations                                                                            |
| `tests`, `backend/tests`, `e2e`, `scripts/integration.mts` | Unit/component, API, browser and full-stack tests                                             |

## Quick start

### Everything in Docker

```bash
cp backend/.env.example backend/.env    # set EVALSUITE_JWT_SECRET and EVALSUITE_API_KEY_PEPPER
docker compose up --build
```

Website http://localhost:3000, API docs http://localhost:8000/api/docs, captured emails http://localhost:8025.

### Local development

```bash
make install                              # npm ci + pip install -e "backend[dev]" (inside a virtualenv)
cp backend/.env.example backend/.env      # set the secrets; PostgreSQL and Redis as in the file
make migrate                              # alembic upgrade head
(cd backend && uvicorn app.main:app --reload)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 npm run dev
```

The website also runs without the API: sign-in pages then explain that accounts are unavailable, and the
playground uses its in-browser demo engine.

## Quality gates

| Command                    | What it checks                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `make lint`                | ESLint (zero warnings), Prettier, Ruff lint and format                              |
| `make typecheck`           | `tsc --noEmit` (strict) and `mypy --strict`                                         |
| `make test`                | Vitest unit/component tests and pytest                                              |
| `make build`               | Next.js production build (standalone) and the API wheel/sdist                       |
| `make check`               | All of the above plus `npm audit` and `pip-audit`                                   |
| `npm run test:integration` | Full stack: the website's own clients against a running API (see the script header) |
| `npm run test:e2e`         | Playwright browser tests (needs `npx playwright install chromium`)                  |

API tests run on SQLite with the in-process limiter by default. Set `EVALSUITE_TEST_DATABASE_URL`
(PostgreSQL) and `EVALSUITE_TEST_REDIS_URL` to run the same suite on real services, as CI does.

CI (`.github/workflows/ci.yml`) runs the website checks, the API suite on Python 3.10 and 3.12 against
PostgreSQL 16 and Redis 7 and again on SQLite, a migration-drift check, the full-stack integration suite,
Docker image builds, dependency audits and Playwright.

## Configuration

Website (`.env.example`; all values are public and must never hold secrets):

| Variable                                             | Effect                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                               | Canonical URLs, sitemap, Open Graph                                  |
| `NEXT_PUBLIC_API_BASE_URL`                           | Enables accounts, the dashboard and the API engine in the playground |
| `NEXT_PUBLIC_REPOSITORY_URL`, `NEXT_PUBLIC_PYPI_URL` | Enable those links; until set they show as pending                   |

API: see `backend/.env.example` and `backend/README.md`.

## Publishing a package release on the website

The website hosts the EvalSuite package files itself, listed on `/download` with SHA-256 checksums. Downloads
require a **mandatory email step** used for security notices: the API stores the email against the version
and returns a 10-minute signed link, and the website's `/api/download/<version>/<file>` route serves the file
only for a valid link. Files live in the private `releases/` folder, never in `public/`. Set the same secret on
both sides: `EVALSUITE_DOWNLOAD_TOKEN_SECRET` (API) and `DOWNLOAD_TOKEN_SECRET` (website, server-only).
After building the package:

```bash
npm run release:add -- --version 0.1.0 ../evalsuite-python/dist/evalsuite_python-0.1.0-py3-none-any.whl ../evalsuite-python/dist/evalsuite_python-0.1.0.tar.gz
git add releases/0.1.0 src/data/downloads.json && git commit -m "release: evalsuite 0.1.0"
```

The script checks file names against the version, records size and SHA-256 in `src/data/downloads.json`
(validated at build time), and refuses to overwrite an existing release. Until a release exists, the same
email step signs visitors up to be told when v0.1.0 is released. If release files grow large,
track `releases/**` with Git LFS.

## Deployment

**Free hosting:** see [`DEPLOY.md`](DEPLOY.md) for a step-by-step setup on Vercel, Render, Neon, Upstash and
Brevo free plans, and `npm run check:deploy` to verify it.

1. **Database and Redis**: provision PostgreSQL 14+ and Redis 6+.
2. **API**: build `backend/Dockerfile`. The entrypoint runs `alembic upgrade head` before starting.
   Set `EVALSUITE_ENV=production`; the service refuses to start without distinct secrets, PostgreSQL,
   SMTP and an `https` site URL. Serve it behind HTTPS.
3. **Website**: build the root `Dockerfile` with `--build-arg NEXT_PUBLIC_API_BASE_URL=https://api.your-domain`
   (values are compiled into the bundle), or deploy to Vercel or Netlify with the same environment variables.
4. Set `EVALSUITE_CORS_ORIGINS` and `EVALSUITE_SITE_URL` on the API to the website's origin.

Health endpoints: `/api/v1/health` (liveness) and `/api/v1/health/ready` (database and Redis).

## Fonts and licence

Satoshi (Fontshare, free licence) loads from Fontshare's CDN; see `public/fonts/README.md` to self-host.
JetBrains Mono is self-hosted via `@fontsource/jetbrains-mono`. Code is MIT licensed (`LICENSE`).
