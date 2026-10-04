import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Send, Loader2, ShieldCheck, Gift, Phone, Mail, Hash, User, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import StarRating from '../common/StarRating';

export default function StepRatingCustomer({
  rating,
  onRatingChange,
  orderId,
  onChangeOrderId,
  customerName,
  onChangeCustomerName,
  customerPhone,
  onChangeCustomerPhone,
  customerEmail,
  onChangeCustomerEmail,
  reviewText,
  onChangeReviewText,
  platform,
  onSubmit,
  onBack,
  submitting,
  submitError,
}) {
  const [fieldErrors, setFieldErrors] = useState({});

  const platformName = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : 'Marketplace';

  const validateInputs = () => {
    const errors = {};

    // 1. Order ID
    const cleanOrderId = (orderId || '').trim();
    if (!cleanOrderId) {
      errors.orderId = `Please enter your ${platformName} Order ID.`;
    } else if (cleanOrderId.length < 2) {
      errors.orderId = 'Order ID should be at least 2 characters.';
    }

    // 2. Mobile Phone
    const digitsOnly = (customerPhone || '').replace(/[\s\-+()]/g, '');
    const normalizedPhone = digitsOnly.replace(/^(91|0)/, '');
    if (!normalizedPhone) {
      errors.customerPhone = 'Mobile number is required for Lucky Draw entry.';
    } else if (normalizedPhone.length < 10) {
      errors.customerPhone = 'Please enter a valid 10-digit mobile number.';
    }

    // 3. Customer Name
    const trimmedName = (customerName || '').trim();
    if (!trimmedName) {
      errors.customerName = 'Please enter your full name.';
    } else if (trimmedName.length < 2) {
      errors.customerName = 'Name must be at least 2 characters.';
    }

    // 4. Email (optional, but validate format if entered)
    const trimmedEmail = (customerEmail || '').trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.customerEmail = 'Please enter a valid email address (e.g. yourname@gmail.com).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setFieldErrors({});
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1">
          <Trophy size={13} className="text-amber-600" />
          <span>₹30,000 MEGA LUCKY DRAW ENTRY</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-900 leading-tight">
          VERIFY & SUBMIT REVIEW
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Enter your {platformName} order details to verify your review and enter the ₹30,000 monthly lucky draw.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs text-center font-mono-tech font-bold">
          {submitError}
        </div>
      )}

      {/* Lucky Draw Announcement Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border-2 border-amber-300 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Gift size={20} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xs sm:text-sm text-stone-900 uppercase tracking-tight">
              Month-End Mega Lucky Draw
            </span>
            <span className="text-[9px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              3 WINNERS
            </span>
          </div>
          <p className="text-[11px] text-stone-700 leading-relaxed font-mono-tech">
            Every month-end, <strong>3 lucky customers</strong> will win <strong>exciting prizes worth ₹30,000</strong> in our lucky draw!
          </p>
        </div>
      </div>

      {/* Star Rating Selector */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-1.5">
        <label className="block text-[11px] font-mono-tech font-bold uppercase tracking-wider text-stone-600">
          RATING SUBMITTED ON {platformName.toUpperCase()}
        </label>
        <div className="flex justify-center">
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={(r) => onRatingChange(r)}
            size={32}
          />
        </div>
        <span className="text-xs font-mono-tech font-bold text-amber-600 block">
          ★ {rating} STAR RATING VERIFIED
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Order ID */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-900 flex items-center justify-between font-mono-tech">
            <span className="flex items-center gap-1.5">
              <Hash size={13} className="text-black" />
              <span>{platformName.toUpperCase()} ORDER ID *</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Found on order details invoice</span>
          </label>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => {
              onChangeOrderId(e.target.value);
              if (fieldErrors.orderId) setFieldErrors((prev) => ({ ...prev, orderId: null }));
            }}
            placeholder={
              platform === 'flipkart'
                ? 'e.g. OD123456789123'
                : 'e.g. 987654321_1'
            }
            className={`w-full px-4 py-3 rounded-xl border text-xs font-mono-tech transition-colors focus:outline-none ${
              fieldErrors.orderId
                ? 'border-red-400 bg-red-50/40 focus:border-red-500 text-red-900'
                : 'border-stone-300 bg-white focus:border-black text-stone-900'
            }`}
          />
          {fieldErrors.orderId && (
            <p className="text-[11px] text-red-600 font-mono-tech">{fieldErrors.orderId}</p>
          )}
        </div>

        {/* WhatsApp / Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-900 flex items-center justify-between font-mono-tech">
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-600" />
              <span>WHATSAPP / MOBILE NUMBER *</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">For Lucky Draw Notifications</span>
          </label>
          <div className="flex items-center">
            <div className="px-3 py-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 font-mono-tech font-bold text-xs text-stone-700 flex items-center gap-1">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              required
              maxLength={10}
              value={customerPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                onChangeCustomerPhone(val);
                if (fieldErrors.customerPhone) setFieldErrors((prev) => ({ ...prev, customerPhone: null }));
              }}
              placeholder="10-digit number (e.g. 9876543210)"
              className={`w-full px-4 py-3 rounded-r-xl border text-xs font-mono-tech transition-colors focus:outline-none ${
                fieldErrors.customerPhone
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 text-red-900'
                  : 'border-stone-300 bg-white focus:border-black text-stone-900'
              }`}
            />
          </div>
          {fieldErrors.customerPhone && (
            <p className="text-[11px] text-red-600 font-mono-tech">{fieldErrors.customerPhone}</p>
          )}
        </div>

        {/* Full Name & Optional Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-mono-tech">
              <User size={13} className="text-stone-500" />
              <span>FULL NAME *</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                onChangeCustomerName(e.target.value);
                if (fieldErrors.customerName) setFieldErrors((prev) => ({ ...prev, customerName: null }));
              }}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-3 rounded-xl border text-xs font-mono-tech transition-colors focus:outline-none ${
                fieldErrors.customerName
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 text-red-900'
                  : 'border-stone-300 bg-white focus:border-black text-stone-900'
              }`}
            />
            {fieldErrors.customerName && (
              <p className="text-[11px] text-red-600 font-mono-tech">{fieldErrors.customerName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-mono-tech">
              <Mail size={13} className="text-stone-500" />
              <span>EMAIL (OPTIONAL)</span>
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => {
                onChangeCustomerEmail(e.target.value);
                if (fieldErrors.customerEmail) setFieldErrors((prev) => ({ ...prev, customerEmail: null }));
              }}
              placeholder="e.g. rahul@gmail.com"
              className={`w-full px-4 py-3 rounded-xl border text-xs font-mono-tech transition-colors focus:outline-none ${
                fieldErrors.customerEmail
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 text-red-900'
                  : 'border-stone-300 bg-white focus:border-black text-stone-900'
              }`}
            />
            {fieldErrors.customerEmail && (
              <p className="text-[11px] text-red-600 font-mono-tech">{fieldErrors.customerEmail}</p>
            )}
          </div>
        </div>

        {/* Optional Review Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-900 font-mono-tech">
            REVIEW TEXT AS POSTED (OPTIONAL)
          </label>
          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => onChangeReviewText(e.target.value)}
            placeholder="Paste your review comments here for faster moderation approval..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-mono-tech focus:outline-none focus:border-black text-stone-900 resize-none"
          />
        </div>
      </div>

      {/* Trust Badge */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 text-xs text-stone-600">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
        <span className="text-[11px] leading-relaxed">
          Your details are encrypted and used solely for Pillowala lucky draw participation and prize announcement.
        </span>
      </div>

      {/* Navigation & Submit Button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="py-4 px-5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>BACK</span>
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className={`flex-1 py-4 px-6 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all duration-200 cursor-pointer ${
            submitting
              ? 'bg-stone-800 text-white cursor-wait'
              : 'bg-black text-white hover:bg-stone-800 hover:scale-[1.01] active:scale-[0.99] shadow-stone-900/30'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>SUBMITTING REVIEW...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>SUBMIT & ENTER ₹30,000 LUCKY DRAW →</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
