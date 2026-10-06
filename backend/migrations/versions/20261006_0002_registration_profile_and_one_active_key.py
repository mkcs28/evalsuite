"""registration profile and one active key

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-06 05:03:36.035853
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Existing accounts may hold several active keys; keep only the newest one per account
    # so the one-active-key index can be created.
    op.execute(
        """
        UPDATE api_keys SET revoked_at = CURRENT_TIMESTAMP
        WHERE revoked_at IS NULL AND id NOT IN (
            SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
                FROM api_keys WHERE revoked_at IS NULL
            ) ranked WHERE rn = 1
        )
        """
    )
    op.create_index(
        "uq_api_keys_one_active_per_user",
        "api_keys",
        ["user_id"],
        unique=True,
        postgresql_where=sa.text("revoked_at IS NULL"),
        sqlite_where=sa.text("revoked_at IS NULL"),
    )
    op.add_column("users", sa.Column("date_of_birth", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("role", sa.String(length=32), nullable=True))
    op.add_column("users", sa.Column("organization", sa.String(length=160), nullable=True))
    op.add_column("users", sa.Column("country", sa.String(length=80), nullable=True))
    op.add_column("users", sa.Column("intended_use", sa.String(length=500), nullable=True))
    op.add_column("users", sa.Column("terms_accepted_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "terms_accepted_at")
    op.drop_column("users", "intended_use")
    op.drop_column("users", "country")
    op.drop_column("users", "organization")
    op.drop_column("users", "role")
    op.drop_column("users", "date_of_birth")
    op.drop_index(
        "uq_api_keys_one_active_per_user",
        table_name="api_keys",
        postgresql_where=sa.text("revoked_at IS NULL"),
        sqlite_where=sa.text("revoked_at IS NULL"),
    )
