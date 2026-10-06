"""anonymous visitor counter

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-06 07:24:48.823763
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "visitors",
        sa.Column("id_hash", sa.String(length=64), nullable=False),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id_hash"),
    )


def downgrade() -> None:
    op.drop_table("visitors")
