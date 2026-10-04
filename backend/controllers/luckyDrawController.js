const crypto = require('crypto');
const LuckyDraw = require('../models/LuckyDraw');
const Review = require('../models/Review');

// Milestone Configurations
const MILESTONE_CONFIGS = {
  1: {
    milestoneNumber: 1,
    target: 600,
    prizeAmount: 5000,
    prizeTitle: '₹5,000 Direct Cash Prize',
    prizeLabel: 'Milestone 1 — 600 Verified Reviews',
    expectedParticipants: 600,
    excludedPreviousCount: 0,
    badge: 'Tier 1 // Silver',
    description: '1 lucky winner selected from 600 verified reviews receives ₹5,000 cash.',
  },
  2: {
    milestoneNumber: 2,
    target: 1000,
    prizeAmount: 10000,
    prizeTitle: '₹10,000 Direct Cash Prize',
    prizeLabel: 'Milestone 2 — 1,000 Verified Reviews',
    expectedParticipants: 999, // 1000 - 1 winner of Milestone 1
    excludedPreviousCount: 1,
    badge: 'Tier 2 // Gold',
    description: '1 lucky winner selected from 999 eligible reviews receives ₹10,000 cash (Milestone 1 winner is excluded).',
  },
  3: {
    milestoneNumber: 3,
    target: 1500,
    prizeAmount: 15000,
    prizeTitle: '₹15,000 Mega Cash Prize',
    prizeLabel: 'Milestone 3 — 1,500 Verified Reviews',
    expectedParticipants: 1498, // 1500 - 2 winners of Milestone 1 & 2
    excludedPreviousCount: 2,
    badge: 'Tier 3 // Diamond Mega',
    description: '1 mega lucky winner selected from 1,498 eligible reviews receives ₹15,000 cash (Milestone 1 & 2 winners are excluded).',
  },
};

// Helper to mask phone numbers for customer privacy (e.g. 9876543210 -> +91 98*** **210)
const maskPhoneNumber = (phone) => {
  if (!phone) return 'Verified Customer';
  const clean = String(phone).replace(/[^0-9]/g, '');
  if (clean.length >= 10) {
    const start = clean.slice(-10, -7);
    const end = clean.slice(-3);
    return `+91 ${start}****${end}`;
  }
  return `${phone.slice(0, 2)}****${phone.slice(-2)}`;
};

// Helper to mask customer names (e.g. Rohit Sharma -> R***t S.)
const maskCustomerName = (name) => {
  if (!name || name === 'Verified Customer' || name === 'Verified Buyer') return 'Verified Customer';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    const w = parts[0];
    return w.length > 2 ? `${w.charAt(0)}***${w.slice(-1)}` : `${w.charAt(0)}*`;
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  const maskedFirst = first.length > 2 ? `${first.charAt(0)}***${first.slice(-1)}` : `${first.charAt(0)}*`;
  return `${maskedFirst} ${last.charAt(0)}.`;
};

