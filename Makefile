# Common tasks. Backend commands expect an activated virtualenv with `pip install -e "backend[dev]"`.
.PHONY: install dev test lint typecheck build check backend-test backend-lint migrate migration up down

install:
	npm ci
	cd backend && pip install -e ".[dev]"

dev:
	npm run dev

test:
	npm run test
	cd backend && pytest -q

lint:
	npm run lint && npm run format:check
	cd backend && ruff check . && ruff format --check .

typecheck:
	npm run typecheck
	cd backend && mypy app

build:
	npm run build
	cd backend && python -m build

# Everything CI runs, except end-to-end tests.
check: lint typecheck test build
	npm audit --omit=dev --audit-level=high
	cd backend && pip-audit --skip-editable

migrate:
	cd backend && alembic upgrade head

# Usage: make migration m="add column x"
migration:
	cd backend && alembic revision --autogenerate -m "$(m)"

up:
	docker compose up --build

down:
	docker compose down
