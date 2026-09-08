import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../db';

const router = Router();

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// POST /api/ai/analyze-discrepancy
router.post('/analyze-discrepancy', async (req, res) => {
  try {
    const { institutionId } = req.body;
    const inst = institutionId ? db.getInstitutionById(institutionId) : null;

    const name = inst?.name || req.body.name || 'ABC Welfare Centre';
    const type = inst?.type || req.body.type || 'Welfare';
    const location = inst?.location || req.body.location || 'Navi Mumbai, Maharashtra';
    const reportedCompliance = inst?.reportedCompliance ?? req.body.reportedCompliance ?? 91;
    const verifiedCompliance = inst?.verifiedCompliance ?? req.body.verifiedCompliance ?? 63;
    const realityGap = inst?.realityGap ?? Math.max(0, reportedCompliance - verifiedCompliance);
    const staffReported = inst?.activeStaffReported ?? req.body.staffReported ?? 12;
    const staffVerified = inst?.activeStaffVerified ?? req.body.staffVerified ?? 7;
    const beneficiariesReported = inst?.beneficiariesReported ?? req.body.beneficiariesReported ?? 85;
    const beneficiariesVerified = inst?.beneficiariesVerified ?? req.body.beneficiariesVerified ?? 51;
    const facilityNotes = inst?.facilityNotes || req.body.facilityNotes || 'North wing closed for unrecorded maintenance.';

    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are Nirikshan AI, an advanced state-level institutional auditing and ground reality discrepancy analysis intelligence engine for the Maharashtra Government Project Management Unit (PMU).
Analyze the following ground audit discrepancy:
- Institution: ${name} (${type})
- Location: ${location}
- Self-Reported Compliance: ${reportedCompliance}%
- Field-Verified Compliance: ${verifiedCompliance}%
- Reality Gap: ${realityGap}%
- Active Staff: Reported ${staffReported}, Physically Verified ${staffVerified} (Delta: -${staffReported - staffVerified})
- Beneficiaries: Reported ${beneficiariesReported}, Physically Verified ${beneficiariesVerified} (Delta: -${beneficiariesReported - beneficiariesVerified})
- Field Inspector Observation: "${facilityNotes}"

Return a valid JSON object with the following structure:
{
  "severity": "CRITICAL" | "HIGH" | "MODERATE",
  "executiveSummary": "Concise 2-sentence executive briefing for the PMU Director.",
  "rootCauses": ["factor 1", "factor 2", "factor 3"],
  "financialRiskEstimate": "Estimated grant leakage / misallocation description",
  "targetedAuditChecklist": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "recommendedAction": "Immediate administrative recommendation (e.g. show cause notice, subsidy freeze, flying squad re-inspection)",
  "formalInquiryDraft": "A brief formal administrative query letter draft to the head of the institution requesting justification within 72 hours."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        try {
          const parsed = JSON.parse(rawText);
          return res.json({
            success: true,
            source: 'gemini-3.8-flash',
            data: parsed,
          });
        } catch {
          // Fall through to deterministic response if json parse fails
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to rule engine:', geminiError.message);
      }
    }

    // Rule-based deterministic analysis engine
    const staffDelta = Math.max(0, staffReported - staffVerified);
    const benDelta = Math.max(0, beneficiariesReported - beneficiariesVerified);
    const isSevere = realityGap >= 20 || staffDelta >= 4;

    const fallbackAnalysis = {
      severity: isSevere ? 'CRITICAL' : realityGap >= 10 ? 'HIGH' : 'MODERATE',
      executiveSummary: `Audit reveals an acute Reality Gap of ${realityGap}% at ${name}. Physical head-count established ${staffDelta} missing duty personnel and an unaccounted deficit of ${benDelta} beneficiaries versus claims submitted for state subsidy.`,
      rootCauses: [
        `Phantom duty roster allocation: ${staffDelta} staff absent with unrecorded leaves or ghost registrations.`,
        `Inflated beneficiary requisition: Claimed ${beneficiariesReported} daily meals/care units while physical occupancy was only ${beneficiariesVerified}.`,
        facilityNotes.includes('closed') || facilityNotes.includes('locked')
          ? 'Unauthorized physical facility closure during mandatory operational hours.'
          : 'Discrepancies in biometric logging synchronization.',
      ],
      financialRiskEstimate: `High risk of state subsidy leakage calculated at ~₹${(staffDelta * 28000 + benDelta * 3200).toLocaleString('en-IN')}/month in unverified salary grants and care stipends.`,
      targetedAuditChecklist: [
        'Perform mandatory biometric audit matching GPS timestamp against shift logs.',
        'Cross-verify food ration delivery invoices against observed occupancy roll.',
        'Inspect dispensary medication dispensing logs with signed doctor prescriptions.',
        'Interview on-duty supervisor regarding unauthorized wing shutdown.',
      ],
      recommendedAction: isSevere
        ? 'Immediate issuance of 72-hour Statutory Show-Cause Notice & provisional escrow hold on Q4 state subsidy tranches.'
        : 'Order flying squad follow-up verification within 14 business days.',
      formalInquiryDraft: `To: The Managing Administrator, ${name}\nSubject: Show Cause Notice - Discrepancy in Q3 Self-Reported vs. Physical Ground Inspection Audit (${inst?.id || 'NIR-8821'})\n\nDuring an unannounced field audit conducted under Nirikshan PMU oversight, physical ground inspection established a Reality Gap of ${realityGap}%. The verified staff attendance was ${staffVerified} (against ${staffReported} declared), and active beneficiaries numbered ${beneficiariesVerified} (against ${beneficiariesReported} declared).\n\nYou are hereby directed to provide written justification along with geo-tagged biometric attendance logs within seventy-two (72) hours of receipt of this notice, failing which administrative penal action under State Welfare Grant Rules will be initiated.\n\nBy Order of Director, State PMU Oversight Cell`,
    };

    res.json({
      success: true,
      source: 'deterministic-rules-engine',
      data: fallbackAnalysis,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
