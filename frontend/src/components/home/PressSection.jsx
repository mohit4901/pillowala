import React, { useState } from 'react';

export default function PressSection() {
  const [activeTab, setActiveTab] = useState(0);

  const pressQuotes = [
    {
      id: 'business-insider',
      outlet: 'BUSINESS INSIDER',
      quote: '“We’re absolutely obsessed with these sheets.”',
      fontClass: 'font-sans font-bold tracking-tighter text-stone-700',
    },
    {
      id: 'vogue',
      outlet: 'VOGUE',
      quote: '“The softest, most breathable sheets and pillows you’ll ever sleep on.”',
      fontClass: 'font-serif font-bold tracking-widest text-stone-800 italic',
    },
    {
      id: 'apartment-therapy',
      outlet: 'apartment therapy',
      quote: '“Luxury 5-star hotel comfort delivered directly to your front door.”',
      fontClass: 'font-sans font-medium lowercase tracking-wide text-rose-500',
    },
    {
      id: 'uncrate',
      outlet: 'uncrate',
      quote: '“The definitive ergonomic and textile upgrade for your nocturnal sanctuary.”',
      fontClass: 'font-sans font-black uppercase tracking-widest text-stone-900',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-50/70 border-b border-stone-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Header */}
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-6">
          IN THE PRESS
        </span>

        {/* Dynamic Big Editorial Quote */}
        <div className="min-h-[90px] sm:min-h-[110px] flex items-center justify-center mb-10 px-4">
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-800 leading-snug tracking-tight max-w-3xl transition-opacity duration-300">
            {pressQuotes[activeTab].quote}
          </blockquote>
        </div>

        {/* Press Logos Tab Bar with Active Triangle Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-stone-200/80 max-w-3xl mx-auto">
          {pressQuotes.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`relative py-5 px-3 flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-200/50 text-stone-950 font-bold'
                    : 'bg-transparent text-stone-400 hover:text-stone-700 hover:bg-stone-100/50'
                }`}
              >
                {/* Active Upward Pointer Indicator Triangle */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-stone-200/90" />
                )}

                <span className={`text-xs sm:text-sm ${item.fontClass}`}>
                  {item.outlet}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
