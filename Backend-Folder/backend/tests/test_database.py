import pytest
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.institution import Institution
from app.models.inspection import Inspection
from app.models.evidence import Evidence
from app.models.risk_assessment import RiskAssessment
from app.models.audit_log import AuditLog
from app.models.alert import Alert
from app.models.telemetry import Telemetry

def test_database_connection(db):
    assert db is not None

def test_user_creation_and_uniqueness(db):
    u1 = User(name="Officer One", email="officer1@nirikshan.gov.in", password_hash="hash1", role="official")
    db.add(u1)
    db.commit()
    db.refresh(u1)

    assert u1.id is not None
    assert u1.created_at is not None

    u2 = User(name="Officer Duplicate", email="officer1@nirikshan.gov.in", password_hash="hash2", role="official")
    db.add(u2)
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()

def test_institution_creation_and_uniqueness(db):
    inst1 = Institution(
        name="District Hospital Thane",
        registration_number="REG-HOSP-101",
        address="Thane, MH",
        latitude=19.2,
        longitude=72.9,
    )
    db.add(inst1)
    db.commit()
    db.refresh(inst1)

    assert inst1.id is not None
    assert inst1.registration_number == "REG-HOSP-101"

    inst2 = Institution(
        name="Duplicate Hosp",
        registration_number="REG-HOSP-101",
        address="Thane, MH",
        latitude=19.2,
        longitude=72.9,
    )
    db.add(inst2)
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()

def test_inspection_evidence_risk_relationships(db):
    user = User(name="Inspector Test", email="insp.test@nirikshan.gov.in", password_hash="hash", role="inspector")
    inst = Institution(name="School Unit", registration_number="REG-SCH-99", address="Mumbai", latitude=19.0, longitude=72.8)
    db.add_all([user, inst])
    db.commit()

    insp = Inspection(
        institution_id=inst.id,
        inspector_id=user.id,
        inspector_latitude=19.01,
        inspector_longitude=72.81,
        verified_staff=10,
        verified_beneficiaries=80,
    )
    db.add(insp)
    db.commit()
    db.refresh(insp)

    evid = Evidence(
        inspection_id=insp.id,
        file_url="https://example.com/photo.jpg",
        file_type="image/jpeg",
        file_name="photo.jpg",
    )
    risk = RiskAssessment(
        institution_id=inst.id,
        inspection_id=insp.id,
        reality_gap=15.0,
        risk_score=45.0,
        risk_level="Warning",
    )
    audit = AuditLog(
        user_id=user.id,
        inspection_id=insp.id,
        action="INSPECTION_CREATED",
        description="Inspection created by test.",
    )
    db.add_all([evid, risk, audit])
    db.commit()

    # Query & verify relationships
    fetched_insp = db.query(Inspection).filter(Inspection.id == insp.id).first()
    assert fetched_insp is not None
    assert fetched_insp.institution.name == "School Unit"
    assert fetched_insp.inspector.name == "Inspector Test"
    assert len(fetched_insp.evidence_items) == 1
    assert fetched_insp.evidence_items[0].file_name == "photo.jpg"
    assert fetched_insp.risk_assessment.risk_level == "Warning"
    assert len(fetched_insp.audit_logs) == 1

def test_alert_and_telemetry_creation(db):
    alt = Alert(title="TEST ALERT", institution_name="Inst A", institution_id="INST-A", severity="Critical", description="Test desc")
    tel = Telemetry(inspector_id="INSP-99", name="Inspector 99", current_lat=19.1, current_lng=73.1)
    db.add_all([alt, tel])
    db.commit()

    assert db.query(Alert).filter(Alert.id == alt.id).first() is not None
    assert db.query(Telemetry).filter(Telemetry.inspector_id == "INSP-99").first() is not None
