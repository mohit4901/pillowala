const Review = require('../models/Review');
const Product = require('../models/Product');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

// Helper to build MongoDB query from request params
const buildReviewFilter = (query) => {
  const filter = {};

  // Status filter
  if (query.status && query.status !== 'all') {
    filter.status = query.status;
  }

  // Marketplace / Purchase platform filter
  if (query.purchasePlatform && query.purchasePlatform !== 'all') {
    filter.purchasePlatform = query.purchasePlatform.toLowerCase();
  }

  // Product filter
  if (query.productId && query.productId !== 'all') {
    filter.productId = query.productId;
  }

  // Rating filter
  if (query.rating && query.rating !== 'all') {
    filter.rating = Number(query.rating);
  }

  // Date range filter
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      filter.createdAt.$gte = start;
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  // Search keyword filter
  if (query.search && query.search.trim() !== '') {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { reviewText: searchRegex },
      { customerName: searchRegex },
      { customerEmail: searchRegex },
      { customerPhone: searchRegex },
      { orderId: searchRegex },
      { productName: searchRegex },
    ];
  }

  return filter;
};

// @desc    Submit a new customer review with screenshot proof
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderId,
      purchasePlatform,
      productId,
      productName,
      reviewText,
      rating,
      imageUrl,
    } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'The selected product was not found.',
      });
    }

    // Check if Order ID has already been submitted
    if (orderId && orderId.trim()) {
      const cleanOrderId = orderId.trim();
      const escapedOrderId = cleanOrderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingOrder = await Review.findOne({
        orderId: { $regex: new RegExp(`^${escapedOrderId}$`, 'i') },
      });

      if (existingOrder) {
        return res.status(400).json({
          success: false,
          code: 'ORDER_ALREADY_USED',
          message: `Ye Order ID (${cleanOrderId}) pehle se submit ho chuki hai! Ek order ID se sirf 1 review aur 1 lucky draw entry allow hai.`,
        });
      }
    }

    const review = await Review.create({
      customerName: customerName && customerName.trim() ? customerName.trim() : 'Verified Buyer',
      customerEmail: customerEmail && customerEmail.trim() ? customerEmail.trim() : '',
      customerPhone: customerPhone && customerPhone.trim() ? customerPhone.trim() : '',
      orderId: orderId && orderId.trim() ? orderId.trim() : '',
      purchasePlatform: purchasePlatform.toLowerCase(),
      productId,
      productName: productName || product.name,
      reviewText: reviewText && reviewText.trim() ? reviewText.trim() : 'Marketplace Review Verified with Screenshot',
      rating: Number(rating) || 5,
      imageUrl: imageUrl || '',
      status: 'pending', // Pending admin approval / reward verification
    });

    const totalCount = await Review.countDocuments();

    res.status(201).json({
      success: true,
      message: `Thank you! Your review has been recorded as Review #${totalCount} and is entered into the milestone cash draws!`,
      data: {
        ...review.toObject(),
        reviewNumber: totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews with pagination and filtering
// @route   GET /api/reviews
// @access  Public (approved only unless admin requested)
const getReviews = async (req, res, next) => {
  try {
    const filter = buildReviewFilter(req.query);

    // If request has no admin token and no specific status was queried, show only approved
    if (!req.admin && !req.query.status) {
      filter.status = 'approved';
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('productId', 'name images price marketplace externalUrl')
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public / Admin
const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('productId');
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Approve / Reject)
// @route   PATCH /api/reviews/:id/status
// @access  Private (Admin)
const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, approved, or rejected',
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Review marked as ${status}`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export reviews as CSV
// @route   GET /api/reviews/export?format=csv
// @access  Private (Admin)
const exportReviewsCSV = async (req, res, next) => {
  try {
    const filter = buildReviewFilter(req.query);
    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    const formattedData = reviews.map((r) => ({
      'Review ID': r._id.toString(),
      Date: new Date(r.createdAt).toISOString().split('T')[0],
      'Order ID': r.orderId || 'N/A',
      'Customer Name': r.customerName || 'Anonymous',
      'Phone / WhatsApp': r.customerPhone || 'N/A',
      'Customer Email': r.customerEmail || 'N/A',
      'Purchase Platform': r.purchasePlatform.toUpperCase(),
      Product: r.productName,
      Rating: r.rating,
      'Review Comments': (r.reviewText || '').replace(/\r?\n|\r/g, ' '),
      'Screenshot URL': r.imageUrl || 'None',
      Status: r.status.toUpperCase(),
    }));

    const json2csvParser = new Parser({
      fields: [
        'Review ID',
        'Date',
        'Order ID',
        'Customer Name',
        'Phone / WhatsApp',
        'Customer Email',
        'Purchase Platform',
        'Product',
        'Rating',
        'Review Comments',
        'Screenshot URL',
        'Status',
      ],
    });
    const csv = json2csvParser.parse(formattedData);

    const timestamp = new Date().toISOString().split('T')[0];
    res.header('Content-Type', 'text/csv');
    res.attachment(`pillowala-reviews-${timestamp}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Export reviews as XLSX (Excel)
// @route   GET /api/reviews/export?format=xlsx
// @access  Private (Admin)
const exportReviewsXLSX = async (req, res, next) => {
  try {
    const filter = buildReviewFilter(req.query);
    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    const formattedData = reviews.map((r) => ({
      'Review ID': r._id.toString(),
      Date: new Date(r.createdAt).toISOString().split('T')[0],
      'Order ID': r.orderId || 'N/A',
      'Customer Name': r.customerName || 'Anonymous',
      'Phone / WhatsApp': r.customerPhone || 'N/A',
      'Customer Email': r.customerEmail || 'N/A',
      'Purchase Platform': r.purchasePlatform.toUpperCase(),
      Product: r.productName,
      Rating: r.rating,
      'Review Comments': r.reviewText || '',
      'Screenshot URL': r.imageUrl || 'None',
      Status: r.status.toUpperCase(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths for clean Excel layout
    worksheet['!cols'] = [
      { wch: 26 }, // Review ID
      { wch: 12 }, // Date
      { wch: 22 }, // Order ID
      { wch: 20 }, // Customer Name
      { wch: 18 }, // Phone
      { wch: 24 }, // Email
      { wch: 16 }, // Platform
      { wch: 32 }, // Product
      { wch: 8 },  // Rating
      { wch: 35 }, // Review Comments
      { wch: 45 }, // Screenshot URL
      { wch: 12 }, // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reviews');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const timestamp = new Date().toISOString().split('T')[0];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=pillowala-reviews-${timestamp}.xlsx`
    );
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Review statistics and distribution for Admin Dashboard
// @route   GET /api/reviews/stats
// @access  Private (Admin)
const getReviewStats = async (req, res, next) => {
  try {
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const approvedReviews = await Review.countDocuments({ status: 'approved' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });

    // Reviews this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const reviewsThisMonth = await Review.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Average rating
    const avgRatingAgg = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const averageRating = avgRatingAgg.length > 0 ? Number(avgRatingAgg[0].avgRating.toFixed(2)) : 0;

    // Rating breakdown (1 to 5 stars)
    const ratingBreakdownAgg = await Review.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
      const match = ratingBreakdownAgg.find((r) => r._id === star);
      return {
        star: `${star} Stars`,
        count: match ? match.count : 0,
        percentage: totalReviews > 0 ? Math.round(((match ? match.count : 0) / totalReviews) * 100) : 0,
      };
    });

    // Marketplace breakdown
    const marketplaceAgg = await Review.aggregate([
      { $group: { _id: '$purchasePlatform', count: { $sum: 1 } } },
    ]);
    const marketplaceDistribution = ['amazon', 'flipkart', 'meesho'].map((platform) => {
      const match = marketplaceAgg.find((m) => m._id === platform);
      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        key: platform,
        count: match ? match.count : 0,
        percentage: totalReviews > 0 ? Math.round(((match ? match.count : 0) / totalReviews) * 100) : 0,
      };
    });

    // Monthly reviews trend (last 6 calendar months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Review.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyReviews = monthlyAgg.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      reviews: item.count,
      avgRating: Number(item.avgRating.toFixed(1)),
    }));

    // Product-wise review counts (top 8)
    const productAgg = await Review.aggregate([
      {
        $group: {
          _id: '$productName',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const productReviews = productAgg.map((item) => ({
      productName: item._id,
      count: item.count,
      avgRating: Number(item.avgRating.toFixed(1)),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        reviewsThisMonth,
        averageRating,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        ratingDistribution,
        marketplaceDistribution,
        monthlyReviews,
        productReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if an order ID is already registered in the system
// @route   GET /api/reviews/check-order/:orderId
// @access  Public
const checkOrderIdAvailability = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId || !orderId.trim()) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }
    const clean = orderId.trim();
    const escapedOrderId = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existing = await Review.findOne({
      orderId: { $regex: new RegExp(`^${escapedOrderId}$`, 'i') },
    }).select('orderId createdAt purchasePlatform customerName');

    if (existing) {
      return res.status(200).json({
        success: true,
        available: false,
        code: 'ORDER_ALREADY_USED',
        message: `Ye Order ID (${clean}) pehle se submit ho chuki hai!`,
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: 'Order ID is available.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  checkOrderIdAvailability,
  getReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
  exportReviewsCSV,
  exportReviewsXLSX,
  getReviewStats,
};

