import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Star, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export default function ReviewCTA() {
  return (
    <section className="py-20 bg-brand-charcoal text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-stone-700/80 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Gift size={14} />
                <span>Physical QR Insert Card</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Bought Our Product? <br />
                <span className="text-brand-accent italic font-normal">
                  We'd love to hear about your experience.
                </span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Every pillow box contains an authentic review card with a QR code. Your genuine feedback helps our Indian artisans refine every contour and helps fellow sleepers make the right choice.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/review"
                  id="cta-review-btn"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-brand-500/30 transition-all hover:scale-105 active:scale-100 group"
                >
                  <QrCode size={20} className="text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Review Our Product</span>
                  <ArrowRight size={16} />
                </Link>

                <div className="text-xs text-stone-400 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Takes less than 45 seconds • No login required</span>
                </div>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-brand-50 text-stone-900 p-6 shadow-2xl border border-stone-200 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛏️</span>
                    <span className="font-serif font-bold text-base text-stone-900">Pillowala</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Package Insert
                  </span>
                </div>

                <div className="text-center py-3">
                  <div className="w-32 h-32 mx-auto rounded-xl bg-white p-2 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center shadow-inner mb-3">
                    <QrCode size={76} className="text-stone-800" />
                    <span className="text-[9px] font-bold text-stone-500 mt-1 uppercase">Scan to Review</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">Thank You For Your Purchase!</h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Scan with your phone camera or visit <br />
                    <span className="font-mono font-semibold text-brand-600">pillowala.com/review</span>
                  </p>
                </div>

                <div className="mt-2 pt-3 border-t border-brand-200/80 flex items-center justify-around text-center text-[10px] text-stone-600">
                  <span>★ Amazon</span>
                  <span>★ Flipkart</span>
                  <span>★ Meesho</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
