import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Gift } from 'lucide-react';

export default function StepPlatform({ selectedPlatform, onSelectPlatform, onNext }) {
  const platforms = [
    {
      id: 'flipkart',
      name: 'Flipkart',
      tagline: 'Ordered via Flipkart App / Website',
      perk: 'Enter ₹30,000 Milestone Cash Draw (₹5K, ₹10K, ₹15K)',
      logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png',
      badge: 'FLIPKART OFFICIAL STORE',
      badgeColor: 'bg-[#2874F0] text-white',
      accentBorder: 'border-[#2874F0]',
    },
    {
      id: 'meesho',
      name: 'Meesho',
      tagline: 'Ordered via Meesho Mobile App',
      perk: 'Enter ₹30,000 Milestone Cash Draw & VIP Pass',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png',
      badge: 'MEESHO VERIFIED SELLER',
      badgeColor: 'bg-[#9C27B0] text-white',
      accentBorder: 'border-[#9C27B0]',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1">
          <Gift size={13} className="text-amber-600" />
          <span>OFFICIAL BUYER REWARD INITIATIVE</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-900 leading-tight">
          WHERE DID YOU PURCHASE?
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Select the marketplace where you received your Pillowala order package to enter the ₹30,000 milestone lucky draws (at 600, 1000 & 1500 reviews).
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 gap-3.5 pt-2">
        {platforms.map((p) => {
          const isSelected = selectedPlatform === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPlatform(p.id)}
              className={`cursor-pointer rounded-2xl p-5 sm:p-6 border-2 transition-all duration-300 flex items-center justify-between shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-black bg-stone-50 ring-2 ring-black/10 scale-[1.01]'
                  : 'border-stone-200 bg-white hover:border-stone-400'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-14 h-14 rounded-2xl p-2.5 flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="font-display font-black text-sm uppercase tracking-wider">
                    {p.name.slice(0, 3)}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-black text-stone-900 text-base sm:text-lg uppercase tracking-tight">
                      {p.name}
                    </h3>
                    <span className={`text-[9px] font-mono-tech font-bold px-2.5 py-0.5 rounded-full ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{p.tagline}</p>
                  <p className="text-[11px] font-mono-tech text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{p.perk}</span>
                  </p>
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-xs'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {isSelected && <CheckCircle2 size={18} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Guarantee Note */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-stone-800 uppercase font-mono-tech text-[11px] block">
            100% Guaranteed Reward Delivery
          </span>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Every verified 5-star customer receives their lucky draw entry confirmation & store discount code via WhatsApp.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          disabled={!selectedPlatform}
          onClick={onNext}
          className={`w-full py-4 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
            selectedPlatform
              ? 'bg-black text-white hover:bg-stone-800 shadow-stone-900/20 active:scale-[0.99]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>CONTINUE TO SELECT PRODUCT</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
