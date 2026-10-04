const Offer = require('../models/Offer');

// @desc    Get offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res, next) => {
  try {
    const filter = {};

    if (!req.admin) {
      filter.active = true;
      filter.endDate = { $gte: new Date() };
    } else if (req.query.active !== undefined && req.query.active !== 'all') {
      filter.active = req.query.active === 'true';
    }

    const offers = await Offer.find(filter)
      .populate('productIds', 'name price images marketplace externalUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get offer by ID
// @route   GET /api/offers/:id
// @access  Public
const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('productIds');
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }
    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create offer
// @route   POST /api/offers
// @access  Private (Admin)
const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PATCH /api/offers/:id
// @access  Private (Admin)
const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('productIds');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private (Admin)
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
