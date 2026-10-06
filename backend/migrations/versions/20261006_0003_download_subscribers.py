"""download subscribers

Revision ID: 0003
Revises: 0002
Create Date: 2026-10-06 07:04:26.131955
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "download_subscribers",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("version", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_requested_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("unsubscribe_token_hash", sa.String(length=64), nullable=False),
        sa.Column("unsubscribed_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("unsubscribe_token_hash"),
    )
    op.create_index(op.f("ix_download_subscribers_email"), "download_subscribers", ["email"], unique=False)
    op.create_index(
        "uq_download_subscriber_email_version", "download_subscribers", ["email", "version"], unique=True
    )


def downgrade() -> None:
    op.drop_index("uq_download_subscriber_email_version", table_name="download_subscribers")
    op.drop_index(op.f("ix_download_subscribers_email"), table_name="download_subscribers")
    op.drop_table("download_subscribers")
