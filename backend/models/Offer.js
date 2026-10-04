const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      enum: [
        'template-luxe-gold',
        'template-royal-indigo',
        'template-emerald-fresh',
        'template-sunset-coral',
      ],
      default: 'template-luxe-gold',
    },
    discountText: {
      type: String,
      required: [true, 'Discount text is required'],
      trim: true,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ active: 1 });
offerSchema.index({ endDate: 1 });

module.exports = mongoose.model('Offer', offerSchema);
