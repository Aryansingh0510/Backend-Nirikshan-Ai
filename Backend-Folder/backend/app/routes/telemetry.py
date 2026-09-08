from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.telemetry_service import telemetry_service

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("/inspectors")
@router.get("", include_in_schema=False)
@router.get("/", include_in_schema=False)
def get_inspectors(db: Session = Depends(get_db)):
    list_data = telemetry_service.get_inspectors(db)
    return {"success": True, "count": len(list_data), "data": list_data}

@router.post("/ping")
async def ping_telemetry(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        inspector_id = body.get("inspectorId")
        lat = body.get("lat") if body.get("lat") is not None else body.get("latitude")
        lng = body.get("lng") if body.get("lng") is not None else body.get("longitude")
        accuracy_meters = body.get("accuracyMeters")

        if not inspector_id or lat is None or lng is None:
            raise HTTPException(status_code=400, detail="inspectorId, lat, and lng are required")

        updated = telemetry_service.ping_telemetry(
            db=db,
            inspector_id=inspector_id,
            lat=float(lat),
            lng=float(lng),
            accuracy_meters=float(accuracy_meters) if accuracy_meters is not None else 5.0,
        )

        if not updated:
            raise HTTPException(status_code=404, detail="Inspector not found")

        return {"success": True, "message": "Telemetry updated", "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
