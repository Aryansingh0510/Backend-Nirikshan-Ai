from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.services.institution_service import institution_service

router = APIRouter(prefix="/institutions", tags=["Institutions"])

def check_optional_role(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    user = db.query(User).filter(User.id == payload["sub"]).first()
    return user

@router.get("")
@router.get("/", include_in_schema=False)
def list_institutions(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    zone: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db),
):
    items, total = institution_service.get_institutions(
        db=db, search=search, type=type, status=status, zone=zone, page=page, limit=limit
    )
    return {"success": True, "count": len(items), "total": total, "data": items}

@router.get("/{institution_id}")
def get_institution_by_id(institution_id: str, db: Session = Depends(get_db)):
    inst = institution_service.get_institution_by_id(db, institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return {"success": True, "data": inst}

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_institution(
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(check_optional_role),
):
    if user and user.role not in ["admin", "official"]:
        raise HTTPException(status_code=403, detail="Forbidden: insufficient role permissions")
    try:
        body = await request.json()
        new_inst = institution_service.create_institution(db, body)
        return {"success": True, "data": new_inst}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{institution_id}")
@router.put("/{institution_id}", include_in_schema=False)
async def update_institution(
    institution_id: str,
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(check_optional_role),
):
    if user and user.role not in ["admin", "official"]:
        raise HTTPException(status_code=403, detail="Forbidden: insufficient role permissions")
    try:
        body = await request.json()
        updated = institution_service.update_institution(db, institution_id, body)
        if not updated:
            raise HTTPException(status_code=404, detail="Institution not found")
        return {"success": True, "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
