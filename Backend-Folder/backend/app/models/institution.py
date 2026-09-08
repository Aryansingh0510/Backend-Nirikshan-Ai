import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    registration_number: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False, default=lambda: f"REG-{uuid.uuid4().hex[:6].upper()}"
    )
    address: Mapped[str] = mapped_column(String(300), nullable=False, default="Maharashtra")
    location: Mapped[str] = mapped_column(String(300), nullable=False, default="Maharashtra")
    state: Mapped[str] = mapped_column(String(100), default="Maharashtra")
    district: Mapped[str] = mapped_column(String(100), default="Thane")
    type: Mapped[str] = mapped_column(String(50), default="Welfare")
    risk_score: Mapped[float] = mapped_column(Float, default=15.0)
    reported_compliance: Mapped[int] = mapped_column(Integer, default=90)
    verified_compliance: Mapped[int] = mapped_column(Integer, default=75)
    reality_gap: Mapped[int] = mapped_column(Integer, default=15)
    last_inspection_date: Mapped[str] = mapped_column(String(100), default="Just Registered")
    inspection_method: Mapped[str] = mapped_column(String(100), default="Field Agent")
    status: Mapped[str] = mapped_column(String(50), default="Stable")
    active_staff_reported: Mapped[int] = mapped_column(Integer, default=15)
    active_staff_verified: Mapped[int] = mapped_column(Integer, default=12)
    beneficiaries_reported: Mapped[int] = mapped_column(Integer, default=100)
    beneficiaries_verified: Mapped[int] = mapped_column(Integer, default=80)
    facility_status_reported: Mapped[str] = mapped_column(String(100), default="Operational (Full)")
    facility_status_observed: Mapped[str] = mapped_column(String(100), default="Under Evaluation")
    facility_notes: Mapped[str] = mapped_column(Text, nullable=True)
    zone: Mapped[str] = mapped_column(String(100), default="Urban Zone C")
    latitude: Mapped[float] = mapped_column(Float, default=19.0330)
    longitude: Mapped[float] = mapped_column(Float, default=73.0297)
    geofence_radius_meters: Mapped[int] = mapped_column(Integer, default=50)
    reported_staff: Mapped[int] = mapped_column(Integer, default=15)
    reported_beneficiaries: Mapped[int] = mapped_column(Integer, default=100)
    operational_status: Mapped[str] = mapped_column(String(50), default="Operational (Full)")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    inspections = relationship("Inspection", back_populates="institution")
    risk_assessments = relationship("RiskAssessment", back_populates="institution")
