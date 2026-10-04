const express = require('express');
const router = express.Router();
const {
  createReview,
  checkOrderIdAvailability,
  getReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
  exportReviewsCSV,
  exportReviewsXLSX,
  getReviewStats,
} = require('../controllers/reviewController');
const { protectAdmin } = require('../middleware/auth');
const { validateReview } = require('../middleware/validators');
const { reviewSubmitLimiter } = require('../middleware/rateLimiter');

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Safe optional admin middleware to identify admin in getReviews without hard-rejecting
const optionalAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'pillowala_jwt_super_secret_dev_key_2026'
      );
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
      }
    } catch {
      // Stale or invalid token, proceed without admin context
    }
  }
  next();
};

// Admin stats & export (place before :id to prevent matching 'export' as id)
router.get('/stats', protectAdmin, getReviewStats);

router.get('/export', protectAdmin, (req, res, next) => {
  if (req.query.format === 'xlsx') {
    return exportReviewsXLSX(req, res, next);
  }
  return exportReviewsCSV(req, res, next);
});

// Public / Protected review endpoints
router.route('/')
  .post(reviewSubmitLimiter, validateReview, createReview)
  .get(optionalAdmin, getReviews);

// Public Order ID duplicate checker
router.get('/check-order/:orderId', checkOrderIdAvailability);

router.route('/:id')
  .get(getReviewById)
  .delete(protectAdmin, deleteReview);

router.patch('/:id/status', protectAdmin, updateReviewStatus);

module.exports = router;
