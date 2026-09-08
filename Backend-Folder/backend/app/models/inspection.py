import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id: Mapped[str] = mapped_column(String(36), ForeignKey("institutions.id"), nullable=False)
    inspector_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    inspector_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    inspector_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    gps_accuracy: Mapped[float] = mapped_column(Float, nullable=True)
    distance_from_institution: Mapped[float] = mapped_column(Float, nullable=True)
    location_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_staff: Mapped[int] = mapped_column(Integer, default=0)
    verified_beneficiaries: Mapped[int] = mapped_column(Integer, default=0)
    verified_operational_status: Mapped[str] = mapped_column(String(50), default="Operational (Full)")
    inspection_status: Mapped[str] = mapped_column(String(50), default="Pending")
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    institution = relationship("Institution", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")
    evidence_items = relationship("Evidence", back_populates="inspection")
    risk_assessment = relationship("RiskAssessment", back_populates="inspection", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="inspection")
