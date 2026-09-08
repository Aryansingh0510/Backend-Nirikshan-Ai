from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/analyze-discrepancy")
async def analyze_discrepancy(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        result = ai_service.analyze_discrepancy(db, body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
