import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/institutions - Filterable list
router.get('/', (req, res) => {
  try {
    const { search, type, status, zone } = req.query;
    const items = db.getInstitutions({
      search: search ? String(search) : undefined,
      type: type ? String(type) : undefined,
      status: status ? String(status) : undefined,
      zone: zone ? String(zone) : undefined,
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/institutions/:id - Single institution
router.get('/:id', (req, res) => {
  try {
    const inst = db.getInstitutionById(req.params.id);
    if (!inst) {
      return res.status(404).json({ success: false, error: 'Institution not found' });
    }
    res.json({ success: true, data: inst });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/institutions - Add institution to registry
router.post('/', (req, res) => {
  try {
    const newInst = db.createInstitution(req.body);
    res.status(201).json({ success: true, data: newInst });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/institutions/:id - Update institution
router.patch('/:id', (req, res) => {
  try {
    const updated = db.updateInstitution(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Institution not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
