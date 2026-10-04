import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MessageSquareText } from 'lucide-react';

export default function StepReviewText({
  reviewText,
  onChangeReviewText,
  onNext,
  onBack,
}) {
  const [error, setError] = useState('');

  const samplePrompts = [
    'Neck Pain Relief',
    'Super Soft Fabric',
    'Perfect Loft Height',
    'Cool All Night',
    'Great Hotel Bounce',
  ];

  const handlePromptClick = (prompt) => {
    const addition = reviewText ? ` ${prompt}.` : `${prompt}. `;
    onChangeReviewText(reviewText + addition);
  };

  const handleNext = () => {
    if (!reviewText || reviewText.trim().length < 5) {
      setError('Please write at least a few words (minimum 5 characters) about your sleep experience.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          How was your experience?
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm mt-1.5">
          Tell us what you loved about the neck support, comfort, or pillow fabric.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center">
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={5}
            value={reviewText}
            onChange={(e) => {
              onChangeReviewText(e.target.value);
              if (error && e.target.value.trim().length >= 5) {
                setError('');
              }
            }}
            placeholder="Tell us what you liked about the pillow loft, comfort, packaging, or sleeping quality..."
            className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-brand-500 focus:ring-0 focus:outline-none text-stone-900 text-sm leading-relaxed placeholder:text-stone-400 bg-white shadow-xs resize-none"
          />
          <div className="absolute bottom-3 right-4 text-[11px] text-stone-400">
            {reviewText.length} characters
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
            Tap topics to add:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePromptClick(p)}
                className="px-2.5 py-1 rounded-full text-xs bg-stone-100 hover:bg-brand-100 hover:text-brand-700 text-stone-600 transition-colors border border-stone-200"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-brand-charcoal hover:bg-stone-900 text-white flex items-center justify-center gap-2 shadow-md shadow-stone-900/20 transition-all duration-200 active:scale-[0.99]"
        >
          <span>Continue to Star Rating</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
