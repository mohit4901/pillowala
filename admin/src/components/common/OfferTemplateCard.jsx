import React, { useState } from 'react';
import { Copy, Check, Sparkles, Tag, ArrowRight, ShieldCheck, Percent, Gift } from 'lucide-react';

export default function OfferTemplateCard({
  offer,
  previewMode = true,
}) {
  const [copied, setCopied] = useState(false);

  const {
    title = 'Special Pillowala Offer',
    description = 'Exclusive marketplace offer for verified Pillowala customers.',
    discountText = 'Flat 30% OFF',
    couponCode = 'REST30',
    template = 'template-luxe-gold',
    endDate,
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

  switch (template) {
    case 'template-luxe-gold':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-neutral-900 border-2 border-amber-400/40 p-6 text-white shadow-xl flex flex-col justify-between min-h-[320px]">
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-amber-300/20 border border-amber-400/50 text-amber-300 shadow-xs backdrop-blur-md">
              <Sparkles size={12} className="text-amber-400" />
              <span>Template 1 • Luxe Gold</span>
            </span>
            <span className="text-[11px] font-medium text-stone-400">Till {formattedDate}</span>
          </div>

          <div className="relative z-10 my-4 space-y-2">
            <span className="font-serif text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {discountText || 'Discount Text'}
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-100 leading-snug">
              {title || 'Offer Title'}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {description || 'Offer Description'}
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-amber-400/20 flex items-center justify-between gap-3">
            <div className="bg-amber-950/60 border border-dashed border-amber-400/60 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-bold">
                  Code
                </span>
                <span className="font-mono font-bold text-xs tracking-wider text-amber-100">
                  {couponCode || 'CODE'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Live Preview
            </span>
          </div>
        </div>
      );

    case 'template-royal-indigo':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#3A0CA3] border-2 border-indigo-400/40 p-6 text-white shadow-xl flex flex-col justify-between min-h-[320px]">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/20 text-indigo-200 backdrop-blur-md shadow-xs">
              <Gift size={12} className="text-pink-400" />
              <span>Template 2 • Royal Indigo</span>
            </span>
            <span className="text-[11px] font-medium text-indigo-300">Till {formattedDate}</span>
          </div>

          <div className="relative z-10 my-4 space-y-2">
            <span className="font-extrabold text-3xl bg-gradient-to-r from-cyan-300 via-pink-300 to-fuchsia-400 bg-clip-text text-transparent">
              {discountText || 'Discount Text'}
            </span>
            <h3 className="font-serif text-lg font-bold text-white leading-snug">
              {title || 'Offer Title'}
            </h3>
            <p className="text-xs text-indigo-100 line-clamp-2 leading-relaxed">
              {description || 'Offer Description'}
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-indigo-400/20 flex items-center justify-between gap-3">
            <div className="bg-white/10 border border-indigo-300/40 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-indigo-300 block font-bold">
                  Code
                </span>
                <span className="font-mono font-bold text-xs tracking-wider text-white">
                  {couponCode || 'CODE'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
              Live Preview
            </span>
          </div>
        </div>
      );

    case 'template-emerald-fresh':
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#0f766e] border-2 border-emerald-300/40 p-6 text-white shadow-xl flex flex-col justify-between min-h-[320px]">
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-900/40 border border-emerald-300/40 text-emerald-200 backdrop-blur-md shadow-xs">
              <ShieldCheck size={12} className="text-emerald-300" />
              <span>Template 3 • Emerald Organic</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-200">Till {formattedDate}</span>
          </div>

          <div className="relative z-10 my-4 space-y-2">
            <span className="font-extrabold text-3xl text-emerald-100">
              {discountText || 'Discount Text'}
            </span>
            <h3 className="font-serif text-lg font-bold text-white leading-snug">
              {title || 'Offer Title'}
            </h3>
            <p className="text-xs text-emerald-100 line-clamp-2 leading-relaxed">
              {description || 'Offer Description'}
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-emerald-300/20 flex items-center justify-between gap-3">
            <div className="bg-emerald-950/50 border border-dashed border-emerald-300/60 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">
                  Code
                </span>
                <span className="font-mono font-bold text-xs tracking-wider text-emerald-100">
                  {couponCode || 'CODE'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              Live Preview
            </span>
          </div>
        </div>
      );

    case 'template-sunset-coral':
    default:
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#b91c1c] via-[#ea580c] to-[#f59e0b] border-2 border-amber-300/50 p-6 text-white shadow-xl flex flex-col justify-between min-h-[320px]">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/20 border border-white/30 text-white backdrop-blur-md shadow-xs">
              <Sparkles size={12} className="text-yellow-300" />
              <span>Template 4 • Sunset VIP</span>
            </span>
            <span className="text-[11px] font-medium text-amber-100">Till {formattedDate}</span>
          </div>

          <div className="relative z-10 my-4 space-y-2">
            <span className="font-extrabold text-3xl text-yellow-200">
              {discountText || 'Discount Text'}
            </span>
            <h3 className="font-serif text-lg font-bold text-white leading-snug">
              {title || 'Offer Title'}
            </h3>
            <p className="text-xs text-amber-100 line-clamp-2 leading-relaxed">
              {description || 'Offer Description'}
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between gap-3">
            <div className="bg-black/40 border border-dashed border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-amber-200 block font-bold">
                  Code
                </span>
                <span className="font-mono font-bold text-xs tracking-wider text-yellow-300">
                  {couponCode || 'CODE'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">
              Live Preview
            </span>
          </div>
        </div>
      );
  }
}
