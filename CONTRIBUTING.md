# Contributing

## Setup

```bash
python -m venv .venv && . .venv/bin/activate
make install
pre-commit install            # optional: lint and format on commit
```

## Workflow

1. Branch from `main`.
2. Make the change with tests. Website: `tests/` (Vitest) and `e2e/` (Playwright). API: `backend/tests`.
3. Run `make check` before opening a pull request. CI must be green to merge.
4. Update `CHANGELOG.md` under **Unreleased**.

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
- **Honesty rules**: never present planned package functionality as implemented, never add invented
  benchmark numbers, citations or links. Use the status vocabulary in `src/types/status.ts`.
- **Metrics**: edit `src/data/metrics/definitions.ts`, then run `npm run registry:export` so the API serves
  the same registry. CI fails if the exported file is stale.
- **Database changes**: edit `backend/app/models.py`, then `make migration m="describe the change"`, review
  the generated file, and commit it. CI fails if models and migrations drift.
- **API contract**: request and response shapes live in both `backend/app/schemas.py` and
  `src/lib/api/types.ts` / `account-client.ts`. Change both, and extend `scripts/integration.mts`.
- **Security**: no `eval`, no pickle, no logging of request bodies, passwords, tokens or keys.

## Release process

1. Move **Unreleased** entries in `CHANGELOG.md` under a new version heading.
2. Bump `version` in `package.json` and `backend/pyproject.toml`.
3. Tag `vX.Y.Z`; CI builds and verifies both images.
