"""Sliding-window rate limiting with an in-process or Redis backend."""

from __future__ import annotations

import threading
import time
import uuid
from collections import defaultdict, deque
from typing import Protocol

import redis


class RateLimitStoreError(RuntimeError):
    """The shared rate-limit store (Redis) refused or failed a request."""


class RateLimiter(Protocol):
    limit: int

    def hit(self, key: str) -> tuple[bool, int]:
        """Record a request. Returns (allowed, seconds until a slot frees)."""

    def ping(self) -> bool:
        """True when the backing store is reachable."""


class MemoryRateLimiter:
    """Correct for a single process only."""

    def __init__(self, limit: int, window_seconds: float = 60.0) -> None:
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def hit(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        with self._lock:
            q = self._hits[key]
            while q and now - q[0] >= self.window:
                q.popleft()
            if len(q) >= self.limit:
                return False, max(1, int(self.window - (now - q[0])) + 1)
            q.append(now)
            return True, 0

    def ping(self) -> bool:
        return True


# Atomic sliding window: trim, count, conditionally add, set expiry.
_LUA = """
local key, member = KEYS[1], ARGV[4]
local now, window, limit = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local count = redis.call('ZCARD', key)
if count >= limit then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  return {0, math.ceil(oldest[2] + window - now)}
end
redis.call('ZADD', key, now, member)
redis.call('PEXPIRE', key, window)
return {1, 0}
"""


class RedisRateLimiter:
    """Shared across processes and instances."""

    def __init__(self, client: redis.Redis, limit: int, namespace: str, window_seconds: float = 60.0) -> None:
        self.client = client
        self.limit = limit
        self.namespace = namespace
        self.window_ms = int(window_seconds * 1000)
        self._script = client.register_script(_LUA)

    def hit(self, key: str) -> tuple[bool, int]:
        now_ms = int(time.time() * 1000)
        try:
            allowed, retry_ms = self._script(
                keys=[f"evalsuite:rl:{self.namespace}:{key}"],
                args=[now_ms, self.window_ms, self.limit, f"{now_ms}-{uuid.uuid4().hex}"],
            )
        except redis.exceptions.NoPermissionError as exc:
            raise RateLimitStoreError(
                "Redis refused to write (NOPERM). EVALSUITE_REDIS_URL must use a read-write user "
                "(for Upstash: 'default', not 'default_ro')."
            ) from exc
        except redis.RedisError as exc:
            raise RateLimitStoreError(f"Redis error: {type(exc).__name__}") from exc
        return bool(allowed), max(1, -(-int(retry_ms) // 1000)) if not allowed else 0

    def ping(self) -> bool:
        """Ready only if Redis accepts writes: a read-only user can PING but not rate-limit."""
        try:
            return bool(self.client.set("evalsuite:health", "1", px=5000))
        except redis.RedisError:
            return False


def make_limiters(
    redis_url: str | None, evaluate_limit: int, auth_limit: int
) -> tuple[RateLimiter, RateLimiter]:
    if redis_url:
        client = redis.Redis.from_url(redis_url, socket_timeout=2, socket_connect_timeout=2)
        return (
            RedisRateLimiter(client, evaluate_limit, "evaluate"),
            RedisRateLimiter(client, auth_limit, "auth"),
        )
    return MemoryRateLimiter(evaluate_limit), MemoryRateLimiter(auth_limit)
