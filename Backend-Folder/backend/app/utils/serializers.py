from app.models.institution import Institution
from app.models.alert import Alert
from app.models.telemetry import Telemetry
from app.models.audit_log import AuditLog

def serialize_institution(inst: Institution) -> dict:
    rep_staff = int(inst.active_staff_reported if inst.active_staff_reported is not None else (inst.reported_staff or 12))
    rep_ben = int(inst.beneficiaries_reported if inst.beneficiaries_reported is not None else (inst.reported_beneficiaries or 85))
    reg_num = inst.registration_number or f"REG-{inst.id}"
    op_status = inst.facility_status_reported or inst.operational_status or "Operational (Full)"

    return {
        "id": inst.id,
        "name": inst.name,
        "registration_number": reg_num,
        "registrationNumber": reg_num,
        "location": inst.location or inst.address or "Maharashtra",
        "address": inst.address or inst.location or "Maharashtra",
        "state": inst.state or "Maharashtra",
        "district": inst.district or "Thane",
        "type": inst.type or "Welfare",
        "riskScore": int(inst.risk_score or 15),
        "reportedCompliance": int(inst.reported_compliance if inst.reported_compliance is not None else 90),
        "verifiedCompliance": int(inst.verified_compliance if inst.verified_compliance is not None else 75),
        "realityGap": int(inst.reality_gap if inst.reality_gap is not None else 15),
        "lastInspectionDate": inst.last_inspection_date or "Just Registered",
        "inspectionMethod": inst.inspection_method or "Field Agent",
        "status": inst.status or "Stable",
        "activeStaffReported": rep_staff,
        "activeStaffVerified": int(inst.active_staff_verified or 7),
        "reported_staff": rep_staff,
        "beneficiariesReported": rep_ben,
        "beneficiariesVerified": int(inst.beneficiaries_verified or 51),
        "reported_beneficiaries": rep_ben,
        "facilityStatusReported": op_status,
        "facilityStatusObserved": inst.facility_status_observed or "Under Evaluation",
        "operational_status": op_status,
        "facilityNotes": inst.facility_notes or "",
        "zone": inst.zone or "Urban Zone C",
        "latitude": float(inst.latitude or 19.0330),
        "longitude": float(inst.longitude or 73.0297),
        "geofenceRadiusMeters": int(inst.geofence_radius_meters or 50),
    }

def serialize_alert(alert: Alert) -> dict:
    return {
        "id": alert.id,
        "title": alert.title,
        "institutionName": alert.institution_name,
        "institutionId": alert.institution_id,
        "severity": alert.severity,
        "time": alert.time,
        "date": alert.date,
        "description": alert.description,
        "discrepancyPercent": alert.discrepancy_percent,
        "component": alert.component,
        "reportedVal": alert.reported_val,
        "verifiedVal": alert.verified_val,
        "assignedTo": alert.assigned_to,
        "acknowledged": bool(alert.acknowledged),
    }

def serialize_telemetry(t: Telemetry) -> dict:
    return {
        "inspectorId": t.inspector_id,
        "name": t.name,
        "avatar": t.avatar or "",
        "currentLat": float(t.current_lat),
        "currentLng": float(t.current_lng),
        "accuracyMeters": float(t.accuracy_meters),
        "assignedInstitutionId": t.assigned_institution_id,
        "assignedInstitutionName": t.assigned_institution_name,
        "status": t.status,
        "etaMinutes": t.eta_minutes,
        "distanceKm": t.distance_km,
        "distanceToPerimeterMeters": float(t.distance_to_perimeter_meters),
        "isWithinGeofence": bool(t.is_within_geofence),
        "batteryLevel": int(t.battery_level),
        "lastPingTime": t.last_ping_time,
    }

def serialize_audit_log(log: AuditLog) -> dict:
    return {
        "id": log.id,
        "action": log.action,
        "target": log.target or f"Institution ({log.inspection_id or ''})",
        "user": log.user_name or (log.user.name if log.user else "System"),
        "time": log.time_str or (log.created_at.strftime("%d-%b-%Y %H:%M:%S IST") if log.created_at else "Just now"),
        "status": log.status or "VERIFIED",
        "hash": log.hash or "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "prevHash": log.prev_hash or "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "details": log.description,
    }
