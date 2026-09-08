from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.inspection_service import inspection_service

router = APIRouter(prefix="/inspections", tags=["Inspections"])

@router.post("/dispatch")
async def dispatch_inspection(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        inst_id = body.get("institutionId")
        if not inst_id:
            raise HTTPException(status_code=400, detail="institutionId is required")
        
        inspector_name = body.get("inspectorName") or "Field Inspector Priya Nair (INSP-492)"
        urgency = body.get("urgency") or body.get("priority") or "Immediate"

        result = inspection_service.dispatch_surprise_inspection(
            db=db, institution_id=inst_id, inspector_name=inspector_name, urgency=urgency
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/submit")
async def submit_inspection(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        inst_id = body.get("institutionId")
        observed_staff = body.get("observedStaff") if body.get("observedStaff") is not None else body.get("verifiedStaff")
        
        if not inst_id or observed_staff is None:
            raise HTTPException(status_code=400, detail="institutionId and observedStaff are required")

        result = inspection_service.submit_inspection(db=db, payload=body)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
