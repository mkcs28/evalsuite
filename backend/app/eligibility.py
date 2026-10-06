"""Age rule for API access. The date of birth is self-declared at registration."""

from __future__ import annotations

from datetime import date, datetime, timezone

MINIMUM_AGE = 18


def today_utc() -> date:
    return datetime.now(timezone.utc).date()


def age_on(birth: date, today: date) -> int:
    """Whole years between ``birth`` and ``today``; the birthday itself counts."""
    return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))


def is_adult(birth: date | None, today: date | None = None) -> bool:
    return birth is not None and age_on(birth, today or today_utc()) >= MINIMUM_AGE
