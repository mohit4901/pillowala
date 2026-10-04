const express = require('express');
const router = express.Router();
const {
  getCurrentDraw,
  getDrawHistory,
  getAdminEligible,
  conductDraw,
  togglePublishStatus,
  deleteDraw,
} = require('../controllers/luckyDrawController');
const { protectAdmin } = require('../middleware/auth');

// Public routes
router.get('/current', getCurrentDraw);
router.get('/history', getDrawHistory);

// Admin routes
router.get('/admin/eligible', protectAdmin, getAdminEligible);
router.post('/admin/draw', protectAdmin, conductDraw);
router.patch('/admin/:id/publish', protectAdmin, togglePublishStatus);
router.delete('/admin/:id', protectAdmin, deleteDraw);

module.exports = router;
