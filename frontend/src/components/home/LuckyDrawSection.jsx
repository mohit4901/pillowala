import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Gift,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { getCurrentLuckyDraw } from '../../services/api';

export default function LuckyDrawSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    getCurrentLuckyDraw()
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error('Failed to load lucky draw:', err))
      .finally(() => setLoading(false));
  }, []);

  // Month-end countdown timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Last day of current month at 23:59:59
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const diff = endOfMonth.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
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

  const platformBadges = {
    amazon: { bg: 'bg-amber-100 text-amber-900 border-amber-300', label: 'Amazon Verified' },
    flipkart: { bg: 'bg-blue-100 text-blue-900 border-blue-300', label: 'Flipkart Verified' },
    meesho: { bg: 'bg-rose-100 text-rose-900 border-rose-300', label: 'Meesho Verified' },
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={14} className="animate-pulse" />
            <span>₹30,000 CASH POOL // MONTH-END MEGA LUCKY DRAW</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            WIN UP TO ₹15,000 CASH <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              EVERY MONTH-END
            </span>
          </h2>

          <p className="text-stone-400 text-xs sm:text-base leading-relaxed">
            Rated us on <strong>Flipkart</strong> or <strong>Meesho</strong>? Scan your package QR card, submit your 5-star review screenshot, and automatically enter our ₹30,000 cash lucky draw (1st: ₹15K, 2nd: ₹10K, 3rd: ₹5K)!
          </p>

          {/* Live Month-End Countdown & Participant Counter */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-300">
              <Users size={14} className="text-amber-400" />
              <span><strong>{totalEntries}+ Verified Reviews</strong> entered this month</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Clock size={14} />
              <span>
                Next Draw Closes In: <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Positions Display (1st, 2nd, 3rd) */}
        {winners.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Trophy size={20} className="text-amber-400" />
                  <span>Official Winners — {draw.monthLabel || currentMonthLabel}</span>
                </h3>
                <span className="text-xs text-stone-400">
                  Drawn randomly from all verified 5-star customer reviews
                </span>
              </div>

              <Link
                to="/lucky-draw"
                className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Archive</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {winners.map((winner) => {
                const isGold = winner.position === 1;
                const isSilver = winner.position === 2;
                const isBronze = winner.position === 3;

                const positionStyles = isGold
                  ? {
                      border: 'border-amber-400/60 shadow-2xl shadow-amber-500/10 bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 ring-1 ring-amber-400/40',
                      badge: 'bg-gradient-to-r from-amber-400 to-yellow-600 text-stone-950',
                      crown: '🥇 1ST POSITION (GRAND PRIZE)',
                      titleColor: 'text-amber-300',
                    }
                  : isSilver
                  ? {
                      border: 'border-stone-700 bg-stone-900/90 shadow-lg',
                      badge: 'bg-gradient-to-r from-stone-300 to-stone-500 text-stone-950',
                      crown: '🥈 2ND POSITION',
                      titleColor: 'text-stone-200',
                    }
                  : {
                      border: 'border-stone-700 bg-stone-900/90 shadow-lg',
                      badge: 'bg-gradient-to-r from-amber-700 to-amber-900 text-white',
                      crown: '🥉 3RD POSITION',
                      titleColor: 'text-amber-200',
                    };

                const badgeInfo = platformBadges[winner.purchasePlatform] || {
                  bg: 'bg-stone-800 text-stone-300',
                  label: winner.purchasePlatform,
                };

                return (
                  <div
                    key={winner.position}
                    className={`rounded-3xl p-6 sm:p-7 border relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${positionStyles.border}`}
                  >
                    <div>
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider ${positionStyles.badge}`}>
                          {positionStyles.crown}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeInfo.bg}`}>
                          {badgeInfo.label}
                        </span>
                      </div>

                      {/* Prize Details */}
                      <div className="space-y-1 mb-5">
                        <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                          {winner.prizeValue || 'Official Reward'}
                        </span>
                        <h4 className={`text-base sm:text-lg font-bold leading-snug ${positionStyles.titleColor}`}>
                          {winner.prizeTitle}
                        </h4>
                      </div>

                      {/* Winner Card Info */}
                      <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Winner:</span>
                          <span className="font-bold text-white text-sm">{winner.customerName}</span>
                        </div>

                        <div className="flex items-center justify-between font-mono">
                          <span className="text-stone-400">Phone:</span>
                          <span className="text-stone-300">{winner.customerPhoneMasked || 'Verified Customer'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Product:</span>
                          <span className="text-stone-300 truncate max-w-[150px] font-medium" title={winner.productName}>
                            {winner.productName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                          <span className="text-stone-400">Review Rating:</span>
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star size={13} fill="currentColor" />
                            <span>{winner.rating} / 5 Stars</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Proof Button */}
                    <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck size={14} />
                        <span>Screenshot Verified</span>
                      </span>

                      {winner.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewProof(winner.imageUrl)}
                          className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={13} />
                          <span>View Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Default Prize Showcase if draw not yet published */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl p-7 border border-amber-400/50 bg-gradient-to-b from-stone-900 to-amber-950/20 shadow-xl space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-amber-400 text-stone-950">
                🥇 1ST POSITION (GRAND PRIZE)
              </span>
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 font-bold">TOP WINNER</span>
                <h4 className="text-2xl font-black text-amber-300">
                  ₹15,000 Cash
                </h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct bank / UPI cash transfer to the 1st randomly selected verified customer review for {currentMonthLabel}.
              </p>
            </div>

            <div className="rounded-3xl p-7 border border-stone-700 bg-stone-900 space-y-4 shadow-md">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-stone-300 text-stone-950">
                🥈 2ND POSITION
              </span>
              <div className="space-y-1">
                <span className="text-xs font-mono text-stone-300 font-bold">RUNNER UP</span>
                <h4 className="text-2xl font-black text-stone-200">
                  ₹10,000 Cash
                </h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct bank / UPI cash transfer to the 2nd randomly selected verified reviewer with screenshot proof.
              </p>
            </div>

            <div className="rounded-3xl p-7 border border-stone-700 bg-stone-900 space-y-4 shadow-md">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-amber-800 text-white">
                🥉 3RD POSITION
              </span>
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 font-bold">3RD WINNER</span>
                <h4 className="text-2xl font-black text-amber-200">
                  ₹5,000 Cash
                </h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct bank / UPI cash transfer to the 3rd randomly selected customer review response.
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 sm:mt-16 p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-stone-800 to-blue-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Gift size={20} className="text-amber-400" />
              <span>Ready to Enter the Month-End Lucky Draw?</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Submit your Amazon, Flipkart, or Meesho review screenshot in under 60 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/lucky-draw"
              className="px-5 py-3 rounded-full border border-stone-600 hover:border-white text-xs font-mono font-bold uppercase tracking-wider text-stone-300 hover:text-white transition-all"
            >
              How It Works
            </Link>

            <Link
              to="/review"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>Upload Review Now</span>
              <ArrowRight size={14} />
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
            className="bg-stone-900 border border-stone-700 rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck size={15} />
                <span>Verified Customer Review Proof</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewProof(null)}
                className="text-stone-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={previewProof}
              alt="Winner proof"
              className="max-h-[70vh] w-auto object-contain rounded-2xl border border-stone-800"
            />
          </div>
        </div>
      )}
    </section>
  );
}
