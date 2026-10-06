# EvalSuite API

FastAPI service providing accounts, personal API keys and authenticated evaluation.

> Evaluation currently runs an **interim NumPy engine**, not the EvalSuite package, which has not been
> released. Every response says so in `engine.label`. The engine will be replaced by EvalSuite once v0.1.0 ships.

## Endpoints (`/api/v1`)

| Method    | Path                        | Auth           | Purpose                                              |
| --------- | --------------------------- | -------------- | ---------------------------------------------------- |
| GET       | `/health`, `/version`       | none           | Status                                               |
| GET       | `/metrics`, `/metrics/{id}` | none           | Metric registry (exported from the website)          |
| POST      | `/auth/register`            | none           | Create an account                                    |
| POST      | `/auth/login`               | none           | Get a JWT access token                               |
| GET       | `/auth/me`                  | JWT            | Current account                                      |
| GET, POST | `/keys`                     | JWT            | List keys or create the single active key (18+ only) |
| POST      | `/keys/{id}/rotate`         | JWT            | Revoke the active key and issue a replacement        |
| DELETE    | `/keys/{id}`                | JWT            | Revoke a key                                         |
| GET       | `/usage`                    | JWT            | Request counts                                       |
| POST      | `/evaluate`                 | API key or JWT | Run an evaluation                                    |

Interactive OpenAPI docs: `/api/docs`.

## Authentication model

- **Passwords** are hashed with Argon2id. Login errors are identical for unknown emails and wrong passwords,
  and login/registration attempts are rate-limited per IP.
- **Sessions** use short-lived HS256 JWTs (issuer, audience and expiry are verified). They are used by the
  website dashboard and cannot be created from an API key.
- **API keys** look like `es_live_<8-char prefix>_<secret>`. Only the prefix and an HMAC-SHA256 of the key
  (with a server-side pepper) are stored; the key is shown once at creation. Keys can be revoked instantly and
  cannot manage other keys. Send them as `X-API-Key: <key>` or `Authorization: Bearer <key>`.
- **Privacy**: request bodies are never stored or logged. Only counters (time, endpoint, number of
  observations) are kept for usage display.
- Request bodies over 1 MB are rejected; evaluation is rate-limited per account.

## Development

```bash
cd backend
python -m venv .venv && . .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env              # set the two secrets
alembic upgrade head
uvicorn app.main:app --reload     # http://localhost:8000/api/docs
pytest -q && ruff check . && ruff format --check . && mypy app
```

Run the tests against real services:

```bash
EVALSUITE_TEST_DATABASE_URL=postgresql://user:pass@localhost/evalsuite_test \
EVALSUITE_TEST_REDIS_URL=redis://localhost:6379/1 pytest -q
```

## Migrations

Edit `app/models.py`, then `alembic revision --autogenerate -m "..."`, review and commit the file.
`alembic check` (run in CI) fails if models and migrations differ. The Docker entrypoint runs
`alembic upgrade head` before starting the server.

## Production

- `EVALSUITE_ENV=production` refuses to start without distinct secrets, PostgreSQL, SMTP and an `https`
  `EVALSUITE_SITE_URL`.
- Set `EVALSUITE_REDIS_URL` so rate limits are shared across workers and instances.
- Run behind HTTPS; the image starts uvicorn with `--proxy-headers` so client IPs are correct.
