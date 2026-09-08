import math
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models.telemetry import Telemetry
from app.models.institution import Institution
from app.utils.serializers import serialize_telemetry

def calculate_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371e3  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

class TelemetryService:
    def get_inspectors(self, db: Session) -> List[dict]:
        items = db.query(Telemetry).all()
        return [serialize_telemetry(t) for t in items]

    def ping_telemetry(
        self, db: Session, inspector_id: str, lat: float, lng: float, accuracy_meters: Optional[float] = 5.0
    ) -> Optional[dict]:
        item = db.query(Telemetry).filter(Telemetry.inspector_id == inspector_id).first()
        if not item:
            return None

        item.current_lat = lat
        item.current_lng = lng
        if accuracy_meters is not None:
            item.accuracy_meters = accuracy_meters

        if item.assigned_institution_id:
            inst = db.query(Institution).filter(Institution.id == item.assigned_institution_id).first()
            if inst:
                dist = calculate_distance_meters(lat, lng, inst.latitude, inst.longitude)
                item.distance_to_perimeter_meters = dist
                item.distance_km = round(dist / 1000.0, 3)
                item.is_within_geofence = dist <= (inst.geofence_radius_meters or 50)

        item.last_ping_time = "Just now"
        item.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(item)
        return serialize_telemetry(item)

telemetry_service = TelemetryService()
