import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/alerts - Filterable list of alerts
router.get('/', (req, res) => {
  try {
    const { severity } = req.query;
    const alerts = db.getAlerts(severity ? String(severity) : undefined);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/alerts/:id/acknowledge - Acknowledge an alert
router.post('/:id/acknowledge', (req, res) => {
  try {
    const acknowledged = db.acknowledgeAlert(req.params.id);
    if (!acknowledged) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    res.json({ success: true, message: `Alert ${req.params.id} acknowledged`, data: acknowledged });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/alerts - Create an alert manually
router.post('/', (req, res) => {
  try {
    const newAlert = db.createAlert(req.body);
    res.status(201).json({ success: true, data: newAlert });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
