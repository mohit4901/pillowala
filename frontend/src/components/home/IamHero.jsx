import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function IamHero() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] bg-stone-100 flex items-center overflow-hidden select-none">
      {/* Background Lifestyle Image matching reference screenshot */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/iam/hero.jpg"
          alt="Pillowala Lifestyle Morning"
          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98]"
        />
        {/* Soft light gradient from left for maximum typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent sm:via-white/20" />
      </div>

      {/* Hero Typography & CTA matching I AM WHO I AM */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-xl space-y-6">
          {/* Lucky Draw Announcement Pill */}
          <div>
            <Link
              to="/lucky-draw"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 text-[11px] font-mono font-bold tracking-wider uppercase hover:bg-amber-500/25 transition-all shadow-xs group"
            >
              <Sparkles size={13} className="text-amber-600 animate-pulse" />
              <span>₹30,000 MONTH-END LUCKY DRAW // 3 WINNERS</span>
              <ArrowRight size={12} className="text-amber-700 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-black leading-[0.92] tracking-tight">
              <span>PILLOWALA</span>
              <span className="text-xl sm:text-2xl font-light align-top ml-1">™</span>
            </h1>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-black leading-[0.92] tracking-tight">
              WHO I AM.
            </h2>
          </div>

          <p className="text-base sm:text-lg text-stone-700 font-medium max-w-md leading-relaxed">
            Engineered sleep essentials. Micro-bounce fibre pillows, 350 TC winter velvet flannel, and breathable pure cotton flat bedsheets.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#all-products"
              className="px-8 py-4 rounded-full bg-black hover:bg-stone-800 text-white font-display text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:scale-105"
            >
              SHOP THE COLLECTION
            </a>

            <a
              href="#sleep-quiz"
              className="px-8 py-4 rounded-full bg-white/90 hover:bg-white text-black border border-stone-300 font-display text-xs font-bold uppercase tracking-widest transition-all shadow-xs hover:scale-105"
            >
              FIND YOUR FIT
            </a>
          </div>
        </div>
      </div>

      {/* Subtle indicator dots bottom center matching reference screenshot */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-black" />
        <span className="w-2 h-2 rounded-full bg-black/30" />
        <span className="w-2 h-2 rounded-full bg-black/30" />
        <span className="w-2 h-2 rounded-full bg-black/30" />
      </div>
    </section>
  );
}
