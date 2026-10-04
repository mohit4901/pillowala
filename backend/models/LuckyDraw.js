const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1st, 2nd, 3rd Position
  },
  prizeTitle: {
    type: String,
    required: true,
  },
  prizeValue: {
    type: String,
    default: '',
  },
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
});

const luckyDrawSchema = new mongoose.Schema(
  {
    month: {
      type: String, // Format: "YYYY-MM", e.g. "2026-09"
      required: true,
    },
    monthLabel: {
      type: String, // e.g. "September 2026"
      required: true,
    },
    drawDate: {
      type: Date,
      default: Date.now,
    },
    totalEligibleParticipants: {
      type: Number,
      default: 0,
    },
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
  },
  {
    timestamps: true,
  }
);

luckyDrawSchema.index({ month: 1 }, { unique: true });
luckyDrawSchema.index({ month: 1, status: 1 });

module.exports = mongoose.model('LuckyDraw', luckyDrawSchema);
