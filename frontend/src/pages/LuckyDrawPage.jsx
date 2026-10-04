import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Gift,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  QrCode,
  HelpCircle,
  Users,
  ChevronDown,
} from 'lucide-react';
import { getCurrentLuckyDraw, getLuckyDrawHistory } from '../services/api';

export default function LuckyDrawPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([getCurrentLuckyDraw(), getLuckyDrawHistory()])
      .then(([currentRes, historyRes]) => {
        if (currentRes.success) setData(currentRes.data);
        if (historyRes.success) setHistory(historyRes.data || []);
      })
      .catch((err) => console.error('Failed to load lucky draw data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Month-end countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const diff = endOfMonth.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const draw = data?.draw;
  const winners = draw?.winners || [];
  const currentMonthLabel = data?.currentMonthLabel || 'This Month';
  const totalEntries = data?.totalEntriesThisMonth || 6;
  const recent = data?.recentParticipants || [];

  const faqs = [
    {
      q: 'Lucky Draw me kaun participate kar sakta hai?',
      a: 'Koi bhi customer jisne Pillowala product Amazon, Flipkart, ya Meesho se purchase kiya hai aur 5-star review dekar uska screenshot submit kiya hai, vo automatically is month-end draw me shamil ho jata hai.',
    },
    {
      q: 'Winners kaise select kiye jate hain?',
      a: 'Har month-end par, admin panel me random fair draw algorithm chalaya jata hai jo us pure month ke sabhi verified submissions me se 3 unique winners randomly pick karta hai: 1st, 2nd aur 3rd position.',
    },
    {
      q: 'Prizes kaise receive honge?',
      a: 'Lucky draw ke winners ko unke registered WhatsApp / Phone number par hamari official Pillowala desk se direct contact kiya jata hai aur cash prize direct UPI / Bank transfer ke zariye transfer kiya jata hai, aur physical gift sets unke address par dispatch kiye jate hain.',
    },
    {
      q: 'Ek customer multiple entries kar sakta hai?',
      a: 'Haan! Agar aapne multiple orders kiye hain aur alag alag verified review screenshots submit kiye hain, to aapki har review submission ek valid lucky draw entry count hoti hai.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 select-none pb-20">
      {/* Hero Header */}
      <section className="bg-stone-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Trophy size={14} className="text-amber-400" />
            <span>PILLOWALA REWARD CLUB // MONTHLY MEGA DRAW</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            MONTHLY GRAND LUCKY DRAW
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every month-end, 3 lucky customers win up to <strong>₹5,000 Cash</strong> and luxury Pillowala bed sets simply for reviewing their purchase on Amazon, Flipkart, or Meesho.
          </p>

          {/* Live Month-End Timer */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
              <Users size={14} className="text-amber-400" />
              <span><strong>{totalEntries}+ Reviews</strong> entered for {currentMonthLabel}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Clock size={14} />
              <span>
                Draw Closes In: <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12">
        {/* Prize Podiums / Current Winners */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Gift size={22} className="text-amber-500" />
                <span>Declared Winners for {draw?.monthLabel || currentMonthLabel}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Randomly selected among all verified customer review submissions.
              </p>
            </div>

            <Link
              to="/review"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md transition-all self-start sm:self-auto"
            >
              <span>Submit Your Review</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 3 Position Cards */}
          {winners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {winners.map((winner) => {
                const isGold = winner.position === 1;
                const isSilver = winner.position === 2;
                const isBronze = winner.position === 3;

                return (
                  <div
                    key={winner.position}
                    className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                      isGold
                        ? 'border-amber-400 bg-gradient-to-b from-amber-50/40 via-white to-white ring-2 ring-amber-400/30 shadow-lg'
                        : 'border-stone-200 bg-white shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Position & Platform */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase ${
                            isGold
                              ? 'bg-amber-400 text-stone-950'
                              : isSilver
                              ? 'bg-stone-200 text-stone-800'
                              : 'bg-amber-800 text-white'
                          }`}
                        >
                          {isGold ? '🥇 1st Position' : isSilver ? '🥈 2nd Position' : '🥉 3rd Position'}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-stone-50 text-stone-700">
                          {winner.purchasePlatform}
                        </span>
                      </div>

                      {/* Prize Title */}
                      <div className="space-y-1 mb-5">
                        <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest block">
                          {winner.prizeValue || (isGold ? '₹12,499 Value' : isSilver ? '₹5,999 Value' : '₹2,499 Value')}
                        </span>
                        <h3 className="font-bold text-stone-900 text-base leading-snug">
                          {winner.prizeTitle}
                        </h3>
                      </div>

                      {/* Winner Info Box */}
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Winner:</span>
                          <span className="font-bold text-stone-900">{winner.customerName}</span>
                        </div>
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-stone-400">Phone:</span>
                          <span className="text-stone-700">{winner.customerPhoneMasked || 'Verified Customer'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Product:</span>
                          <span className="text-stone-800 font-medium truncate max-w-[150px]" title={winner.productName}>
                            {winner.productName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                          <span className="text-stone-400">Rating:</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star size={13} fill="currentColor" />
                            <span>{winner.rating} / 5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Proof Button */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Verified Proof</span>
                      </span>

                      {winner.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewProof(winner.imageUrl)}
                          className="text-xs font-mono font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={13} />
                          <span>View Screenshot</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
                  ★ LIVE REWARD POOL ★
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  {currentMonthLabel} Mega Cash Draw is Active!
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
                  Submit your 5-star review screenshot from Flipkart or Meesho. On the last day of the month, 3 lucky winners will be drawn live by admin!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-3xl p-6 border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white shadow-md space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-amber-400 text-stone-950">
                    🥇 1ST POSITION (TOP PRIZE)
                  </span>
                  <div>
                    <span className="text-[11px] font-mono text-amber-600 font-bold block uppercase">DIRECT BANK / UPI TRANSFER</span>
                    <h4 className="text-3xl font-black text-stone-900 mt-1">₹15,000 Cash</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Highest cash reward for the 1st randomly selected verified customer review.
                  </p>
                </div>

                <div className="rounded-3xl p-6 border border-stone-200 bg-white shadow-xs space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-stone-200 text-stone-800">
                    🥈 2ND POSITION
                  </span>
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 font-bold block uppercase">DIRECT BANK / UPI TRANSFER</span>
                    <h4 className="text-3xl font-black text-stone-900 mt-1">₹10,000 Cash</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Cash reward for the 2nd randomly selected customer review response with photo proof.
                  </p>
                </div>

                <div className="rounded-3xl p-6 border border-stone-200 bg-white shadow-xs space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-amber-800 text-white">
                    🥉 3RD POSITION
                  </span>
                  <div>
                    <span className="text-[11px] font-mono text-amber-700 font-bold block uppercase">DIRECT BANK / UPI TRANSFER</span>
                    <h4 className="text-3xl font-black text-stone-900 mt-1">₹5,000 Cash</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Cash reward for the 3rd randomly selected customer entry for {currentMonthLabel}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Simple Steps to Win */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
              Simple 4-Step Entry Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              How to Participate & Win
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              No lottery tickets or fees. Pure rewards for our genuine marketplace customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Buy on Marketplace</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Order any Pillowala pillow or bedsheet set from Amazon, Flipkart, or Meesho.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Leave a 5-Star Review</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Post your honest 5-star review on the marketplace with a real product photo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Upload Screenshot</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Scan your QR card or visit our Review portal to upload the screenshot proof.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-mono font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-amber-950 text-sm">Month-End Selection</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                On the final day of the month, 3 winners are randomly selected for 1st, 2nd, & 3rd cash prizes!
              </p>
            </div>
          </div>
        </div>

        {/* Live Entries / Recent Participants Ticker */}
        {recent.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users size={18} className="text-amber-600" />
                <span>Recent Verified Review Entries ({currentMonthLabel})</span>
              </h3>
              <span className="text-xs font-mono text-stone-400">Live Queue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recent.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-stone-900 truncate">{item.customerName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{item.productName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white border border-stone-200 text-stone-700 shrink-0">
                    {item.purchasePlatform}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-amber-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-stone-500">
              Everything you need to know about Pillowala's Monthly Mega Lucky Draw.
            </p>
          </div>

          <div className="divide-y divide-stone-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-stone-900 text-sm hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Upload Review CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-black text-white text-center space-y-4 shadow-xl">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Don't Miss This Month's Draw
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
            CLAIM YOUR REWARD & ENTER LUCKY DRAW
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
            Upload your review screenshot now. Takes less than 60 seconds with our optimized fast upload system.
          </p>
          <div className="pt-2">
            <Link
              to="/review"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-yellow-400 transition-all cursor-pointer"
            >
              <span>SUBMIT REVIEW SCREENSHOT</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      {previewProof && (
        <div
          onClick={() => setPreviewProof(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Verified Review Proof
              </span>
              <button
                type="button"
                onClick={() => setPreviewProof(null)}
                className="text-stone-400 hover:text-stone-900 font-bold text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={previewProof}
              alt="Proof"
              className="max-h-[70vh] w-auto object-contain rounded-2xl border border-stone-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
