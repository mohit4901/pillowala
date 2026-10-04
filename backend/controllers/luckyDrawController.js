const LuckyDraw = require('../models/LuckyDraw');
const Review = require('../models/Review');

// Helper to mask phone numbers for customer privacy (e.g. 9876543210 -> +91 98*** **210)
const maskPhoneNumber = (phone) => {
  if (!phone) return 'Verified Customer';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length >= 10) {
    const start = clean.slice(-10, -7);
    const end = clean.slice(-3);
    return `+91 ${start}****${end}`;
  }
  return `${phone.slice(0, 2)}****${phone.slice(-2)}`;
};

// Helper to format Month string "YYYY-MM" to readable label "September 2026"
const formatMonthLabel = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) {
    const now = new Date();
    return now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

// Official prize titles for 1st, 2nd, and 3rd positions (Total ₹30,000 Cash Pool)
const DEFAULT_PRIZES = {
  1: {
    prizeTitle: '1st Prize: ₹15,000 Direct Cash Prize',
    prizeValue: '₹15,000 Cash',
  },
  2: {
    prizeTitle: '2nd Prize: ₹10,000 Direct Cash Prize',
    prizeValue: '₹10,000 Cash',
  },
  3: {
    prizeTitle: '3rd Prize: ₹5,000 Direct Cash Prize',
    prizeValue: '₹5,000 Cash',
  },
};

// @desc    Get current month's published Lucky Draw winners (Public)
// @route   GET /api/luckydraw/current
// @access  Public
const getCurrentDraw = async (req, res, next) => {
  try {
    // 1. Fetch latest published draw
    const latestDraw = await LuckyDraw.findOne({ status: 'published' })
      .sort({ month: -1, drawDate: -1 })
      .lean();

    // 2. Compute current month statistics
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const totalEntriesThisMonth = await Review.countDocuments({
      createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });

    // Recent 5 verified review participants (with masked names & phones)
    const recentParticipants = await Review.find({
      createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('customerName customerPhone purchasePlatform rating productName createdAt imageUrl')
      .lean();

    const formattedRecent = recentParticipants.map((p) => ({
      customerName: p.customerName ? `${p.customerName.charAt(0)}${'*'.repeat(Math.max(p.customerName.length - 2, 2))}${p.customerName.slice(-1)}` : 'Verified Buyer',
      customerPhoneMasked: maskPhoneNumber(p.customerPhone),
      purchasePlatform: p.purchasePlatform,
      rating: p.rating,
      productName: p.productName,
      createdAt: p.createdAt,
      hasProof: Boolean(p.imageUrl),
    }));

    res.status(200).json({
      success: true,
      data: {
        draw: latestDraw || null,
        currentMonthKey,
        currentMonthLabel: formatMonthLabel(currentMonthKey),
        nextDrawDate: endOfCurrentMonth,
        totalEntriesThisMonth,
        recentParticipants: formattedRecent,
        defaultPrizes: DEFAULT_PRIZES,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get archive of past monthly draws
// @route   GET /api/luckydraw/history
// @access  Public
const getDrawHistory = async (req, res, next) => {
  try {
    const draws = await LuckyDraw.find({ status: 'published' })
      .sort({ month: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: draws.length,
      data: draws,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eligible review entries for a month (Admin)
// @route   GET /api/luckydraw/admin/eligible
// @access  Private (Admin)
const getAdminEligible = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const [year, monthNum] = month.split('-').map(Number);

    const startDate = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const totalInMonth = await Review.countDocuments(query);
    const withScreenshot = await Review.countDocuments({
      ...query,
      imageUrl: { $exists: true, $ne: '' },
    });
    const approvedCount = await Review.countDocuments({
      ...query,
      status: 'approved',
    });

    // Check if draw already exists for this month
    const existingDraw = await LuckyDraw.findOne({ month }).lean();

    // Breakdown by platform
    const platformBreakdown = await Review.aggregate([
      { $match: query },
      { $group: { _id: '$purchasePlatform', count: { $sum: 1 } } },
    ]);

    // Sample eligible reviews
    const eligibleReviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('productId', 'name images price')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        month,
        monthLabel: formatMonthLabel(month),
        totalInMonth,
        withScreenshot,
        approvedCount,
        existingDraw,
        platformBreakdown,
        sampleEligible: eligibleReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Conduct Random Month-End Draw (1st, 2nd, 3rd positions)
// @route   POST /api/luckydraw/admin/draw
// @access  Private (Admin)
const conductDraw = async (req, res, next) => {
  try {
    const month = req.body.month || new Date().toISOString().slice(0, 7);
    const [year, monthNum] = month.split('-').map(Number);

    const startDate = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Eligible query: Reviews submitted in that month.
    // Prefer reviews with screenshot proof, or fallback to all reviews in that month
    let eligibleReviews = await Review.find({
      createdAt: { $gte: startDate, $lte: endDate },
      imageUrl: { $exists: true, $ne: '' },
    }).lean();

    if (eligibleReviews.length < 3) {
      eligibleReviews = await Review.find({
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();
    }

    // If still less than 3 in this month, pull from any recent reviews to allow demoing
    if (eligibleReviews.length < 3) {
      eligibleReviews = await Review.find({}).limit(50).lean();
    }

    if (eligibleReviews.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No reviews found to conduct lucky draw. Please ensure customer reviews exist.',
      });
    }

    // Cryptographically secure Fisher-Yates fair random shuffle
    const crypto = require('crypto');
    const shuffled = [...eligibleReviews];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select 3 unique winners
    const selectedReviews = shuffled.slice(0, Math.min(3, shuffled.length));

    // If fewer than 3 reviews exist in total, fill remaining slots
    while (selectedReviews.length < 3 && selectedReviews.length > 0) {
      selectedReviews.push(selectedReviews[0]);
    }

    const customPrizes = req.body.prizes || {};

    const winners = selectedReviews.map((rev, index) => {
      const position = index + 1;
      const prizeInfo = customPrizes[position] || DEFAULT_PRIZES[position];
      return {
        position,
        prizeTitle: prizeInfo.prizeTitle,
        prizeValue: prizeInfo.prizeValue,
        reviewId: rev._id,
        customerName: rev.customerName || 'Verified Buyer',
        customerPhone: rev.customerPhone || '',
        customerPhoneMasked: maskPhoneNumber(rev.customerPhone),
        customerEmail: rev.customerEmail || '',
        orderId: rev.orderId || 'N/A',
        purchasePlatform: rev.purchasePlatform,
        productName: rev.productName,
        imageUrl: rev.imageUrl || '',
        rating: rev.rating || 5,
      };
    });

    // Reset previous winners flags for this month if existing draw
    await Review.updateMany(
      { luckyDrawMonth: month },
      { $set: { isLuckyDrawWinner: false, luckyDrawPosition: null, luckyDrawMonth: null } }
    );

    // Save or update LuckyDraw document
    const drawDoc = await LuckyDraw.findOneAndUpdate(
      { month },
      {
        month,
        monthLabel: formatMonthLabel(month),
        drawDate: new Date(),
        totalEligibleParticipants: eligibleReviews.length,
        winners,
        status: req.body.status || 'published',
        notes: req.body.notes || `Month-end random draw completed for ${formatMonthLabel(month)}.`,
        drawnBy: req.admin?._id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Update the winning reviews in database
    for (const w of winners) {
      await Review.findByIdAndUpdate(w.reviewId, {
        isLuckyDrawWinner: true,
        luckyDrawPosition: w.position,
        luckyDrawMonth: month,
      });
    }

    res.status(200).json({
      success: true,
      message: `Lucky Draw successfully conducted for ${formatMonthLabel(month)}! 3 Winners selected.`,
      data: drawDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle published status of a Lucky Draw
// @route   PATCH /api/luckydraw/admin/:id/publish
// @access  Private (Admin)
const togglePublishStatus = async (req, res, next) => {
  try {
    const draw = await LuckyDraw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky draw not found' });
    }

    draw.status = draw.status === 'published' ? 'draft' : 'published';
    await draw.save();

    res.status(200).json({
      success: true,
      message: `Lucky Draw status changed to ${draw.status}`,
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Lucky Draw and reset flags (Admin)
// @route   DELETE /api/luckydraw/admin/:id
// @access  Private (Admin)
const deleteDraw = async (req, res, next) => {
  try {
    const draw = await LuckyDraw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky draw not found' });
    }

    // Reset winning review flags
    await Review.updateMany(
      { luckyDrawMonth: draw.month },
      { $set: { isLuckyDrawWinner: false, luckyDrawPosition: null, luckyDrawMonth: null } }
    );

    await LuckyDraw.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lucky draw deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentDraw,
  getDrawHistory,
  getAdminEligible,
  conductDraw,
  togglePublishStatus,
  deleteDraw,
};
