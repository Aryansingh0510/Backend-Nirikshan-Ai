from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class Telemetry(Base):
    __tablename__ = "telemetry"

    inspector_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=True)
    current_lat: Mapped[float] = mapped_column(Float, nullable=False)
    current_lng: Mapped[float] = mapped_column(Float, nullable=False)
    accuracy_meters: Mapped[float] = mapped_column(Float, default=5.0)
    assigned_institution_id: Mapped[str] = mapped_column(String(36), nullable=True)
    assigned_institution_name: Mapped[str] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Idle")
    eta_minutes: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    distance_km: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)
    distance_to_perimeter_meters: Mapped[float] = mapped_column(Float, default=0.0)
    is_within_geofence: Mapped[bool] = mapped_column(Boolean, default=False)
    battery_level: Mapped[int] = mapped_column(Integer, default=100)
    last_ping_time: Mapped[str] = mapped_column(String(100), default="Just now")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
