const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    default: '',
  },
  customerPhoneMasked: {
    type: String,
    default: '',
  },
  customerEmail: {
    type: String,
    default: '',
  },
  orderId: {
    type: String,
    default: '',
  },
  purchasePlatform: {
    type: String,
    enum: ['amazon', 'flipkart', 'meesho'],
    required: true,
  },
  productName: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 5,
  },
  reviewText: {
    type: String,
    default: '',
  },
  prizeAmount: {
    type: Number,
    default: 0,
  },
  prizeTitle: {
    type: String,
    default: '',
  },
  position: {
    type: Number,
    default: 1,
  },
});

const luckyDrawSchema = new mongoose.Schema(
  {
    milestoneNumber: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      index: true,
    },
    milestoneTarget: {
      type: Number,
      required: true, // 600, 1000, 1500
    },
    prizeAmount: {
      type: Number,
      required: true, // 5000, 10000, 15000
    },
    prizeTitle: {
      type: String,
      required: true, // e.g. "₹5,000 Direct Cash Prize"
    },
    prizeLabel: {
      type: String,
      default: '',
    },
    drawDate: {
      type: Date,
      default: Date.now,
    },
    totalReviewsAtDraw: {
      type: Number,
      default: 0,
    },
    totalEligibleParticipants: {
      type: Number,
      default: 0, // e.g. 600 for M1, 999 for M2, 1498 for M3
    },
    excludedPreviousWinnersCount: {
      type: Number,
      default: 0, // 0 for M1, 1 for M2, 2 for M3
    },
    winner: winnerSchema,
    winners: [winnerSchema],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    drawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    // Retained for legacy records
    month: {
      type: String,
      default: null,
    },
    monthLabel: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LuckyDraw', luckyDrawSchema);

