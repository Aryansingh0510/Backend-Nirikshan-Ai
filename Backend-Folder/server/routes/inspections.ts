import { Router } from 'express';
import { db } from '../db';

const router = Router();

// POST /api/inspections/dispatch - Dispatch surprise audit
router.post('/dispatch', (req, res) => {
  try {
    const { institutionId, inspectorName, urgency } = req.body;
    if (!institutionId) {
      return res.status(400).json({ success: false, error: 'institutionId is required' });
    }

    const result = db.dispatchSurpriseInspection(
      institutionId,
      inspectorName || 'Field Inspector Priya Nair (INSP-492)',
      urgency || 'Immediate'
    );

    res.json({
      success: true,
      message: `Surprise audit dispatched for ${result.institution.name}`,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/inspections/submit - Submit completed field inspection
router.post('/submit', (req, res) => {
  try {
    const {
      institutionId,
      inspectorId,
      inspectorName,
      observedStaff,
      observedBeneficiaries,
      facilityObservedStatus,
      notes,
      evidencePhotoUrls,
      inspectorLat,
      inspectorLng,
    } = req.body;

    if (!institutionId || observedStaff === undefined) {
      return res.status(400).json({
        success: false,
        error: 'institutionId and observedStaff are required',
      });
    }

    const result = db.submitInspection({
      institutionId,
      inspectorId: inspectorId || 'INSP-492',
      inspectorName: inspectorName || 'Inspector Priya Nair',
      observedStaff: Number(observedStaff),
      observedBeneficiaries: observedBeneficiaries !== undefined ? Number(observedBeneficiaries) : undefined,
      facilityObservedStatus,
      notes: notes || 'Inspection completed via mobile application.',
      evidencePhotoUrls: Array.isArray(evidencePhotoUrls) ? evidencePhotoUrls : [],
      inspectorLat: Number(inspectorLat) || 19.033,
      inspectorLng: Number(inspectorLng) || 73.0297,
    });

    res.json({
      success: true,
      message: 'Inspection submitted successfully and cryptographically recorded.',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
