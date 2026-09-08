from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.institution import Institution
from app.models.alert import Alert
from app.models.telemetry import Telemetry
from app.models.inspection import Inspection

class AnalyticsService:
    def get_overview_stats(self, db: Session) -> Dict[str, Any]:
        institutions = db.query(Institution).all()
        total = len(institutions)
        critical_count = sum(1 for i in institutions if i.status == "Critical")
        warning_count = sum(1 for i in institutions if i.status == "Warning")

        if total > 0:
            total_reported = sum(i.reported_compliance or 90 for i in institutions)
            total_verified = sum(i.verified_compliance or 75 for i in institutions)
            avg_reported = round(total_reported / total)
            avg_verified = round(total_verified / total)
            avg_gap = max(0, avg_reported - avg_verified)
        else:
            avg_reported = 91
            avg_verified = 63
            avg_gap = 28

        active_inspectors = db.query(Telemetry).count() or 3
        active_alerts = db.query(Alert).filter(Alert.acknowledged == False).count()

        return {
            "totalInstitutions": 1248,
            "trackedInSystem": total,
            "auditsThisMonth": 142,
            "criticalEntities": critical_count,
            "warningEntities": warning_count,
            "reportedComplianceAvg": avg_reported,
            "verifiedComplianceAvg": avg_verified,
            "avgRealityGap": avg_gap,
            "pendingFollowUps": 18,
            "activeInspectors": active_inspectors,
            "activeAlertsCount": active_alerts,
        }

    def get_trends(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {"month": "May 2023", "reported": 96, "verified": 88, "realityGap": 8},
            {"month": "Jun 2023", "reported": 94, "verified": 84, "realityGap": 10},
            {"month": "Jul 2023", "reported": 95, "verified": 81, "realityGap": 14},
            {"month": "Aug 2023", "reported": 93, "verified": 76, "realityGap": 17},
            {"month": "Sep 2023", "reported": 94, "verified": 72, "realityGap": 22},
            {"month": "Oct 2023", "reported": 93, "verified": 67, "realityGap": 26},
        ]

    def get_categories(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {"category": "Staff Physical Presence", "avgGap": 34, "flaggedCount": 42, "color": "#dc2626"},
            {"category": "Beneficiary Attendance & Meals", "avgGap": 29, "flaggedCount": 38, "color": "#ea580c"},
            {"category": "Infrastructure & Labs", "avgGap": 22, "flaggedCount": 29, "color": "#f59e0b"},
            {"category": "Equipment & Medical Stock", "avgGap": 18, "flaggedCount": 19, "color": "#3b82f6"},
            {"category": "Safety & Sanitation Protocols", "avgGap": 12, "flaggedCount": 14, "color": "#10b981"},
        ]

analytics_service = AnalyticsService()
