const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: 'Verified Customer',
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    orderId: {
      type: String,
      trim: true,
      default: '',
    },
    purchasePlatform: {
      type: String,
      required: [true, 'Purchase platform is required'],
      enum: ['amazon', 'flipkart', 'meesho'],
      lowercase: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    reviewText: {
      type: String,
      trim: true,
      default: 'Marketplace Review Verified with Screenshot',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isLuckyDrawWinner: {
      type: Boolean,
      default: false,
      index: true,
    },
    luckyDrawMonth: {
      type: String, // "YYYY-MM"
      default: null,
      index: true,
    },
    luckyDrawPosition: {
      type: Number, // 1, 2, 3
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ purchasePlatform: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ productId: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ customerPhone: 1 });
reviewSchema.index({ luckyDrawMonth: 1, isLuckyDrawWinner: 1 });

module.exports = mongoose.model('Review', reviewSchema);
