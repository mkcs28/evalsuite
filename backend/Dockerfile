# syntax=docker/dockerfile:1
FROM python:3.12-slim AS build
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /src
COPY pyproject.toml README.md ./
COPY app ./app
RUN pip wheel --wheel-dir /wheels .

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /srv
COPY --from=build /wheels /wheels
RUN pip install /wheels/*.whl && rm -rf /wheels && useradd --create-home --uid 10001 api
COPY alembic.ini ./
COPY migrations ./migrations
COPY docker-entrypoint.sh /usr/local/bin/
USER api
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD python -c "import os,urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:%s/api/v1/health/ready' % os.environ.get('PORT','8000'), timeout=2).status == 200 else 1)"
ENTRYPOINT ["docker-entrypoint.sh"]
# No CMD: the entrypoint starts uvicorn on $PORT (default 8000) with $WEB_CONCURRENCY workers (default 1).
