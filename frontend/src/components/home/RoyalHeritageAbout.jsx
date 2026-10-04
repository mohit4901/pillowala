import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function RoyalHeritageAbout() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setName('');
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-[#FAF7F2] text-[#2A1519] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCCB] select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: ABOUT US (Framed Royal Photo) matching reference image */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-royal text-xl font-bold uppercase tracking-wider text-[#54111B] border-b border-[#C5A059]/40 pb-2">
            ABOUT US
          </h3>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#C5A059]/60 shadow-md bg-[#F3ECE0]">
            <img
              src="/assets/royal/arch1.jpg"
              alt="Pillowala Royal Heritage"
              className="w-full h-full object-cover filter brightness-[0.95]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#54111B]/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 inset-x-3 text-center text-[#FAF7F2]">
              <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#E4CA88] block">
                PANIPAT WEAVING MILLS
              </span>
              <span className="font-royal text-xs font-bold uppercase">
                ESTABLISHED 2022
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: HERITAGE COLLECTIONS (Story + 3 Gold Stars) matching reference image */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h3 className="font-royal text-xl font-bold uppercase tracking-wider text-[#54111B] border-b border-[#C5A059]/40 pb-2">
              HERITAGE COLLECTIONS
            </h3>
          </div>

          <p className="font-serif text-xs sm:text-sm text-[#4A3538] leading-relaxed">
            Rooted in the historic textile capital of Panipat, Pillowala crafts authentic Indian bedding textiles that bridge royal craftsmanship with modern sleep ergonomics. We eliminate synthetic odors and unbreathable polyester—delivering genuine 350 TC winter velvet flannel and 200 TC long-staple cotton directly to your doorstep.
          </p>

          <p className="font-serif text-xs sm:text-sm text-[#4A3538] leading-relaxed">
            Every product is fulfilled through official Flipkart and Meesho channels, providing 100% verified buyer protection, fast pan-India transit, and guaranteed satisfaction.
          </p>

          {/* 3 Golden Stars & Pillars matching reference image */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8DCCB]">
            {/* Pillar 1 */}
            <div className="text-center p-2 rounded-lg bg-white/70 border border-[#E8DCCB] space-y-1">
              <div className="flex justify-center text-[#C5A059]">
                <Star size={16} fill="currentColor" />
              </div>
              <h4 className="font-royal text-[10px] font-bold uppercase text-[#54111B]">
                100% PURE
              </h4>
              <p className="text-[9px] font-serif text-[#6E5558] line-clamp-2">
                Pure virgin microfibre & combed cotton.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="text-center p-2 rounded-lg bg-white/70 border border-[#E8DCCB] space-y-1">
              <div className="flex justify-center text-[#C5A059]">
                <Star size={16} fill="currentColor" />
              </div>
              <h4 className="font-royal text-[10px] font-bold uppercase text-[#54111B]">
                MILL DIRECT
              </h4>
              <p className="text-[9px] font-serif text-[#6E5558] line-clamp-2">
                Factory pricing straight from the looms.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="text-center p-2 rounded-lg bg-white/70 border border-[#E8DCCB] space-y-1">
              <div className="flex justify-center text-[#C5A059]">
                <Star size={16} fill="currentColor" />
              </div>
              <h4 className="font-royal text-[10px] font-bold uppercase text-[#54111B]">
                VERIFIED
              </h4>
              <p className="text-[9px] font-serif text-[#6E5558] line-clamp-2">
                Flipkart & Meesho 5-star customer ratings.
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Royal VIP / Newsletter Card matching reference image */}
        <div className="lg:col-span-4 bg-[#FBF9F5] border border-[#C5A059]/60 rounded-2xl p-6 shadow-md space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs text-[#C5A059]">✦ ✦ ✦</span>
            <h4 className="font-royal text-lg font-bold uppercase tracking-wider text-[#54111B]">
              THE ROYAL CIRCLE
            </h4>
            <p className="text-xs font-serif text-[#6E5558] max-w-xs mx-auto">
              Subscribe for private release notices, festive deals & review reward multipliers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
            <div>
              <input
                type="text"
                placeholder="Your Full Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#D5C6B1] bg-white text-xs font-serif text-[#54111B] placeholder-[#A49480] focus:outline-none focus:border-[#54111B]"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email Address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#D5C6B1] bg-white text-xs font-serif text-[#54111B] placeholder-[#A49480] focus:outline-none focus:border-[#54111B]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#54111B] via-[#701A26] to-[#54111B] hover:opacity-95 text-[#FAF7F2] font-royal font-bold text-xs uppercase tracking-[0.2em] shadow-md transition-all cursor-pointer"
            >
              JOIN THE CIRCLE
            </button>

            {subscribed && (
              <p className="text-center text-xs font-serif text-emerald-700 animate-fadeIn">
                ✓ Welcome to the Pillowala Royal Circle!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
