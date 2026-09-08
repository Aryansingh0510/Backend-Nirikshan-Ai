from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_overview_stats(db: Session = Depends(get_db)):
    stats = analytics_service.get_overview_stats(db)
    return {"success": True, "data": stats}

@router.get("/trends")
def get_trends(db: Session = Depends(get_db)):
    trends = analytics_service.get_trends(db)
    return {"success": True, "data": trends}

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = analytics_service.get_categories(db)
    return {"success": True, "data": categories}