// @desc    Get Milestone Lucky Draw status, progress & published winners (Public)
// @route   GET /api/luckydraw/current
// @access  Public
const getCurrentDraw = async (req, res, next) => {
  try {
    // 1. Review Counts
    const totalSubmittedReviews = await Review.countDocuments({});
    const totalApprovedReviews = await Review.countDocuments({ status: 'approved' });
    const totalPendingReviews = await Review.countDocuments({ status: 'pending' });
    const nextReviewNumber = totalSubmittedReviews + 1;

    // 2. Fetch completed/published milestone draws
    const publishedDraws = await LuckyDraw.find({ status: 'published' })
      .sort({ milestoneNumber: 1 })
      .lean();

    const completedMap = {};
    publishedDraws.forEach((d) => {
      completedMap[d.milestoneNumber] = d;
    });

    // 3. Compute milestone cards status (based on total approved reviews, or total submitted for display)
    const milestones = [1, 2, 3].map((num) => {
      const cfg = MILESTONE_CONFIGS[num];
      const completedDraw = completedMap[num];

      let status = 'in_progress';
      if (completedDraw) {
        status = 'completed';
      } else if (totalApprovedReviews >= cfg.target) {
        status = 'unlocked';
      }

      const progressPercent = Math.min(100, Math.round((totalApprovedReviews / cfg.target) * 100));
      const remainingReviews = Math.max(0, cfg.target - totalApprovedReviews);

      return {
        ...cfg,
        status,
        progressPercent,
        remainingReviews,
        draw: completedDraw || null,
        winner: completedDraw ? completedDraw.winner : null,
      };
    });

    // Find active milestone
    let activeMilestone = milestones.find((m) => m.status !== 'completed') || null;

    // Recent submitted reviews queue (including all submitted so users see their live entry #)
    const recentReviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .select('customerName customerPhone purchasePlatform rating productName createdAt imageUrl status')
      .lean();

    const formattedRecent = recentReviews.map((r, idx) => {
      const entryNum = totalSubmittedReviews - idx;
      return {
        entryNumber: entryNum,
        entryLabel: `Review #${entryNum}`,
        customerName: maskCustomerName(r.customerName),
        customerPhoneMasked: maskPhoneNumber(r.customerPhone),
        purchasePlatform: r.purchasePlatform,
        rating: r.rating,
        productName: r.productName,
        createdAt: r.createdAt,
        hasProof: Boolean(r.imageUrl),
        status: r.status,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalSubmittedReviews,
        totalApprovedReviews,
        totalPendingReviews,
        nextReviewNumber,
        activeMilestoneNumber: activeMilestone ? activeMilestone.milestoneNumber : 3,
        activeMilestone,
        milestones,
        completedDrawsCount: publishedDraws.length,
        totalPrizePool: 30000,
        recentParticipants: formattedRecent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get archive of all completed milestone draws
// @route   GET /api/luckydraw/history
// @access  Public
const getDrawHistory = async (req, res, next) => {
  try {
    const draws = await LuckyDraw.find({ status: 'published' })
      .sort({ milestoneNumber: 1, drawDate: -1 })
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

// @desc    Get admin eligible metrics for all milestones (Admin)
// @route   GET /api/luckydraw/admin/eligible
// @access  Private (Admin)
const getAdminEligible = async (req, res, next) => {
  try {
    const totalApprovedReviews = await Review.countDocuments({ status: 'approved' });
    const totalPendingReviews = await Review.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments({});

    // Fetch all existing draws (draft or published)
    const existingDraws = await LuckyDraw.find({}).sort({ milestoneNumber: 1 }).lean();
    const existingMap = {};
    existingDraws.forEach((d) => {
      existingMap[d.milestoneNumber] = d;
    });

    // Previous winners list
    const previousWinners = [];
    existingDraws.forEach((d) => {
      if (d.winner && d.winner.reviewId) {
        previousWinners.push({
          milestoneNumber: d.milestoneNumber,
          milestoneTarget: d.milestoneTarget,
          prizeAmount: d.prizeAmount,
          drawDate: d.drawDate,
          winner: d.winner,
        });
      }
    });

    const previousWinnerReviewIds = previousWinners.map((pw) => pw.winner.reviewId.toString());

    // Milestones status
    const milestones = [1, 2, 3].map((num) => {
      const cfg = MILESTONE_CONFIGS[num];
      const existing = existingMap[num];

      // Eligible count calculation:
      // For Milestone 1: Min(totalApprovedReviews, 600)
      // For Milestone 2: Min(totalApprovedReviews, 1000) - (Milestone 1 winner) = 999 when at target
      // For Milestone 3: Min(totalApprovedReviews, 1500) - (Milestone 1 & 2 winners) = 1498 when at target
      let currentEligibleCount = 0;
      if (num === 1) {
        currentEligibleCount = Math.min(totalApprovedReviews, 600);
      } else if (num === 2) {
        const base = Math.min(totalApprovedReviews, 1000);
        currentEligibleCount = Math.max(0, base - (previousWinners.length >= 1 ? 1 : 0));
      } else if (num === 3) {
        const base = Math.min(totalApprovedReviews, 1500);
        currentEligibleCount = Math.max(0, base - (previousWinners.length >= 2 ? 2 : previousWinners.length));
      }

      return {
        ...cfg,
        isCompleted: Boolean(existing),
        draw: existing || null,
        status: existing ? existing.status : totalApprovedReviews >= cfg.target ? 'ready' : 'locked',
        currentEligibleCount,
        progressPercent: Math.min(100, Math.round((totalApprovedReviews / cfg.target) * 100)),
        canDraw: !existing && totalApprovedReviews >= cfg.target,
      };
    });

    // Sample eligible reviews for currently selectable milestone (or recent approved reviews)
    const sampleEligible = await Review.find({
      status: 'approved',
      _id: { $nin: previousWinnerReviewIds },
    })
      .sort({ createdAt: 1 }) // Earliest reviews first
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        totalApprovedReviews,
        totalPendingReviews,
        milestones,
        previousWinners,
        sampleEligible,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Conduct Milestone Lucky Draw (1 Winner per Milestone)
// @route   POST /api/luckydraw/admin/draw
// @access  Private (Admin)
const conductDraw = async (req, res, next) => {
  try {
    const milestoneNumber = Number(req.body.milestoneNumber);
    const adminOverride = Boolean(req.body.adminOverride); // Allows testing/demoing when reviews < target

    if (![1, 2, 3].includes(milestoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid milestone number. Must be 1 (600 reviews), 2 (1,000 reviews), or 3 (1,500 reviews).',
      });
    }

    const config = MILESTONE_CONFIGS[milestoneNumber];

    // Check if this milestone has already been conducted
    const existing = await LuckyDraw.findOne({ milestoneNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Milestone ${milestoneNumber} (${config.target} reviews) draw has already been conducted! Winner: ${existing.winner?.customerName || 'Recorded'}. You can reset it if you need to re-draw.`,
      });
    }

    // Sequence check: Milestone 2 requires Milestone 1 to be done; Milestone 3 requires Milestone 2
    if (milestoneNumber > 1) {
      const prevMilestone = await LuckyDraw.findOne({ milestoneNumber: milestoneNumber - 1 });
      if (!prevMilestone && !adminOverride) {
        return res.status(400).json({
          success: false,
          message: `Milestone ${milestoneNumber - 1} must be completed before conducting Milestone ${milestoneNumber}!`,
        });
      }
    }

    // Check total approved reviews in system
    const totalApprovedReviews = await Review.countDocuments({ status: 'approved' });
    if (totalApprovedReviews < config.target && !adminOverride) {
      return res.status(400).json({
        success: false,
        message: `Milestone ${milestoneNumber} requires ${config.target} verified approved reviews. Currently there are ${totalApprovedReviews} approved reviews. (Enable 'Admin Override' if you are testing).`,
      });
    }

    // Find previous winners across all completed draws to permanently exclude them
    const allPastDraws = await LuckyDraw.find({}).lean();
    const pastWinnerIds = [];
    allPastDraws.forEach((d) => {
      if (d.winner?.reviewId) pastWinnerIds.push(d.winner.reviewId);
      if (Array.isArray(d.winners)) {
        d.winners.forEach((w) => {
          if (w.reviewId) pastWinnerIds.push(w.reviewId);
        });
      }
    });

    // Also include any reviews directly flagged as winners in database
    const flaggedWinners = await Review.find({ isLuckyDrawWinner: true }).select('_id').lean();
    flaggedWinners.forEach((fw) => pastWinnerIds.push(fw._id));

    const uniquePastWinnerIds = [...new Set(pastWinnerIds.map((id) => id.toString()))];

    // Query eligible reviews (Status approved and NOT in past winners list)
    // To be strictly fair, pool comprises reviews up to milestone target (or all available if override)
    const eligibleLimit = adminOverride ? Math.max(config.target, totalApprovedReviews) : config.target;

    const eligibleReviews = await Review.find({
      status: 'approved',
      _id: { $nin: uniquePastWinnerIds },
    })
      .sort({ createdAt: 1 }) // First-come earliest approved reviews up to threshold
      .limit(eligibleLimit)
      .lean();

    if (eligibleReviews.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No eligible reviews found. All existing approved reviews may have already won in previous milestones!',
      });
    }

    // Cryptographically secure fair random selection
    const randomIndex = crypto.randomInt(0, eligibleReviews.length);
    const winningReview = eligibleReviews[randomIndex];

    const winnerObj = {
      reviewId: winningReview._id,
      customerName: winningReview.customerName || 'Verified Customer',
      customerPhone: winningReview.customerPhone || '',
      customerPhoneMasked: maskPhoneNumber(winningReview.customerPhone),
      customerEmail: winningReview.customerEmail || '',
      orderId: winningReview.orderId || 'N/A',
      purchasePlatform: winningReview.purchasePlatform,
      productName: winningReview.productName,
      imageUrl: winningReview.imageUrl || '',
      rating: winningReview.rating || 5,
      reviewText: winningReview.reviewText || '',
      prizeAmount: config.prizeAmount,
      prizeTitle: config.prizeTitle,
      position: 1,
    };

    // Calculate actual participants
    // M1: 600
    // M2: 999 (1000 - 1)
    // M3: 1498 (1500 - 2)
    const totalEligibleCount = eligibleReviews.length;
    const excludedCount = uniquePastWinnerIds.length;

    // Create the LuckyDraw document
    const drawDoc = await LuckyDraw.create({
      milestoneNumber,
      milestoneTarget: config.target,
      prizeAmount: config.prizeAmount,
      prizeTitle: config.prizeTitle,
      prizeLabel: config.prizeLabel,
      drawDate: new Date(),
      totalReviewsAtDraw: totalApprovedReviews,
      totalEligibleParticipants: totalEligibleCount,
      excludedPreviousWinnersCount: excludedCount,
      winner: winnerObj,
      winners: [winnerObj],
      status: req.body.status || 'published',
      notes:
        req.body.notes ||
        `Milestone ${milestoneNumber} (${config.target} reviews) draw completed. 1 Winner selected out of ${totalEligibleCount} eligible participants (${excludedCount} past winners excluded). Prize: ${config.prizeTitle}.`,
      drawnBy: req.admin?._id,
    });

    // Mark winning review permanently in database
    await Review.findByIdAndUpdate(winningReview._id, {
      isLuckyDrawWinner: true,
      luckyDrawMilestone: milestoneNumber,
      luckyDrawPrize: `₹${config.prizeAmount.toLocaleString('en-IN')}`,
    });

    res.status(200).json({
      success: true,
      message: `🎉 Milestone ${milestoneNumber} Lucky Draw Successfully Conducted! Winner: ${winnerObj.customerName} (${winnerObj.customerPhoneMasked}) won ${config.prizeTitle}!`,
      data: drawDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle published status of a Milestone Lucky Draw
// @route   PATCH /api/luckydraw/admin/:id/publish
// @access  Private (Admin)
const togglePublishStatus = async (req, res, next) => {
  try {
    const draw = await LuckyDraw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Milestone draw not found' });
    }

    draw.status = draw.status === 'published' ? 'draft' : 'published';
    await draw.save();

    res.status(200).json({
      success: true,
      message: `Milestone ${draw.milestoneNumber} status changed to ${draw.status}`,
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Reset a Milestone Draw and restore winner review eligibility (Admin)
// @route   DELETE /api/luckydraw/admin/:id
// @access  Private (Admin)
const deleteDraw = async (req, res, next) => {
  try {
    const draw = await LuckyDraw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky draw not found' });
    }

    // Unflag winning review
    if (draw.winner?.reviewId) {
      await Review.findByIdAndUpdate(draw.winner.reviewId, {
        isLuckyDrawWinner: false,
        luckyDrawMilestone: null,
        luckyDrawPrize: null,
      });
    }

    if (Array.isArray(draw.winners)) {
      for (const w of draw.winners) {
        if (w.reviewId) {
          await Review.findByIdAndUpdate(w.reviewId, {
            isLuckyDrawWinner: false,
            luckyDrawMilestone: null,
            luckyDrawPrize: null,
          });
        }
      }
    }

    await LuckyDraw.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Milestone ${draw.milestoneNumber} draw deleted and review eligibility reset.`,
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
