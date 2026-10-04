import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, ShieldCheck, Sparkles, QrCode, CheckCircle2, Feather } from 'lucide-react';

export default function SidewalkHero() {
  return (
    <section className="relative w-full min-h-[92vh] bg-white text-stone-950 flex flex-col justify-between overflow-hidden border-b border-stone-200 select-none">
      {/* Background Editorial Visual with Crisp Light Aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/sidewalk/hero_white.jpg"
          alt="Pillowala Luxury Bedding Lookbook"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03]"
        />
        {/* Soft Sunlit Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-white/40 pointer-events-none" />
      </div>

      {/* Top Technical Header Row */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono-tech uppercase tracking-[0.3em] text-stone-700">
            <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse"></span>
            <span>REST ARCHIVE // VOL. 04</span>
          </div>
          <p className="text-[11px] text-stone-500 font-mono-tech hidden sm:block">
            SPEC: 350 TC FLANNEL & RESILIENT FIBER MATRIX
          </p>
        </div>

        {/* Right Top Badge matching reference image EST. 22 */}
        <div className="text-right">
          <span className="font-display font-black text-lg sm:text-xl tracking-tight text-stone-950 block">
            *EST. 22
          </span>
          <span className="text-[10px] font-mono-tech text-stone-500 tracking-[0.2em] uppercase block">
            OFFICIAL FLIPKART & MEESHO
          </span>
        </div>
      </div>

      {/* Center Huge Typography & Hero Statement matching reference QUIET */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center sm:items-start text-center sm:text-left">
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-stone-300 text-xs font-mono-tech uppercase tracking-wider text-stone-900 mb-6 shadow-xs">
          <Feather size={12} className="text-stone-700" />
          <span>AUTUMN / WINTER 2026 PILLOWS & BEDSHEETS ARCHIVE</span>
        </div>

        {/* Giant Hero Title: QUIET © */}
        <div className="relative w-full">
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-stone-950 leading-none flex items-center justify-center sm:justify-start gap-2 sm:gap-4 drop-shadow-sm">
            <span>QUIET</span>
            <span className="text-4xl sm:text-6xl md:text-7xl font-light text-stone-400 align-top">©</span>
          </h1>

          {/* Floating Circle Badge matching reference */}
          <a
            href="#coverflow"
            className="absolute right-4 sm:right-16 top-1/2 -translate-y-1/2 hidden md:flex w-24 h-24 rounded-full bg-stone-950 text-white font-mono-tech text-[10px] font-bold uppercase tracking-wider items-center justify-center text-center p-2 shadow-xl hover:scale-110 hover:bg-stone-800 transition-transform duration-300 z-20"
          >
            <span>SCROLL // EXPLORE</span>
          </a>
        </div>

        {/* Subtitle & Value Proposition */}
        <p className="font-mono-tech text-xs sm:text-base text-stone-700 max-w-xl mt-4 leading-relaxed tracking-wide font-medium">
          Architectural sleep comfort. 350 TC warm velvet fitted sheets, pure 200 TC cotton flat sheets, and ergonomic micro-bounce fibre pillows.
        </p>

        {/* CTA Buttons Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-8">
          <Link
            to="/products"
            className="px-8 py-4 rounded-full bg-stone-950 text-white font-display font-black text-xs uppercase tracking-[0.15em] hover:bg-stone-800 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
          >
            <span>SHOP ALL 29 PRODUCTS</span>
            <ArrowUpRight size={16} />
          </Link>

          <Link
            to="/review"
            className="px-8 py-4 rounded-full bg-white/95 hover:bg-stone-100 text-stone-950 border border-stone-300 font-display font-bold text-xs uppercase tracking-[0.15em] hover:scale-105 transition-all backdrop-blur-md flex items-center gap-2 shadow-xs"
          >
            <QrCode size={15} />
            <span>CLAIM REVIEW REWARD</span>
          </Link>
        </div>
      </div>

      {/* Bottom Information Row */}
      <div className="relative z-10 w-full border-t border-stone-200 bg-white/90 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-tech text-stone-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-stone-900 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>100% VERIFIED RATINGS</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-stone-900 font-medium">
              <CheckCircle2 size={14} className="text-blue-600" />
              <span>FACTORY DIRECT PANIPAT WEAVE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>21 BEDSHEETS</span>
            <span>•</span>
            <span>8 SLEEPING PILLOWS & BOLSTERS</span>
            <span>•</span>
            <a href="#catalog" className="text-stone-950 font-bold underline hover:text-stone-700">
              EXPLORE CATALOG ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
