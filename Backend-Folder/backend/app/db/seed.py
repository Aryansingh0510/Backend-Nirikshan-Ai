import sys
import os

# Ensure backend root directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.institution import Institution
from app.models.inspection import Inspection
from app.models.evidence import Evidence
from app.models.risk_assessment import RiskAssessment
from app.models.audit_log import AuditLog
from app.models.alert import Alert
from app.models.telemetry import Telemetry

def seed_database():
    print("🌱 Starting database seeding...")
    
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).count() > 0 or db.query(Institution).count() > 0:
            print("ℹ️ Database already contains seed data. Skipping seeding.")
            return

        # 1. Seed Users
        users = [
            User(
                id="usr-off-1",
                name="Director S. Rameshwar",
                email="director@nirikshan.gov.in",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO4iWf8/u4jXb5d4e3f2g1h0i",
                role="official"
            ),
            User(
                id="usr-insp-1",
                name="Inspector Priya Nair",
                email="priya.nair@nirikshan.gov.in",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO4iWf8/u4jXb5d4e3f2g1h0i",
                role="inspector"
            ),
            User(
                id="usr-insp-2",
                name="Inspector Rajesh Mane",
                email="rajesh.mane@nirikshan.gov.in",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO4iWf8/u4jXb5d4e3f2g1h0i",
                role="inspector"
            ),
            User(
                id="usr-inst-1",
                name="Admin Dr. V. Joshi",
                email="admin@abcwelfare.org",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO4iWf8/u4jXb5d4e3f2g1h0i",
                role="institution"
            ),
        ]
        db.add_all(users)
        db.commit()
        print(f"✅ Seeded {len(users)} users.")

        # 2. Seed Institutions
        institutions = [
            Institution(
                id="NIR-8821",
                name="ABC Welfare Centre",
                registration_number="REG-W-8821",
                address="Sector 14, Urban Zone C, Navi Mumbai",
                location="Sector 14, Urban Zone C, Navi Mumbai",
                state="Maharashtra",
                district="Thane",
                type="Welfare",
                risk_score=78.0,
                reported_compliance=91,
                verified_compliance=63,
                reality_gap=28,
                last_inspection_date="14 Oct 2023",
                inspection_method="Field Agent",
                status="Critical",
                active_staff_reported=12,
                active_staff_verified=7,
                beneficiaries_reported=85,
                beneficiaries_verified=51,
                facility_status_reported="Operational (Full)",
                facility_status_observed="Partially Operational",
                facility_notes="North wing closed for unrecorded maintenance. Medical dispensary locked during mandated hours.",
                zone="Urban Zone C",
                latitude=19.0330,
                longitude=73.0297,
                geofence_radius_meters=50,
                reported_staff=12,
                reported_beneficiaries=85,
                operational_status="Operational (Full)",
            ),
            Institution(
                id="SCH-0942",
                name="St. Xavier's High School",
                registration_number="REG-E-0942",
                address="Sector 4, Vashi, Mumbai Suburban",
                location="Sector 4, Vashi, Mumbai Suburban",
                state="Maharashtra",
                district="Mumbai Suburban",
                type="Education",
                risk_score=85.0,
                reported_compliance=98,
                verified_compliance=71,
                reality_gap=27,
                last_inspection_date="12 Oct 2023",
                inspection_method="Field Agent",
                status="Critical",
                active_staff_reported=34,
                active_staff_verified=24,
                beneficiaries_reported=420,
                beneficiaries_verified=310,
                facility_status_reported="Operational (Full)",
                facility_status_observed="Partial - Labs Non-functional",
                facility_notes="Computer lab equipment stored in boxes. Mid-day meal kitchen hygiene concerns.",
                zone="Urban Zone A",
                latitude=19.0760,
                longitude=72.8777,
                geofence_radius_meters=75,
                reported_staff=34,
                reported_beneficiaries=420,
                operational_status="Operational (Full)",
            ),
            Institution(
                id="HOS-4819",
                name="District General Hospital - Sub Unit",
                registration_number="REG-H-4819",
                address="Shivajinagar, Pune",
                location="Shivajinagar, Pune",
                state="Maharashtra",
                district="Pune",
                type="Healthcare",
                risk_score=52.0,
                reported_compliance=88,
                verified_compliance=72,
                reality_gap=16,
                last_inspection_date="08 Oct 2023",
                inspection_method="AI Monitored",
                status="Warning",
                active_staff_reported=28,
                active_staff_verified=22,
                beneficiaries_reported=160,
                beneficiaries_verified=135,
                facility_status_reported="Operational (Full)",
                facility_status_observed="Operational - High Wait Time",
                facility_notes="Emergency duty doctor log verified with slight delay in triage shift rotation.",
                zone="Urban Zone B",
                latitude=18.5204,
                longitude=73.8567,
                geofence_radius_meters=100,
                reported_staff=28,
                reported_beneficiaries=160,
                operational_status="Operational (Full)",
            ),
            Institution(
                id="CIV-1102",
                name="PWD Water Works Unit 4",
                registration_number="REG-I-1102",
                address="Gangapur Road, Nashik",
                location="Gangapur Road, Nashik",
                state="Maharashtra",
                district="Nashik",
                type="Infrastructure",
                risk_score=12.0,
                reported_compliance=95,
                verified_compliance=92,
                reality_gap=3,
                last_inspection_date="Yesterday",
                inspection_method="Drone Survey",
                status="Stable",
                active_staff_reported=15,
                active_staff_verified=15,
                beneficiaries_reported=1200,
                beneficiaries_verified=1180,
                facility_status_reported="Operational (Full)",
                facility_status_observed="Operational (Full)",
                facility_notes="Turbidity and flow logs closely match telemetry readings.",
                zone="Semi-Urban Zone D",
                latitude=19.9975,
                longitude=73.7898,
                geofence_radius_meters=120,
                reported_staff=15,
                reported_beneficiaries=1200,
                operational_status="Operational (Full)",
            ),
            Institution(
                id="WEL-3391",
                name="Apeksha Orphanage & Shelter",
                registration_number="REG-W-3391",
                address="Ghodbunder Road, Thane",
                location="Ghodbunder Road, Thane",
                state="Maharashtra",
                district="Thane",
                type="Welfare",
                risk_score=74.0,
                reported_compliance=85,
                verified_compliance=61,
                reality_gap=24,
                last_inspection_date="03 Oct 2023",
                inspection_method="Field Agent",
                status="Critical",
                active_staff_reported=18,
                active_staff_verified=11,
                beneficiaries_reported=64,
                beneficiaries_verified=42,
                facility_status_reported="Operational (Full)",
                facility_status_observed="Partially Operational",
                facility_notes="Dormitory capacity inflated in quarterly grant requisition.",
                zone="Suburban Zone E",
                latitude=19.2183,
                longitude=72.9781,
                geofence_radius_meters=60,
                reported_staff=18,
                reported_beneficiaries=64,
                operational_status="Operational (Full)",
            ),
        ]
        db.add_all(institutions)
        db.commit()
        print(f"✅ Seeded {len(institutions)} institutions.")

        # 3. Seed Alerts
        alerts = [
            Alert(
                id="ALT-1092",
                title="HIGH REALITY GAP DETECTED",
                institution_name="ABC Welfare Centre",
                institution_id="NIR-8821",
                severity="Critical",
                time="14:32 IST",
                date="Today",
                description="Ground inspection revealed severe discrepancy in Staff Presence (7 verified vs 12 reported) and Beneficiaries (51 verified vs 85 reported). Overall gap calculated at 28%.",
                discrepancy_percent=28,
                component="Staff & Beneficiaries",
                reported_val=91,
                verified_val=63,
                assigned_to="Inspector INSP-492",
                acknowledged=False,
            ),
            Alert(
                id="ALT-1088",
                title="GHOST BENEFICIARY PATTERN FLAGGED",
                institution_name="St. Xavier's High School",
                institution_id="SCH-0942",
                severity="Critical",
                time="11:15 IST",
                date="Today",
                description="AI discrepancy model identified 110 head count difference between biometrics and mid-day meal grant claims.",
                discrepancy_percent=27,
                component="Student Attendance",
                reported_val=98,
                verified_val=71,
                assigned_to="Field Team Beta",
                acknowledged=False,
            ),
            Alert(
                id="ALT-1081",
                title="UNRESOLVED REPEAT VARIANCE",
                institution_name="Apeksha Orphanage & Shelter",
                institution_id="WEL-3391",
                severity="Warning",
                time="09:40 IST",
                date="Yesterday",
                description="Third consecutive audit cycle exhibiting >20% gap in resident beneficiary count. Escalated to District Welfare Officer.",
                discrepancy_percent=24,
                component="Resident Headcount",
                reported_val=85,
                verified_val=61,
                assigned_to="District Officer R. Patil",
                acknowledged=True,
            ),
        ]
        db.add_all(alerts)
        db.commit()
        print(f"✅ Seeded {len(alerts)} alerts.")

        # 4. Seed Telemetry
        telemetries = [
            Telemetry(
                inspector_id="INSP-492",
                name="Inspector Priya Nair",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
                current_lat=19.0331,
                current_lng=73.0298,
                accuracy_meters=4.2,
                assigned_institution_id="NIR-8821",
                assigned_institution_name="ABC Welfare Centre",
                status="Checklist in Progress",
                eta_minutes=0,
                distance_km=0.018,
                distance_to_perimeter_meters=18.0,
                is_within_geofence=True,
                battery_level=88,
                last_ping_time="Just now",
            ),
            Telemetry(
                inspector_id="INSP-811",
                name="Inspector Rajesh Mane",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
                current_lat=19.0790,
                current_lng=72.8790,
                accuracy_meters=6.1,
                assigned_institution_id="SCH-0942",
                assigned_institution_name="St. Xavier's High School",
                status="In Transit",
                eta_minutes=8,
                distance_km=2.4,
                distance_to_perimeter_meters=2400.0,
                is_within_geofence=False,
                battery_level=74,
                last_ping_time="2 mins ago",
            ),
        ]
        db.add_all(telemetries)
        db.commit()
        print(f"✅ Seeded {len(telemetries)} telemetry records.")

        # 5. Seed Audit Logs
        audit_logs = [
            AuditLog(
                id="TX-901824",
                action="SURPRISE INSPECTION SUBMITTED",
                target="ABC Welfare Centre (NIR-8821)",
                user_name="Inspector Priya Nair (INSP-492)",
                time_str="14-Oct-2023 11:24:18 IST",
                status="VERIFIED",
                hash="sha256:8a9f2ce8d9f1092a8310c34e81b39e1029471ab20938f928410293481234abcd",
                prev_hash="sha256:3d1f04aa8123984012938491823901928491029348129038491209348123bcde",
                description="Staff headcount: 7 verified vs 12 reported (-41.6% Reality Gap). Evidence attached with GPS lock at 18m.",
            ),
            AuditLog(
                id="TX-901799",
                action="SURPRISE AUDIT AUTHORIZED",
                target="ABC Welfare Centre (NIR-8821)",
                user_name="Director S. Rameshwar (PMU-DIR)",
                time_str="14-Oct-2023 10:42:05 IST",
                status="DISPATCHED",
                hash="sha256:3d1f04aa8123984012938491823901928491029348129038491209348123bcde",
                prev_hash="sha256:7c9e12bf8123984012938491823901928491029348129038491209348123cdef",
                description="Triggered by automated anomaly alert ALT-1092 following quarterly variance spike.",
            ),
        ]
        db.add_all(audit_logs)
        db.commit()
        print(f"✅ Seeded {len(audit_logs)} audit log records.")

        print("🎉 Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Database seeding failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
