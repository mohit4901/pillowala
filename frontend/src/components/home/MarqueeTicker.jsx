import React from 'react';

export default function MarqueeTicker({
  text = 'PILLOWALA ARCHIVES + 100% PURE COTTON + NO NOISE, JUST SILENCE + FLIPKART & MEESHO OFFICIAL + 350 TC WINTER VELVET + VERIFIED 5-STAR COMFORT + ZERO ARTIFICIAL BLENDS +',
  className = '',
  speed = 'normal',
}) {
  return (
    <div className={`w-full overflow-hidden bg-stone-100 text-stone-900 py-3 border-y border-stone-200 select-none ${className}`}>
      <div className="flex w-max animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-mono-tech text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] px-4 whitespace-nowrap text-stone-700 flex items-center gap-4"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
