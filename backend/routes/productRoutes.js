const express = require('express');
const router = express.Router();
const {
  scrapeProductData,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  matchSleepSurvey,
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validators');

// Optional admin middleware to allow admin to view inactive products
const optionalAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protectAdmin(req, res, next);
  }
  next();
};

router.post('/scrape', protectAdmin, scrapeProductData);
router.post('/sleep-match', matchSleepSurvey);

router.route('/')
  .get(optionalAdmin, getProducts)
  .post(protectAdmin, validateProduct, createProduct);

router.route('/:id')
  .get(getProductById)
  .patch(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

module.exports = router;
