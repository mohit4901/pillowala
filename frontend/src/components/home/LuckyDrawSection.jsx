import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Gift,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Users,
  Lock,
  Flame,
  Check,
} from 'lucide-react';
import { getCurrentLuckyDraw } from '../../services/api';

export default function LuckyDrawSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState(null);

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

  const totalReviews = data?.totalApprovedReviews ?? 0;
  const milestones = data?.milestones || [
    {
      milestoneNumber: 1,
      target: 600,
      prizeAmount: 5000,
      prizeTitle: '₹5,000 Direct Cash Prize',
      prizeLabel: 'Milestone 1 — 600 Reviews',
      expectedParticipants: 600,
      excludedPreviousCount: 0,
      badge: 'Tier 1 // Silver',
      status: 'in_progress',
      progressPercent: Math.min(100, Math.round((totalReviews / 600) * 100)),
      remainingReviews: Math.max(0, 600 - totalReviews),
    },
    {
      milestoneNumber: 2,
      target: 1000,
      prizeAmount: 10000,
      prizeTitle: '₹10,000 Direct Cash Prize',
      prizeLabel: 'Milestone 2 — 1,000 Reviews',
      expectedParticipants: 999,
      excludedPreviousCount: 1,
      badge: 'Tier 2 // Gold',
      status: 'in_progress',
      progressPercent: Math.min(100, Math.round((totalReviews / 1000) * 100)),
      remainingReviews: Math.max(0, 1000 - totalReviews),
    },
    {
      milestoneNumber: 3,
      target: 1500,
      prizeAmount: 15000,
      prizeTitle: '₹15,000 Mega Cash Prize',
      prizeLabel: 'Milestone 3 — 1,500 Reviews',
      expectedParticipants: 1498,
      excludedPreviousCount: 2,
      badge: 'Tier 3 // Diamond Mega',
      status: 'in_progress',
      progressPercent: Math.min(100, Math.round((totalReviews / 1500) * 100)),
      remainingReviews: Math.max(0, 1500 - totalReviews),
    },
  ];

  const recent = data?.recentParticipants || [];

  const platformBadges = {
    amazon: { bg: 'bg-amber-100 text-amber-900 border-amber-300', label: 'Amazon Verified' },
    flipkart: { bg: 'bg-blue-100 text-blue-900 border-blue-300', label: 'Flipkart Verified' },
    meesho: { bg: 'bg-rose-100 text-rose-900 border-rose-300', label: 'Meesho Verified' },
  };

  // Active milestone for current progress highlight
  const activeMilestone = milestones.find((m) => m.status !== 'completed') || milestones[2];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Flame size={14} className="text-amber-400 animate-pulse" />
            <span>MILESTONE REWARD CLUB // ₹30,000 TOTAL CASH POOL</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            WIN UP TO ₹15,000 DIRECT CASH <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              AT 600, 1,000 & 1,500 REVIEWS
            </span>
          </h2>

          <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
            No calendar deadlines! Lucky draws automatically unlock as verified customer reviews accumulate on{' '}
            <strong className="text-white">Flipkart</strong> & <strong className="text-white">Meesho</strong>. 
            Once selected, winners are permanently excluded from upcoming draws to maximize everyone&apos;s chances!
          </p>

          {/* Live System Progress Bar */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Users size={14} className="text-amber-400" />
                  <span>Total Verified Reviews in System:</span>
                </span>
                <span className="text-white font-bold text-sm bg-stone-800 px-2.5 py-0.5 rounded-lg border border-stone-700">
                  {totalReviews} Reviews
                </span>
              </div>

              {/* Progress bar towards active target */}
              <div className="w-full bg-stone-950 rounded-full h-3 border border-stone-800 overflow-hidden relative mb-2.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(2, (totalReviews / activeMilestone.target) * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                <span>Active Target: <strong>{activeMilestone.target} Reviews ({activeMilestone.prizeTitle})</strong></span>
                <span className="text-amber-400 font-bold">
                  {activeMilestone.status === 'completed'
                    ? 'Completed'
                    : totalReviews >= activeMilestone.target
                    ? 'Target Reached! Ready to Draw'
                    : `${activeMilestone.remainingReviews} reviews to unlock`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {milestones.map((m) => {
            const isCompleted = m.status === 'completed';
            const isUnlocked = m.status === 'unlocked';
            const winner = m.winner || (m.draw ? m.draw.winner : null);

            const tierMeta = {
              1: {
                border: 'border-stone-700 hover:border-amber-400/50',
                headerBadge: 'bg-stone-800 text-stone-300 border-stone-700',
                accentText: 'text-stone-200',
                icon: '🥈',
                oddsText: '600 Participants // 1 Lucky Winner',
                exclusionNotice: 'All first 600 verified reviews eligible',
              },
              2: {
                border: 'border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 shadow-xl shadow-amber-500/5',
                headerBadge: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
                accentText: 'text-amber-300',
                icon: '🥇',
                oddsText: '999 Participants // 1 Lucky Winner',
                exclusionNotice: '1st Winner permanently excluded from this draw',
              },
              3: {
                border: 'border-yellow-400/70 bg-gradient-to-b from-stone-900 via-stone-900 to-yellow-950/30 shadow-2xl shadow-yellow-500/10 ring-1 ring-yellow-400/30',
                headerBadge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-black',
                accentText: 'text-yellow-400',
                icon: '👑',
                oddsText: '1,498 Participants // 1 Mega Winner',
                exclusionNotice: '1st & 2nd Winners permanently excluded from this draw',
              },
            }[m.milestoneNumber];

            return (
              <div
                key={m.milestoneNumber}
                className={`rounded-3xl p-6 sm:p-7 border relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${tierMeta.border}`}
              >
                <div>
                  {/* Top Tier Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${tierMeta.headerBadge}`}>
                      {tierMeta.icon} Milestone {m.milestoneNumber} ({m.target} Reviews)
                    </span>

                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Winner Declared</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-stone-950 flex items-center gap-1 animate-pulse">
                        <Sparkles size={12} />
                        <span>Ready to Draw</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-800 text-stone-400 border border-stone-700 flex items-center gap-1">
                        <Lock size={12} />
                        <span>In Progress</span>
                      </span>
                    )}
                  </div>

                  {/* Prize Amount */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                      Guaranteed Direct Cash Prize
                    </span>
                    <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${tierMeta.accentText}`}>
                      ₹{m.prizeAmount.toLocaleString('en-IN')} Cash
                    </h3>
                  </div>

                  {/* Odds & Exclusion Rule Banner */}
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 space-y-1.5 text-xs font-mono mb-5">
                    <div className="flex items-center justify-between text-stone-300">
                      <span className="text-stone-400">Draw Pool:</span>
                      <span className="font-bold text-amber-300">{tierMeta.oddsText}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/70">
                      ⚖️ <strong>Rule:</strong> {tierMeta.exclusionNotice}
                    </div>
                  </div>

                  {/* Body Content: Winner Card OR Progress Bar */}
                  {isCompleted && winner ? (
                    <div className="p-4 rounded-2xl bg-stone-950/90 border border-amber-500/30 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Winner:</span>
                        <span className="font-bold text-white text-sm">{winner.customerName}</span>
                      </div>

                      <div className="flex items-center justify-between font-mono">
                        <span className="text-stone-400">Phone:</span>
                        <span className="text-stone-300 font-semibold">{winner.customerPhoneMasked || 'Verified Customer'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Platform:</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-800 text-stone-200 border border-stone-700">
                          {winner.purchasePlatform}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                        <span className="text-stone-400">Cash Received:</span>
                        <span className="font-bold text-emerald-400">₹{m.prizeAmount.toLocaleString('en-IN')} UPI Transferred</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-stone-400">Milestone Progress:</span>
                        <span className="text-white font-bold">{Math.min(totalReviews, m.target)} / {m.target}</span>
                      </div>

                      <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-stone-800">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(2, (totalReviews / m.target) * 100))}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-mono text-stone-400">
                        <span>{m.progressPercent}% Reached</span>
                        <span className="text-amber-400 font-semibold">
                          {m.remainingReviews > 0 ? `${m.remainingReviews} reviews left` : 'Unlocked!'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>Verified Review Entries</span>
                  </span>

                  {winner?.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewProof(winner.imageUrl)}
                      className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye size={13} />
                      <span>Proof</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Core Rules Banner */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <strong className="text-white block font-sans text-sm mb-0.5">Automated Milestones</strong>
              <span className="text-stone-400">
                Draw 1 unlocks at 600 reviews (₹5K). Draw 2 at 1,000 reviews (₹10K). Draw 3 at 1,500 reviews (₹15K).
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <strong className="text-white block font-sans text-sm mb-0.5">Strict Winner Exclusion</strong>
              <span className="text-stone-400">
                Winner #1 cannot participate in Draw 2 (999 participants). Winners #1 & #2 cannot participate in Draw 3 (1,498 participants).
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
              3
            </div>
            <div>
              <strong className="text-white block font-sans text-sm mb-0.5">Direct UPI Cash Transfer</strong>
              <span className="text-stone-400">
                Pillowala desk directly contacts the winner on their registered phone number for instant UPI transfer.
              </span>
            </div>
          </div>
        </div>

        {/* Live Recent Participants Feed Ticker */}
        {recent.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Users size={14} />
                <span>Live Verified Review Entrants:</span>
              </span>
              <span>1 Review = 1 Automatic Entry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recent.slice(0, 4).map((r, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 truncate">{r.customerName}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-stone-800 text-stone-300">
                      {r.purchasePlatform}
                    </span>
                  </div>
                  <div className="text-stone-400 font-mono text-[10px]">{r.customerPhoneMasked}</div>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                    <Star size={11} fill="currentColor" />
                    <span>{r.rating} Star Verified Review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 sm:mt-16 p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-stone-800 to-blue-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Gift size={20} className="text-amber-400" />
              <span>Ready to Enter the ₹30,000 Milestone Cash Draw?</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Rated us on Flipkart or Meesho? Submit your review screenshot now to claim your lucky draw ticket!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/lucky-draw"
              className="px-5 py-3 rounded-full border border-stone-600 hover:border-white text-xs font-mono font-bold uppercase tracking-wider text-stone-300 hover:text-white transition-all"
            >
              Draw Rules & Archive
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
