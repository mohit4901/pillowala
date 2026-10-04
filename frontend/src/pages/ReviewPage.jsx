import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, QrCode, Sparkles, Gift, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import StepProgressBar from '../components/review/StepProgressBar';
import StepPlatform from '../components/review/StepPlatform';
import StepProduct from '../components/review/StepProduct';
import StepMarketplaceRedirect from '../components/review/StepMarketplaceRedirect';
import StepPhoto from '../components/review/StepPhoto';
import StepRatingCustomer from '../components/review/StepRatingCustomer';
import { submitReview } from '../services/api';

export default function ReviewPage() {
  const navigate = useNavigate();

  // Multi-step review bridge state
  const [currentStep, setCurrentStep] = useState(1);
  const [purchasePlatform, setPurchasePlatform] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // Review screenshot
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step navigation handlers
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final submit handler
  const handleSubmitReview = async () => {
    if (!purchasePlatform) {
      setSubmitError('Please select a purchase platform');
      setCurrentStep(1);
      return;
    }
    if (!selectedProduct) {
      setSubmitError('Please select the purchased product');
      setCurrentStep(2);
      return;
    }
    if (!imageUrl) {
      setSubmitError('Please upload your marketplace review screenshot');
      setCurrentStep(4);
      return;
    }
    if (!orderId || orderId.trim().length < 3) {
      setSubmitError('Please enter your marketplace Order ID');
      return;
    }
    if (!customerPhone || customerPhone.trim().length < 8) {
      setSubmitError('Please enter your WhatsApp / Phone number for reward delivery');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const payload = {
        purchasePlatform,
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        imageUrl,
        orderId: orderId.trim(),
        customerName: customerName.trim() || 'Verified Buyer',
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || '',
        reviewText: reviewText.trim() || '5-Star Marketplace Review Verified with Screenshot',
        rating: Number(rating) || 5,
      };

      const response = await submitReview(payload);

      if (response.success) {
        navigate('/review/success', {
          state: {
            purchasePlatform,
            productName: selectedProduct.name,
            rating,
            orderId: orderId.trim(),
            customerName: customerName.trim() || 'Valued Customer',
            customerPhone: customerPhone.trim(),
          },
        });
      } else {
        setSubmitError(response.message || 'Review submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      const msg = err.response?.data?.message || 'Review submission failed. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/70 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header Card */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-[11px] font-mono-tech font-bold uppercase tracking-[0.2em] shadow-sm">
            <QrCode size={13} className="text-amber-400" />
            <span>PACKAGE QR // REWARD ATELIER</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 leading-none">
            CLAIM REWARD & LUCKY DRAW
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Rated us on Flipkart or Meesho? Submit your 5-star screenshot proof to enter the <strong>₹30,000 Month-End Mega Lucky Draw</strong> with exciting prizes for 3 lucky winners!
          </p>

          {/* 4 Trust & Reward Benefit Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-amber-700 font-bold flex items-center gap-1">
                <Gift size={11} />
                <span>₹30,000 LUCKY DRAW</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">3 Lucky Winners / Month</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-amber-700 font-bold flex items-center gap-1">
                <Trophy size={11} />
                <span>3 WINNERS</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">Drawn every month-end</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-blue-700 font-bold flex items-center gap-1">
                <Clock size={11} />
                <span>12-HR DISPATCH</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">Instant WhatsApp delivery</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-stone-800 font-bold flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>100% VERIFIED</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">Flipkart & Meesho</p>
            </div>
          </div>
        </div>

        {/* Multi-step Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200">
          <StepProgressBar currentStep={currentStep} totalSteps={5} />

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepPlatform
                key="step-1"
                selectedPlatform={purchasePlatform}
                onSelectPlatform={(p) => setPurchasePlatform(p)}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <StepProduct
                key="step-2"
                platform={purchasePlatform}
                selectedProduct={selectedProduct}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <StepMarketplaceRedirect
                key="step-3"
                platform={purchasePlatform}
                product={selectedProduct}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <StepPhoto
                key="step-4"
                platform={purchasePlatform}
                product={selectedProduct}
                imageUrl={imageUrl}
                onImageUploaded={(url) => setImageUrl(url)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 && (
              <StepRatingCustomer
                key="step-5"
                rating={rating}
                onRatingChange={setRating}
                orderId={orderId}
                onChangeOrderId={setOrderId}
                customerName={customerName}
                onChangeCustomerName={setCustomerName}
                customerPhone={customerPhone}
                onChangeCustomerPhone={setCustomerPhone}
                customerEmail={customerEmail}
                onChangeCustomerEmail={setCustomerEmail}
                reviewText={reviewText}
                onChangeReviewText={setReviewText}
                platform={purchasePlatform}
                onSubmit={handleSubmitReview}
                onBack={handleBack}
                submitting={submitting}
                submitError={submitError}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Trust Footnote & Support */}
        <div className="text-center space-y-1 text-xs text-stone-400">
          <div className="flex items-center justify-center gap-2 font-mono-tech text-[11px] text-stone-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted Verification • Pillowala Official Review Desk</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono-tech">
            Need assistance with your QR review? WhatsApp our team directly at +91 98765 43210
          </p>
        </div>
      </div>
    </div>
  );
}
