import React, { useState } from 'react';
import { Copy, Check, Sparkles, Tag, ArrowRight, ShieldCheck, Percent, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OfferTemplateCard({
  offer,
  previewMode = false,
  onSelectProduct,
}) {
  const [copied, setCopied] = useState(false);

  const {
    title = 'Special Pillowala Offer',
    description = 'Exclusive marketplace offer for verified Pillowala customers.',
    discountText = 'Flat 30% OFF',
    couponCode = 'REST30',
    template = 'template-luxe-gold',
    endDate,
    image,
  } = offer || {};

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = endDate
    ? new Date(endDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Limited Period';

  // Render based on chosen template
  switch (template) {
    // ----------------------------------------------------
    // TEMPLATE 1: Luxe Gold & Onyx (Hotel Luxury Aesthetic)
    // ----------------------------------------------------
    case 'template-luxe-gold':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-neutral-900 border-2 border-amber-400/40 p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:border-amber-400/70 hover:shadow-2xl">
          {/* Subtle gold bokeh circles */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

          {/* Top Row: Badge & Expiry */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-amber-300/20 border border-amber-400/50 text-amber-300 shadow-xs backdrop-blur-md">
              <Sparkles size={12} className="text-amber-400" />
              <span>Luxe Hotel Comfort</span>
            </span>
            <span className="text-[11px] font-medium text-stone-400">
              Valid till {formattedDate}
            </span>
          </div>

          {/* Middle: Discount & Title */}
          <div className="relative z-10 my-6 space-y-3">
            <div className="inline-block">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                {discountText}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom: Coupon Code & Action */}
          <div className="relative z-10 pt-4 border-t border-amber-400/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {couponCode && (
              <div
                onClick={handleCopy}
                className="cursor-pointer bg-amber-950/60 hover:bg-amber-900/60 border border-dashed border-amber-400/60 rounded-2xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 transition-colors group/btn"
              >
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-bold">
                    Coupon Code
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wider text-amber-100">
                    {couponCode}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover/btn:bg-amber-400 group-hover/btn:text-stone-950 transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
            )}

            {!previewMode && (
              <Link
                to="/products"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
              >
                <span>Shop This Deal</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      );

    // ----------------------------------------------------
    // TEMPLATE 2: Royal Indigo & Violet (Modern Royal Aesthetic)
    // ----------------------------------------------------
    case 'template-royal-indigo':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#3A0CA3] border-2 border-indigo-400/40 p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:border-indigo-400/70 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/20 text-indigo-200 backdrop-blur-md shadow-xs">
              <Gift size={12} className="text-pink-400" />
              <span>Royal Combo Bonanza</span>
            </span>
            <span className="text-[11px] font-medium text-indigo-300">
              Valid till {formattedDate}
            </span>
          </div>

          {/* Center */}
          <div className="relative z-10 my-6 space-y-3">
            <span className="font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-cyan-300 via-pink-300 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
              {discountText}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom */}
          <div className="relative z-10 pt-4 border-t border-indigo-400/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {couponCode && (
              <div
                onClick={handleCopy}
                className="cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-md border border-indigo-300/40 rounded-2xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 transition-colors group/btn"
              >
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-indigo-300 block font-bold">
                    Voucher Code
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wider text-white">
                    {couponCode}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-indigo-950 transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
            )}

            {!previewMode && (
              <Link
                to="/products"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-indigo-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Claim Combo</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      );

    // ----------------------------------------------------
    // TEMPLATE 3: Emerald Botanical (100% Organic & Cotton)
    // ----------------------------------------------------
    case 'template-emerald-fresh':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#0f766e] border-2 border-emerald-300/40 p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:border-emerald-300/70 hover:shadow-2xl">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-emerald-900/40 border border-emerald-300/40 text-emerald-200 backdrop-blur-md shadow-xs">
              <ShieldCheck size={12} className="text-emerald-300" />
              <span>100% Pure Organic</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-200">
              Valid till {formattedDate}
            </span>
          </div>

          {/* Center */}
          <div className="relative z-10 my-6 space-y-3">
            <span className="font-extrabold text-3xl sm:text-4xl text-emerald-100 tracking-tight drop-shadow-sm">
              {discountText}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom */}
          <div className="relative z-10 pt-4 border-t border-emerald-300/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {couponCode && (
              <div
                onClick={handleCopy}
                className="cursor-pointer bg-emerald-950/50 hover:bg-emerald-950/70 border border-dashed border-emerald-300/60 rounded-2xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 transition-colors group/btn"
              >
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">
                    Promo Code
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wider text-emerald-100">
                    {couponCode}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 group-hover/btn:bg-emerald-300 group-hover/btn:text-emerald-950 transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
            )}

            {!previewMode && (
              <Link
                to="/products"
                className="px-5 py-3 rounded-2xl bg-emerald-100 hover:bg-white text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Get Bedsheets</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      );

    // ----------------------------------------------------
    // TEMPLATE 4: Sunset Coral & Amber (Festive & VIP Cashback)
    // ----------------------------------------------------
    case 'template-sunset-coral':
    default:
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#b91c1c] via-[#ea580c] to-[#f59e0b] border-2 border-amber-300/50 p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:border-amber-300 hover:shadow-2xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black/20 border border-white/30 text-white backdrop-blur-md shadow-xs">
              <Sparkles size={12} className="text-yellow-300" />
              <span>VIP Festive Cashback</span>
            </span>
            <span className="text-[11px] font-medium text-amber-100">
              Valid till {formattedDate}
            </span>
          </div>

          {/* Center */}
          <div className="relative z-10 my-6 space-y-3">
            <span className="font-extrabold text-3xl sm:text-4xl text-yellow-200 tracking-tight drop-shadow-md">
              {discountText}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {couponCode && (
              <div
                onClick={handleCopy}
                className="cursor-pointer bg-black/40 hover:bg-black/60 border border-dashed border-amber-200 rounded-2xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 transition-colors group/btn"
              >
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-amber-200 block font-bold">
                    Reviewer Voucher
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wider text-yellow-300">
                    {couponCode}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-yellow-300 group-hover/btn:bg-yellow-300 group-hover/btn:text-stone-950 transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
            )}

            {!previewMode && (
              <Link
                to="/products"
                className="px-5 py-3 rounded-2xl bg-stone-950 hover:bg-black text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Unlock Rewards</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      );
  }
}
