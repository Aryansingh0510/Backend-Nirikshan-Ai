import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/analytics/overview - Overall KPIs
router.get('/overview', (req, res) => {
  try {
    const stats = db.getOverviewStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/trends - 6 month timeline
router.get('/trends', (req, res) => {
  try {
    const trends = [
      { month: 'May 2023', reported: 96, verified: 88, realityGap: 8 },
      { month: 'Jun 2023', reported: 94, verified: 84, realityGap: 10 },
      { month: 'Jul 2023', reported: 95, verified: 81, realityGap: 14 },
      { month: 'Aug 2023', reported: 93, verified: 76, realityGap: 17 },
      { month: 'Sep 2023', reported: 94, verified: 72, realityGap: 22 },
      { month: 'Oct 2023', reported: 93, verified: 67, realityGap: 26 },
    ];
    res.json({ success: true, data: trends });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/categories - Discrepancy by category
router.get('/categories', (req, res) => {
  try {
    const categories = [
      { category: 'Staff Physical Presence', avgGap: 34, flaggedCount: 42, color: '#dc2626' },
      { category: 'Beneficiary Attendance & Meals', avgGap: 29, flaggedCount: 38, color: '#ea580c' },
      { category: 'Infrastructure & Labs', avgGap: 22, flaggedCount: 29, color: '#f59e0b' },
      { category: 'Equipment & Medical Stock', avgGap: 18, flaggedCount: 19, color: '#3b82f6' },
      { category: 'Safety & Sanitation Protocols', avgGap: 12, flaggedCount: 14, color: '#10b981' },
    ];
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
