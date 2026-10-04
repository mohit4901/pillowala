import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, QrCode, Sparkles, Gift, Clock, Trophy, CheckCircle2, AlertTriangle } from 'lucide-react';
import StepProgressBar from '../components/review/StepProgressBar';
import StepPlatform from '../components/review/StepPlatform';
import StepProduct from '../components/review/StepProduct';
import StepMarketplaceRedirect from '../components/review/StepMarketplaceRedirect';
import StepPhoto from '../components/review/StepPhoto';
import StepRatingCustomer from '../components/review/StepRatingCustomer';
import { submitReview, getCurrentLuckyDraw, checkOrderIdAvailability } from '../services/api';

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

  // Live counter state
  const [counterData, setCounterData] = useState({
    totalSubmitted: 0,
    nextReviewNumber: 1,
    target: 600,
    prizeAmount: 5000,
  });

  // Duplicate order modal state
  const [duplicateOrderModal, setDuplicateOrderModal] = useState({
    isOpen: false,
    orderId: '',
    message: '',
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load live counter on mount
  React.useEffect(() => {
    getCurrentLuckyDraw()
      .then((res) => {
        if (res.success && res.data) {
          const total = res.data.totalSubmittedReviews ?? 0;
          const nextNum = res.data.nextReviewNumber ?? (total + 1);
          const target = res.data.activeMilestone?.target ?? 600;
          const prize = res.data.activeMilestone?.prizeAmount ?? 5000;
          setCounterData({
            totalSubmitted: total,
            nextReviewNumber: nextNum,
            target,
            prizeAmount: prize,
          });
        }
      })
      .catch((err) => console.error('Failed to load review counter:', err));
  }, []);

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

      // Pre-flight check if Order ID was already submitted in an earlier review
      try {
        const checkRes = await checkOrderIdAvailability(orderId.trim());
        if (checkRes.available === false) {
          setDuplicateOrderModal({
            isOpen: true,
            orderId: orderId.trim(),
            message: checkRes.message || `Ye Order ID (${orderId.trim()}) pehle se submit ho chuki hai!`,
          });
          setSubmitting(false);
          return;
        }
      } catch (errCheck) {
        console.warn('Order ID pre-check failed, continuing to submit:', errCheck);
      }

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
        const assignedReviewNumber =
          response.data?.reviewNumber || response.reviewNumber || counterData.nextReviewNumber;

        navigate('/review/success', {
          state: {
            purchasePlatform,
            productName: selectedProduct.name,
            rating,
            orderId: orderId.trim(),
            customerName: customerName.trim() || 'Valued Customer',
            customerPhone: customerPhone.trim(),
            reviewNumber: assignedReviewNumber,
          },
        });
      } else {
        setSubmitError(response.message || 'Review submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      if (err.response?.data?.code === 'ORDER_ALREADY_USED') {
        setDuplicateOrderModal({
          isOpen: true,
          orderId: orderId.trim(),
          message:
            err.response.data.message ||
            `Ye Order ID (${orderId.trim()}) pehle se submit ho chuki hai! Ek order ID se sirf 1 review aur 1 lucky draw entry allow hai.`,
        });
        setSubmitError('');
      } else {
        const msg = err.response?.data?.message || 'Review submission failed. Please try again.';
        setSubmitError(msg);
      }
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
            Rated us on Flipkart or Meesho? Submit your 5-star screenshot proof to enter the <strong>₹30,000 Milestone Cash Lucky Draw</strong> (₹5K at 600 reviews, ₹10K at 1,000, ₹15K at 1,500 reviews)!
          </p>

          {/* 4 Trust & Reward Benefit Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-amber-700 font-bold flex items-center gap-1">
                <Gift size={11} />
                <span>₹30,000 CASH POOL</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">600, 1000 & 1500 Reviews</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-mono-tech text-amber-700 font-bold flex items-center gap-1">
                <Trophy size={11} />
                <span>3 MILESTONES</span>
              </span>
              <p className="text-[10px] text-stone-500 font-mono-tech">₹5K, ₹10K & ₹15K Cash</p>
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

        {/* Live Review Number Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-yellow-500/15 border-2 border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white font-mono font-black flex flex-col items-center justify-center shrink-0 shadow-md border border-amber-400/40">
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider">ENTRY</span>
              <span className="text-base leading-none text-white">#{counterData.nextReviewNumber}</span>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base flex flex-wrap items-center gap-1.5">
                <span>Aapka submission:</span>
                <span className="text-amber-800 font-mono font-black px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300">
                  Review #{counterData.nextReviewNumber}
                </span>
                <span>hoga!</span>
              </h3>
              <p className="text-xs text-stone-600 font-mono mt-0.5">
                Abhi tak <strong>{counterData.totalSubmitted} reviews</strong> submit ho chuke hain • Target: {counterData.target} Reviews (₹{counterData.prizeAmount.toLocaleString('en-IN')} Cash)
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-stone-900 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider shrink-0 shadow-xs flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span>Review #{counterData.nextReviewNumber} Reserved</span>
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

      {/* Duplicate Order ID Popup Modal */}
      {duplicateOrderModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-rose-300 text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50 shadow-sm">
              <AlertTriangle size={34} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                DUPLICATE ORDER ID DETECTED
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 tracking-tight uppercase leading-snug">
                YE ORDER ID PEHLE SE DAL CHUKI H!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Order ID <strong className="font-mono text-black font-black">#{duplicateOrderModal.orderId}</strong> par pehle hi review aur lucky draw entry submit ho chuki hai.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs font-mono space-y-1 text-stone-700">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>⚖️ Pillowala Fair Play Rule:</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Ek order ID se sirf <strong>1 review entry</strong> allow hai taaki sabhi customers ko lucky draw me fair chance mile. Agar aapka dusra purchase order hai to kripya uska Order ID dalein.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setDuplicateOrderModal({ isOpen: false, orderId: '', message: '' });
                  setOrderId('');
                  setCurrentStep(5);
                }}
                className="w-full py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Okay, Naya Order ID Dalein
              </button>
              <button
                type="button"
                onClick={() => setDuplicateOrderModal({ isOpen: false, orderId: '', message: '' })}
                className="w-full py-2 text-stone-500 hover:text-stone-900 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
