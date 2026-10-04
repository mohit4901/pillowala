import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Camera, ArrowLeft, ArrowRight, Star, CheckCircle2, ShieldCheck, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function StepMarketplaceRedirect({
  platform,
  product,
  onNext,
  onBack,
}) {
  const [hasVisited, setHasVisited] = useState(false);

  const platformConfig = {
    flipkart: {
      name: 'Flipkart',
      btnBg: 'bg-[#2874F0] hover:bg-[#1B60D1] text-white',
      accentText: 'text-[#2874F0]',
      appTag: 'Flipkart Official App',
    },
    meesho: {
      name: 'Meesho',
      btnBg: 'bg-[#9C27B0] hover:bg-[#7B1FA2] text-white',
      accentText: 'text-[#9C27B0]',
      appTag: 'Meesho Mobile App',
    },
  };

  const market = platformConfig[platform] || platformConfig.flipkart;

  const handleOpenMarketplace = () => {
    setHasVisited(true);
    const targetUrl = product?.externalUrl || product?.buyLinks?.[platform] || (platform === 'flipkart' ? 'https://www.flipkart.com' : 'https://www.meesho.com');
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    
    // Automatically advance to Step 4 after clicking
    setTimeout(() => {
      onNext();
    }, 400);
  };

  const img =
    product?.images && product.images.length > 0
      ? product.images[0]
      : 'https://rukminim2.flixcart.com/image/800/800/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      <div className="text-center space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-900 leading-tight">
          RATE ON {market.name.toUpperCase()}
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Open your purchased product page on {market.name} to submit your 5-star rating and upload screenshot proof.
        </p>
      </div>

      {/* Selected Product Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3.5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-stone-200 overflow-hidden shrink-0">
          <img
            src={img}
            alt={product?.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <span className="text-[9px] font-mono-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700">
            {market.appTag}
          </span>
          <h3 className="font-display font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 mt-0.5 uppercase tracking-tight">
            {product?.name}
          </h3>
          <p className="text-xs font-black text-stone-800">
            ₹{Number(product?.price || 499).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white text-center space-y-4 shadow-xl border border-stone-800">
        <div className="flex items-center justify-center gap-1 text-amber-400 text-lg sm:text-xl">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={22} fill="currentColor" />
          ))}
        </div>

        <div className="space-y-1">
          <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            1. Open Product & Rate 5 Stars
          </h3>
          <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
            Tap below to open {market.name}. Submit your 5-star rating along with a photo of the product, then take a screenshot.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenMarketplace}
          className={`w-full py-4 px-6 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] cursor-pointer ${market.btnBg}`}
        >
          <span>OPEN {market.name.toUpperCase()} & RATE 5★</span>
          <ExternalLink size={16} />
        </button>

        {hasVisited && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 text-[11px] font-mono-tech font-bold animate-fadeIn border border-emerald-700">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Product opened in new tab! Take a screenshot and continue.</span>
          </div>
        )}
      </div>

      {/* INSTANT APPROVAL CHECKLIST (With Photo Requirement) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/60 border-2 border-amber-300/80 space-y-3.5">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-wider text-amber-900">
            <ShieldCheck size={16} className="text-amber-600 shrink-0" />
            <span>INSTANT APPROVAL CHECKLIST // REWARD RULES</span>
          </div>
          <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
            MUST FOLLOW
          </span>
        </div>

        <div className="space-y-3 text-xs text-stone-800">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Camera size={16} />
            </div>
            <div className="space-y-0.5">
              <strong className="font-display font-black text-xs uppercase tracking-tight text-stone-900 block">
                1. Review me Product ki Photo zaroor daalein (Compulsory)
              </strong>
              <p className="text-[11px] text-stone-600 leading-relaxed font-mono-tech">
                Flipkart ya Meesho par rating dete waqt apne pillow / bedsheet ki 1–2 photos zaroor attach karein. Photos wale reviews ko brand team se <strong>instant priority approval</strong> aur fast reward milta hai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Star size={16} fill="currentColor" />
            </div>
            <div className="space-y-0.5">
              <strong className="font-display font-black text-xs uppercase tracking-tight text-stone-900 block">
                2. Full 5-Star Rating & 1–2 Lines Review
              </strong>
              <p className="text-[11px] text-stone-600 leading-relaxed font-mono-tech">
                5-Star rating select karein aur pillow ke soft bounce ya fabric comfort ke baare me 1-2 lines likhein.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={16} />
            </div>
            <div className="space-y-0.5">
              <strong className="font-display font-black text-xs uppercase tracking-tight text-stone-900 block">
                3. Clear Screenshot
              </strong>
              <p className="text-[11px] text-stone-600 leading-relaxed font-mono-tech">
                Review submit karne ke baad screen ka screenshot lein jisme aapki 5-star rating aur product photo dono clearly visible hon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3.5 px-6 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest bg-black hover:bg-stone-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <Camera size={16} />
          <span>I'VE POSTED REVIEW → UPLOAD PROOF</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
