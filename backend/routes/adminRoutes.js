const express = require('express');
const router = express.Router();
const { 
  loginAdmin, 
  getAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword 
} = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/auth');
const { validateAdminLogin } = require('../middleware/validators');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

router.post('/login', adminLoginLimiter, validateAdminLogin, loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.put('/change-password', protectAdmin, changeAdminPassword);

module.exports = router;
