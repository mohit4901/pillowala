const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    marketplace: {
      type: String,
      required: [true, 'Marketplace is required'],
      enum: ['amazon', 'flipkart', 'meesho'],
      lowercase: true,
    },
    externalUrl: {
      type: String,
      required: [true, 'External marketplace URL is required'],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    keywords: {
      type: [String],
      default: [],
    },
    sleepProfile: {
      suitablePositions: {
        type: [String],
        default: [],
      },
      firmness: {
        type: String,
        enum: ['soft', 'medium', 'firm'],
        default: 'medium',
      },
      painRelief: {
        type: String,
        default: 'general-comfort',
      },
      sleepClimate: {
        type: String,
        default: 'all-season',
      },
      categoryType: {
        type: String,
        default: 'pillow',
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ marketplace: 1 });
productSchema.index({ active: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Product', productSchema);
