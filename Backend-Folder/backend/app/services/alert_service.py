import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models.alert import Alert
from app.models.audit_log import AuditLog
from app.utils.serializers import serialize_alert

class AlertService:
    def get_alerts(self, db: Session, severity: Optional[str] = None) -> List[dict]:
        query = db.query(Alert)
        if severity and severity.lower() != "all":
            query = query.filter(Alert.severity.ilike(severity))
        
        alerts = query.order_by(Alert.created_at.desc()).all()
        return [serialize_alert(a) for a in alerts]

    def acknowledge_alert(self, db: Session, alert_id: str) -> Optional[dict]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return None
        
        alert.acknowledged = True
        db.commit()
        db.refresh(alert)
        return serialize_alert(alert)

    def create_alert(self, db: Session, data: dict) -> dict:
        alert_id = f"ALT-{uuid.uuid4().hex[:4].upper()}"
        now = datetime.now(timezone.utc)
        time_str = f"{now.strftime('%H:%M')} IST"

        new_alert = Alert(
            id=alert_id,
            title=data.get("title", "SYSTEM ALERT"),
            institution_name=data.get("institutionName", "Unknown Entity"),
            institution_id=data.get("institutionId", "NIR-0000"),
            severity=data.get("severity", "Warning"),
            time=time_str,
            date="Today",
            description=data.get("description", "Alert raised by Nirikshan engine."),
            discrepancy_percent=data.get("discrepancyPercent", 0),
            component=data.get("component"),
            reported_val=data.get("reportedVal"),
            verified_val=data.get("verifiedVal"),
            assigned_to=data.get("assignedTo"),
            acknowledged=False,
        )

        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return serialize_alert(new_alert)

alert_service = AlertService()
