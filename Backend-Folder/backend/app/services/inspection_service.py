from typing import Dict, Any
from sqlalchemy.orm import Session

from app.models.institution import Institution
from app.models.telemetry import Telemetry
from app.models.inspection import Inspection
from app.services.audit_service import audit_service
from app.services.alert_service import alert_service
from app.utils.serializers import serialize_institution

class InspectionService:
    def dispatch_surprise_inspection(
        self, db: Session, institution_id: str, inspector_name: str = "Field Inspector Priya Nair (INSP-492)", urgency: str = "Immediate"
    ) -> Dict[str, Any]:
        inst = db.query(Institution).filter(Institution.id == institution_id).first()
        if not inst:
            raise ValueError("Institution not found")

        inst_dict = serialize_institution(inst)

        log = audit_service.add_audit_log(
            db=db,
            action="SURPRISE AUDIT AUTHORIZED",
            target=f"{inst.name} ({inst.id})",
            user="Director S. Rameshwar (PMU-DIR)",
            details=f"Surprise inspection dispatched with urgency level '{urgency}' assigned to {inspector_name}.",
        )

        # Update telemetry if inspector matches
        tele = db.query(Telemetry).filter(
            (Telemetry.inspector_id == "INSP-492") | (Telemetry.name.like("%Priya%"))
        ).first()
        if tele:
            tele.assigned_institution_id = inst.id
            tele.assigned_institution_name = inst.name
            tele.status = "In Transit"
            db.commit()

        return {
            "success": True,
            "message": f"Surprise audit dispatched for {inst.name}",
            "data": {
                "institution": inst_dict,
                "log": log,
            },
        }

    def submit_inspection(self, db: Session, payload: dict) -> Dict[str, Any]:
        inst_id = payload.get("institutionId")
        inst = db.query(Institution).filter(Institution.id == inst_id).first()
        if not inst:
            raise ValueError("Institution not found")

        observed_staff = int(payload.get("observedStaff", 0))
        observed_ben = payload.get("observedBeneficiaries")
        obs_status = payload.get("facilityObservedStatus")
        notes = payload.get("notes", "Inspection completed via mobile application.")
        urls = payload.get("evidencePhotoUrls") or []
        inspector_name = payload.get("inspectorName", "Inspector Priya Nair")
        inspector_id = payload.get("inspectorId", "INSP-492")

        inst.active_staff_verified = observed_staff
        if observed_ben is not None:
            inst.beneficiaries_verified = int(observed_ben)
        if obs_status:
            inst.facility_status_observed = obs_status
        if notes:
            inst.facility_notes = notes

        rep_staff = inst.active_staff_reported or inst.reported_staff or 1
        rep_ben = inst.beneficiaries_reported or inst.reported_beneficiaries or 1
        staff_ratio = min(1.0, observed_staff / max(1, rep_staff))
        ben_ratio = min(1.0, (inst.beneficiaries_verified or 0) / max(1, rep_ben))

        new_verified_comp = round((staff_ratio * 50) + (ben_ratio * 30) + 15)
        inst.verified_compliance = new_verified_comp
        rep_comp = inst.reported_compliance or 90
        gap = max(0, rep_comp - new_verified_comp)
        inst.reality_gap = gap
        inst.last_inspection_date = "Today"
        inst.status = "Critical" if gap >= 20 else "Warning" if gap >= 10 else "Stable"
        inst.risk_score = min(100.0, float(gap * 2.5 + 10))

        # Create record in Inspections table
        new_insp = Inspection(
            institution_id=inst.id,
            inspector_id="usr-insp-1",
            inspector_latitude=float(payload.get("inspectorLat", 19.033)),
            inspector_longitude=float(payload.get("inspectorLng", 73.0297)),
            verified_staff=observed_staff,
            verified_beneficiaries=inst.beneficiaries_verified or 0,
            verified_operational_status=inst.facility_status_observed or "Operational (Full)",
            inspection_status="Completed",
            notes=notes,
        )
        db.add(new_insp)
        db.commit()

        inst_dict = serialize_institution(inst)

        log = audit_service.add_audit_log(
            db=db,
            action="SURPRISE INSPECTION SUBMITTED",
            target=f"{inst.name} ({inst.id})",
            user=f"{inspector_name} ({inspector_id})",
            details=f"Ground audit completed: {observed_staff} staff observed vs {rep_staff} reported. Reality Gap: {gap}%. {len(urls)} geo-stamped evidence photos logged.",
            inspection_id=new_insp.id,
        )

        alert_created = None
        if gap >= 15:
            alert_created = alert_service.create_alert(
                db=db,
                data={
                    "title": f"HIGH REALITY GAP DETECTED ({gap}%)",
                    "institutionName": inst.name,
                    "institutionId": inst.id,
                    "severity": "Critical" if gap >= 25 else "Warning",
                    "description": f"Field inspection by {inspector_name} confirmed significant discrepancy. Staff Headcount observed {observed_staff}/{rep_staff}. Notes: {notes}",
                    "discrepancyPercent": gap,
                    "component": "Staff & Physical Presence",
                    "reportedVal": rep_comp,
                    "verifiedVal": new_verified_comp,
                    "assignedTo": inspector_name,
                },
            )

        return {
            "success": True,
            "message": "Inspection submitted successfully and cryptographically recorded.",
            "data": {
                "institution": inst_dict,
                "gap": gap,
                "alertCreated": alert_created,
                "log": log,
            },
        }

inspection_service = InspectionService()
