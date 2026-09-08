import os
import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.institution import Institution

logger = logging.getLogger(__name__)

class AIService:
    def analyze_discrepancy(self, db: Session, payload: dict) -> Dict[str, Any]:
        inst_id = payload.get("institutionId")
        inst = db.query(Institution).filter(Institution.id == inst_id).first() if inst_id else None

        name = (inst.name if inst else None) or payload.get("name") or "ABC Welfare Centre"
        inst_type = (inst.type if inst else None) or payload.get("type") or "Welfare"
        location = (inst.address if inst else None) or payload.get("location") or "Navi Mumbai, Maharashtra"

        rep_comp = (inst.reported_compliance if inst else None) if inst and inst.reported_compliance is not None else payload.get("reportedCompliance", 91)
        ver_comp = (inst.verified_compliance if inst else None) if inst and inst.verified_compliance is not None else payload.get("verifiedCompliance", 63)
        gap = (inst.reality_gap if inst else None) if inst and inst.reality_gap is not None else max(0, rep_comp - ver_comp)

        staff_rep = (inst.active_staff_reported if inst else None) or payload.get("staffReported", 12)
        staff_ver = (inst.active_staff_verified if inst else None) or payload.get("staffVerified", 7)
        ben_rep = (inst.beneficiaries_reported if inst else None) or payload.get("beneficiariesReported", 85)
        ben_ver = (inst.beneficiaries_verified if inst else None) or payload.get("beneficiariesVerified", 51)
        notes = (inst.facility_notes if inst else None) or payload.get("facilityNotes") or "North wing closed for unrecorded maintenance."

        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")

                prompt = f"""You are Nirikshan AI, an advanced state-level institutional auditing and ground reality discrepancy analysis intelligence engine for the Maharashtra Government Project Management Unit (PMU).
Analyze the following ground audit discrepancy:
- Institution: {name} ({inst_type})
- Location: {location}
- Self-Reported Compliance: {rep_comp}%
- Field-Verified Compliance: {ver_comp}%
- Reality Gap: {gap}%
- Active Staff: Reported {staff_rep}, Physically Verified {staff_ver} (Delta: -{staff_rep - staff_ver})
- Beneficiaries: Reported {ben_rep}, Physically Verified {ben_ver} (Delta: -{ben_rep - ben_ver})
- Field Inspector Observation: "{notes}"

Return ONLY a valid JSON object with the following structure:
{{
  "severity": "CRITICAL" | "HIGH" | "MODERATE",
  "executiveSummary": "Concise 2-sentence executive briefing for the PMU Director.",
  "rootCauses": ["factor 1", "factor 2", "factor 3"],
  "financialRiskEstimate": "Estimated grant leakage / misallocation description",
  "targetedAuditChecklist": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "recommendedAction": "Immediate administrative recommendation",
  "formalInquiryDraft": "A brief formal administrative query letter draft to the head of the institution requesting justification within 72 hours."
}}"""

                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                raw_text = response.text or ""
                parsed = json.loads(raw_text)
                return {
                    "success": True,
                    "source": "gemini-1.5-flash",
                    "data": parsed
                }
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back to rule engine: {e}")

        # Deterministic rule engine fallback
        staff_delta = max(0, staff_rep - staff_ver)
        ben_delta = max(0, ben_rep - ben_ver)
        is_severe = gap >= 20 or staff_delta >= 4
        severity = "CRITICAL" if is_severe else "HIGH" if gap >= 10 else "MODERATE"

        monthly_leakage = (staff_delta * 28000 + ben_delta * 3200)

        fallback_analysis = {
            "severity": severity,
            "executiveSummary": f"Audit reveals an acute Reality Gap of {gap}% at {name}. Physical head-count established {staff_delta} missing duty personnel and an unaccounted deficit of {ben_delta} beneficiaries versus claims submitted for state subsidy.",
            "rootCauses": [
                f"Phantom duty roster allocation: {staff_delta} staff absent with unrecorded leaves or ghost registrations.",
                f"Inflated beneficiary requisition: Claimed {ben_rep} daily meals/care units while physical occupancy was only {ben_ver}.",
                "Unauthorized physical facility closure during mandatory operational hours." if ("closed" in notes.lower() or "locked" in notes.lower()) else "Discrepancies in biometric logging synchronization."
            ],
            "financialRiskEstimate": f"High risk of state subsidy leakage calculated at ~₹{monthly_leakage:,}/month in unverified salary grants and care stipends.",
            "targetedAuditChecklist": [
                "Perform mandatory biometric audit matching GPS timestamp against shift logs.",
                "Cross-verify food ration delivery invoices against observed occupancy roll.",
                "Inspect dispensary medication dispensing logs with signed doctor prescriptions.",
                "Interview on-duty supervisor regarding unauthorized wing shutdown."
            ],
            "recommendedAction": "Immediate issuance of 72-hour Statutory Show-Cause Notice & provisional escrow hold on Q4 state subsidy tranches." if is_severe else "Order flying squad follow-up verification within 14 business days.",
            "formalInquiryDraft": f"To: The Managing Administrator, {name}\nSubject: Show Cause Notice - Discrepancy in Q3 Self-Reported vs. Physical Ground Inspection Audit (NIR-8821)\n\nDuring an unannounced field audit conducted under Nirikshan PMU oversight, physical ground inspection established a Reality Gap of {gap}%. The verified staff attendance was {staff_ver} (against {staff_rep} declared), and active beneficiaries numbered {ben_ver} (against {ben_rep} declared).\n\nYou are hereby directed to provide written justification along with geo-tagged biometric attendance logs within seventy-two (72) hours of receipt of this notice, failing which administrative penal action under State Welfare Grant Rules will be initiated.\n\nBy Order of Director, State PMU Oversight Cell"
        }

        return {
            "success": True,
            "source": "deterministic-rules-engine",
            "data": fallback_analysis
        }

ai_service = AIService()
