const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validators');

const optionalAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protectAdmin(req, res, next);
  }
  next();
};

router.route('/')
  .get(optionalAdmin, getCategories)
  .post(protectAdmin, validateCategory, createCategory);

router.route('/:idOrSlug')
  .get(getCategoryById)
  .patch(protectAdmin, updateCategory)
  .delete(protectAdmin, deleteCategory);

module.exports = router;
