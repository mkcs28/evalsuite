#!/bin/sh
# Apply database migrations, then start the server.
# PORT and WEB_CONCURRENCY are set by most hosts (Render, Koyeb, Railway); defaults suit local Docker.
set -eu
alembic upgrade head
if [ "$#" -gt 0 ]; then
  exec "$@"
fi
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port "${PORT:-8000}" \
  --workers "${WEB_CONCURRENCY:-1}" \
  --proxy-headers --forwarded-allow-ips "*" \
  --no-access-log
