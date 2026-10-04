import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  Gift,
  ExternalLink,
  ArrowRight,
  Trophy,
  Hash,
  Phone,
  User
} from 'lucide-react';
import { getProducts } from '../services/api';

export default function ReviewSuccessPage() {
  const location = useLocation();
  const state = location.state || {};

  const searchParams = new URLSearchParams(location.search);
  const platform =
    state.purchasePlatform || searchParams.get('platform') || 'flipkart';

  const customerName = state.customerName || 'Valued Customer';
  const customerPhone = state.customerPhone || '';
  const orderId = state.orderId || '';
  const productName = state.productName || '';
  const reviewNumber = state.reviewNumber || '1';

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#000000', '#2874F0', '#9C27B0', '#10B981'],
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Fetch companion products from the same marketplace
  useEffect(() => {
    const fetchSameMarketplaceProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ marketplace: platform });
        const items = res.data || res || [];
        const filtered = items.filter(
          (p) => !productName || p.name !== productName
        );
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Failed to load related marketplace products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (platform) {
      fetchSameMarketplaceProducts();
    }
  }, [platform, productName]);

  const platformName = platform === 'meesho' ? 'Meesho' : 'Flipkart';

  return (
    <div className="min-h-screen bg-stone-50/70 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
        {/* Main Success Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 text-center shadow-xl border border-stone-200 space-y-6 sm:space-y-8">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50/60 shadow-sm animate-bounce">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles size={13} className="text-emerald-700" />
              <span>REVIEW SUBMITTED // LUCKY DRAW ENTRY CONFIRMED</span>
            </div>

            {/* Prominent Review Number Showcase */}
            <div className="max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/25 to-amber-500/15 border-2 border-amber-400 text-stone-900 font-mono shadow-xs">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-950 text-amber-400 flex flex-col items-center justify-center shadow-md border border-amber-400/40">
                  <span className="text-[9px] uppercase font-bold text-stone-400">ENTRY</span>
                  <span className="text-base font-black leading-none text-amber-300">#{reviewNumber}</span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-stone-500 font-bold block uppercase tracking-wider">Aapka Official Review Ticket:</span>
                  <p className="text-lg font-black text-stone-900 font-sans">
                    Review #{reviewNumber} Confirmed!
                  </p>
                </div>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-stone-900 leading-tight">
              THANK YOU, {customerName.toUpperCase()}!
            </h1>

            <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Your {platformName} review proof for Order{' '}
              <span className="font-mono font-bold text-black">#{orderId || 'VERIFIED'}</span> has been successfully recorded as <strong>Review #{reviewNumber}</strong> and entered into our milestone cash draws.
            </p>
          </div>

          {/* THE ₹30,000 MILESTONE MEGA CASH DRAW CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-2xl border-2 border-amber-300 text-left space-y-5 relative overflow-hidden">
            {/* Background glowing watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
              <Trophy size={200} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center text-amber-200">
                  <Trophy size={18} />
                </div>
                <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                  MILESTONE CASH DRAW
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-black/30 text-amber-200 border border-white/20">
                TOTAL CASH POOL: ₹30,000
              </span>
            </div>

            {/* Lucky Draw Main Announcement */}
            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                WIN UP TO ₹15,000 CASH AT 600, 1,000 & 1,500 REVIEWS!
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
                Draws automatically unlock at <strong>600</strong> (₹5K), <strong>1,000</strong> (₹10K), and <strong>1,500</strong> (₹15K) reviews! Once a customer wins, they are eliminated from subsequent draws so everyone gets higher odds.
              </p>
            </div>

            {/* 3 Milestone Prize Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-yellow-300 font-bold block">
                  🥈 MILESTONE 1 (600 REVIEWS)
                </span>
                <p className="font-display font-black text-base uppercase text-white">
                  ₹5,000 Direct Cash
                </p>
                <p className="text-[10px] text-amber-200 font-mono-tech">
                  600 Participants // 1 Winner
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-yellow-300 font-bold block">
                  🥇 MILESTONE 2 (1,000 REVIEWS)
                </span>
                <p className="font-display font-black text-base uppercase text-white">
                  ₹10,000 Direct Cash
                </p>
                <p className="text-[10px] text-amber-200 font-mono-tech">
                  999 Participants (1st Winner Excluded)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-yellow-300 font-bold block">
                  👑 MILESTONE 3 (1,500 REVIEWS)
                </span>
                <p className="font-display font-black text-base uppercase text-white">
                  ₹15,000 Mega Cash
                </p>
                <p className="text-[10px] text-amber-200 font-mono-tech">
                  1,498 Participants (1st & 2nd Excluded)
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono-tech text-amber-200 flex items-center justify-between">
              <span>PRIZE DISBURSAL:</span>
              <span className="font-bold text-white uppercase">Directly via UPI on WhatsApp When Target Met</span>
            </div>
          </div>

          {/* Digital Buyer Pass Ticket */}
          <div className="max-w-lg mx-auto rounded-3xl overflow-hidden border-2 border-stone-900 bg-stone-900 text-white shadow-xl text-left">
            <div className="p-4 sm:p-5 bg-black border-b border-stone-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] text-stone-400 block">
                  PILLOWALA™ VERIFIED BUYER PASS
                </span>
                <span className="font-display font-black text-xs uppercase tracking-wider text-amber-400">
                  LUCKY DRAW TICKET #LD-{orderId ? orderId.replace(/\D/g, '').slice(-6) || '784912' : '784912'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                CONFIRMED
              </span>
            </div>

            <div className="p-5 space-y-3 font-mono-tech text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-stone-400 text-[10px] uppercase">CUSTOMER</span>
                  <p className="font-bold text-white truncate">{customerName}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-stone-400 text-[10px] uppercase">MARKETPLACE</span>
                  <p className="font-bold text-white uppercase">{platformName} Official</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-stone-400 text-[10px] uppercase">ORDER ID</span>
                  <p className="font-bold text-white truncate">{orderId || 'OD-VERIFIED'}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-stone-400 text-[10px] uppercase">WHATSAPP CONTACT</span>
                  <p className="font-bold text-emerald-400 truncate">+91 {customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-2.5 bg-black/60 border-t border-stone-800 text-[10px] font-mono-tech text-stone-400 flex items-center justify-between">
              <span>MILESTONE LUCKY DRAW ENTRY</span>
              <span className="text-emerald-400 font-bold">LUCKY TICKET ACTIVE</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 rounded-full border border-stone-300 hover:border-black font-mono-tech text-xs font-bold uppercase tracking-wider text-stone-800 transition-colors cursor-pointer"
            >
              RETURN TO HOME
            </Link>
            <Link
              to="/#all-products"
              className="px-6 py-3 rounded-full bg-black text-white hover:bg-stone-800 font-mono-tech text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              EXPLORE MORE PRODUCTS →
            </Link>
          </div>
        </div>

        {/* Companion Products from the Same Marketplace */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] text-stone-500 block">
                  RECOMMENDED FOR YOU
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-900">
                  MORE FROM PILLOWALA ON {platformName.toUpperCase()}
                </h2>
              </div>
              <a
                href={platform === 'flipkart' ? 'https://www.flipkart.com' : 'https://www.meesho.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono-tech font-bold uppercase tracking-wider text-black hover:underline"
              >
                <span>VISIT OFFICIAL {platformName.toUpperCase()} STORE</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 4).map((product) => {
                const img = product.images?.[0] || 'https://rukminim2.flixcart.com/image/800/800/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg';
                const buyUrl = product.buyLinks?.[platform] || product.externalUrl || (platform === 'flipkart' ? 'https://www.flipkart.com' : 'https://www.meesho.com');

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-3.5 space-y-2.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-square rounded-xl bg-stone-100 overflow-hidden">
                        <img src={img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-display font-bold text-xs uppercase tracking-tight line-clamp-2 text-stone-900 leading-snug">
                        {product.name}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-display font-black text-sm text-stone-900">
                        ₹{Number(product.price || 499).toLocaleString('en-IN')}
                      </span>
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-mono-tech font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                      >
                        BUY →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
