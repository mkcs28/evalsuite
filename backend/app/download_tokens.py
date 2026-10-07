"""Short-lived signed download links.

Format: ``<base64url(JSON payload)>.<hex HMAC-SHA256 of the encoded payload>``.
Payload: ``{"v": version, "f": filename, "exp": unix seconds}``. The website verifies
the same format (src/lib/downloads/token.ts) with the shared secret.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import time

VERSION = re.compile(r"^\d+\.\d+\.\d+(?:(?:a|b|rc)\d+)?$")


# Built files of the "evalsuite-python" distribution use the normalised prefix "evalsuite_python".
FILE_PREFIX = "evalsuite_python"


def filename_matches(version: str, filename: str) -> bool:
    return filename in (f"{FILE_PREFIX}-{version}-py3-none-any.whl", f"{FILE_PREFIX}-{version}.tar.gz")


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def sign(version: str, filename: str, secret: str, ttl_seconds: int, now: float | None = None) -> str:
    payload = {"v": version, "f": filename, "exp": int((now or time.time()) + ttl_seconds)}
    encoded = _b64(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode())
    mac = hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}.{mac}"


def verify(token: str, version: str, filename: str, secret: str, now: float | None = None) -> bool:
    encoded, sep, mac = token.partition(".")
    if not sep:
        return False
    expected = hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(mac, expected):
        return False
    try:
        payload = json.loads(base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4)))
    except ValueError:
        return False
    return (
        payload.get("v") == version
        and payload.get("f") == filename
        and isinstance(payload.get("exp"), int)
        and payload["exp"] > (now or time.time())
    )
