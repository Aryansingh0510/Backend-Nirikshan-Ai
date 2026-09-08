import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"TX-{uuid.uuid4().hex[:6].upper()}")
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=True)
    inspection_id: Mapped[str] = mapped_column(String(36), ForeignKey("inspections.id"), index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    target: Mapped[str] = mapped_column(String(200), nullable=True)
    user_name: Mapped[str] = mapped_column(String(100), nullable=True)
    time_str: Mapped[str] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="VERIFIED")
    hash: Mapped[str] = mapped_column(String(128), nullable=True)
    prev_hash: Mapped[str] = mapped_column(String(128), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="audit_logs")
    inspection = relationship("Inspection", back_populates="audit_logs")
