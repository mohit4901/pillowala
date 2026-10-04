import React from 'react';
import { Check } from 'lucide-react';

export default function StepProgressBar({ currentStep, totalSteps = 5 }) {
  const steps = [
    { num: 1, label: 'Platform' },
    { num: 2, label: 'Product' },
    { num: 3, label: 'Rate 5★' },
    { num: 4, label: 'Proof' },
    { num: 5, label: 'Claim' },
  ];

  const currentLabel = steps.find((s) => s.num === currentStep)?.label || '';

  return (
    <div className="w-full mb-8 sm:mb-10 select-none">
      {/* Top Mobile Step Counter */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-stone-500 font-bold">
          STEP {currentStep} OF {totalSteps} // {currentLabel.toUpperCase()}
        </span>
        <span className="text-[11px] font-mono-tech font-bold text-black bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
          {Math.round((currentStep / totalSteps) * 100)}% COMPLETE
        </span>
      </div>

      {/* Step Numbers and Progress Bar */}
      <div className="flex items-center justify-between relative px-1">
        {/* Background Connecting Line */}
        <div className="absolute top-4 sm:top-5 left-4 right-4 h-[2px] bg-stone-200 -translate-y-1/2 z-0" />
        
        {/* Animated Active Progress Line */}
        <div
          className="absolute top-4 sm:top-5 left-4 h-[2px] bg-black -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 92}%`,
          }}
        />

        {steps.map((s) => {
          const isCompleted = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono-tech font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-black text-white shadow-md'
                    : isCurrent
                    ? 'bg-black text-white ring-4 ring-stone-200 shadow-md scale-110'
                    : 'bg-white text-stone-400 border border-stone-300'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : s.num}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-mono-tech mt-2 whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-black font-bold uppercase tracking-wider'
                    : isCompleted
                    ? 'text-stone-800 font-medium'
                    : 'text-stone-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
