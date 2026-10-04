const express = require('express');
const router = express.Router();
const {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protectAdmin } = require('../middleware/auth');
const { validateOffer } = require('../middleware/validators');

const optionalAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protectAdmin(req, res, next);
  }
  next();
};

router.route('/')
  .get(optionalAdmin, getOffers)
  .post(protectAdmin, validateOffer, createOffer);

router.route('/:id')
  .get(getOfferById)
  .patch(protectAdmin, updateOffer)
  .delete(protectAdmin, deleteOffer);

module.exports = router;
