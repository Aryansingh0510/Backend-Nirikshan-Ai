import uuid
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.institution import Institution
from app.utils.serializers import serialize_institution

class InstitutionService:
    def get_institutions(
        self,
        db: Session,
        search: Optional[str] = None,
        type: Optional[str] = None,
        status: Optional[str] = None,
        zone: Optional[str] = None,
        page: int = 1,
        limit: int = 100,
    ) -> Tuple[List[dict], int]:
        query = db.query(Institution)

        if search:
            q = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Institution.name.ilike(q),
                    Institution.id.ilike(q),
                    Institution.address.ilike(q),
                    Institution.district.ilike(q),
                    Institution.registration_number.ilike(q),
                )
            )

        if type and type != "All":
            query = query.filter(Institution.type == type)

        if status and status != "All":
            query = query.filter(Institution.status == status)

        if zone and zone != "All":
            query = query.filter(Institution.zone == zone)

        total = query.count()
        offset = (page - 1) * limit
        items = query.order_by(Institution.name).offset(offset).limit(limit).all()

        serialized = [serialize_institution(item) for item in items]
        return serialized, total

    def get_institution_by_id(self, db: Session, institution_id: str) -> Optional[dict]:
        inst = db.query(Institution).filter(Institution.id == institution_id).first()
        if not inst:
            return None
        return serialize_institution(inst)

    def create_institution(self, db: Session, data: dict) -> dict:
        inst_id = data.get("id") or f"NIR-{uuid.uuid4().hex[:4].upper()}"
        rep_comp = data.get("reportedCompliance") or data.get("reported_compliance") or 90
        ver_comp = data.get("verifiedCompliance") or data.get("verified_compliance") or 75
        gap = max(0, rep_comp - ver_comp)
        status = "Critical" if gap >= 20 else "Warning" if gap >= 10 else "Stable"

        new_inst = Institution(
            id=inst_id,
            name=data.get("name", "New Facility"),
            registration_number=data.get("registration_number") or data.get("registrationNumber") or f"REG-W-{uuid.uuid4().hex[:4].upper()}",
            address=data.get("address") or data.get("location") or "Maharashtra",
            location=data.get("location") or data.get("address") or "Maharashtra",
            state=data.get("state", "Maharashtra"),
            district=data.get("district", "Thane"),
            type=data.get("type", "Welfare"),
            risk_score=float(data.get("riskScore", gap * 2.5 + 10 if gap > 0 else 15)),
            reported_compliance=rep_comp,
            verified_compliance=ver_comp,
            reality_gap=gap,
            last_inspection_date="Just Registered",
            inspection_method=data.get("inspectionMethod", "Field Agent"),
            status=status,
            active_staff_reported=int(data.get("activeStaffReported") or data.get("reported_staff") or 15),
            active_staff_verified=int(data.get("activeStaffVerified") or 12),
            beneficiaries_reported=int(data.get("beneficiariesReported") or data.get("reported_beneficiaries") or 100),
            beneficiaries_verified=int(data.get("beneficiariesVerified") or 80),
            facility_status_reported=data.get("facilityStatusReported", "Operational (Full)"),
            facility_status_observed=data.get("facilityStatusObserved", "Under Evaluation"),
            facility_notes=data.get("facilityNotes", "Registered into Nirikshan central repository."),
            zone=data.get("zone", "Urban Zone C"),
            latitude=float(data.get("latitude", 19.033)),
            longitude=float(data.get("longitude", 73.029)),
            geofence_radius_meters=int(data.get("geofenceRadiusMeters", 50)),
        )

        db.add(new_inst)
        db.commit()
        db.refresh(new_inst)
        return serialize_institution(new_inst)

    def update_institution(self, db: Session, institution_id: str, data: dict) -> Optional[dict]:
        inst = db.query(Institution).filter(Institution.id == institution_id).first()
        if not inst:
            return None

        for k, v in data.items():
            if k in ["name", "address", "location", "state", "district", "type", "zone", "status"]:
                setattr(inst, k, v)
            elif k in ["reportedCompliance", "reported_compliance"]:
                inst.reported_compliance = int(v)
            elif k in ["verifiedCompliance", "verified_compliance"]:
                inst.verified_compliance = int(v)
            elif k in ["activeStaffReported", "reported_staff"]:
                inst.active_staff_reported = int(v)
            elif k in ["activeStaffVerified", "verified_staff"]:
                inst.active_staff_verified = int(v)
            elif k in ["beneficiariesReported", "reported_beneficiaries"]:
                inst.beneficiaries_reported = int(v)
            elif k in ["beneficiariesVerified", "verified_beneficiaries"]:
                inst.beneficiaries_verified = int(v)
            elif k in ["facilityStatusReported", "facility_status_reported"]:
                inst.facility_status_reported = v
            elif k in ["facilityStatusObserved", "facility_status_observed"]:
                inst.facility_status_observed = v
            elif k in ["facilityNotes", "facility_notes"]:
                inst.facility_notes = v

        # Recalculate gap and status
        if inst.reported_compliance is not None and inst.verified_compliance is not None:
            inst.reality_gap = max(0, inst.reported_compliance - inst.verified_compliance)
            inst.status = "Critical" if inst.reality_gap >= 20 else "Warning" if inst.reality_gap >= 10 else "Stable"

        db.commit()
        db.refresh(inst)
        return serialize_institution(inst)

institution_service = InstitutionService()
