from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("")
@router.get("/", include_in_schema=False)
def list_alerts(severity: Optional[str] = Query(None), db: Session = Depends(get_db)):
    alerts = alert_service.get_alerts(db, severity=severity)
    return {"success": True, "count": len(alerts), "data": alerts}

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = alert_service.acknowledge_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True, "message": f"Alert {alert_id} acknowledged", "data": alert}

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_alert(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        new_alert = alert_service.create_alert(db, body)
        return {"success": True, "data": new_alert}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
