"""Only personal (consumer) email addresses are accepted.

The allow-list lives in the website (src/data/personal-email-domains.json) and is copied here by
`npm run registry:export`, so both sides apply the same rule.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

MESSAGE = (
    "Use a personal email address (for example Gmail, Outlook, Yahoo, iCloud or Proton). "
    "Organisation and institutional email addresses are not accepted."
)


@lru_cache
def personal_domains() -> frozenset[str]:
    path = Path(__file__).resolve().parent / "data" / "personal_email_domains.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return frozenset(d.lower() for d in data["domains"])


def is_personal_email(email: str) -> bool:
    domain = email.rsplit("@", 1)[-1].strip().lower()
    return domain in personal_domains()


def require_personal_email(email: str) -> str:
    if not is_personal_email(email):
        raise ValueError(MESSAGE)
    return email
