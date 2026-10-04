const { body, query, validationResult } = require('express-validator');

// Middleware to check validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Review submission validator
const validateReview = [
  body('purchasePlatform')
    .trim()
    .toLowerCase()
    .isIn(['amazon', 'flipkart', 'meesho'])
    .withMessage('Purchase platform must be amazon, flipkart, or meesho'),

  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID'),

  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('reviewText')
    .optional()
    .trim(),

  body('orderId')
    .optional()
    .trim(),

  body('customerPhone')
    .optional()
    .trim(),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('customerEmail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('customerName')
    .optional()
    .trim(),

  body('imageUrl')
    .optional()
    .trim(),

  validate,
];

// Admin login validator
const validateAdminLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid admin email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
];

// Product creation validator
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('marketplace')
    .trim()
    .toLowerCase()
    .isIn(['amazon', 'flipkart', 'meesho'])
    .withMessage('Marketplace must be amazon, flipkart, or meesho'),

  body('externalUrl')
    .trim()
    .notEmpty()
    .withMessage('External marketplace URL is required'),

  validate,
];

// Category validator
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),

  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required'),

  validate,
];

// Offer validator
const validateOffer = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Offer title is required'),

  body('discountText')
    .trim()
    .notEmpty()
    .withMessage('Discount text is required'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),

  validate,
];

module.exports = {
  validateReview,
  validateAdminLogin,
  validateProduct,
  validateCategory,
  validateOffer,
};
