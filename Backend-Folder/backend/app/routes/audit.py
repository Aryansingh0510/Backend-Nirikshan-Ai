from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.audit_service import audit_service

router = APIRouter(prefix="/audit-trail", tags=["Audit Trail"])

@router.get("")
@router.get("/", include_in_schema=False)
def get_audit_trail(db: Session = Depends(get_db)):
    logs = audit_service.get_audit_logs(db)
    return {"success": True, "count": len(logs), "data": logs}

@router.post("/verify")
def verify_audit_ledger(db: Session = Depends(get_db)):
    result = audit_service.verify_ledger(db)
    return result
