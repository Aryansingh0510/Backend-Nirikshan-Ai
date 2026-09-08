import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"ALT-{uuid.uuid4().hex[:6].upper()}")
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    institution_name: Mapped[str] = mapped_column(String(200), nullable=False)
    institution_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(50), default="Warning", index=True)
    time: Mapped[str] = mapped_column(String(50), default="14:30 IST")
    date: Mapped[str] = mapped_column(String(50), default="Today")
    description: Mapped[str] = mapped_column(Text, nullable=False)
    discrepancy_percent: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    component: Mapped[str] = mapped_column(String(100), nullable=True)
    reported_val: Mapped[int] = mapped_column(Integer, nullable=True)
    verified_val: Mapped[int] = mapped_column(Integer, nullable=True)
    assigned_to: Mapped[str] = mapped_column(String(100), nullable=True)
    acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
