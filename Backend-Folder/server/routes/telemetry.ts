import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/telemetry/inspectors - Active field officers
router.get('/inspectors', (req, res) => {
  try {
    const list = db.getTelemetry();
    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/telemetry/ping - Real-time location ping & geofence verification
router.post('/ping', (req, res) => {
  try {
    const { inspectorId, lat, lng, accuracyMeters } = req.body;
    if (!inspectorId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'inspectorId, lat, and lng are required',
      });
    }

    const updated = db.pingTelemetry(
      inspectorId,
      Number(lat),
      Number(lng),
      accuracyMeters ? Number(accuracyMeters) : undefined
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inspector not found' });
    }

    res.json({
      success: true,
      message: 'Telemetry updated',
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
