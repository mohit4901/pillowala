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
  Lock,
  Flame,
  Award,
  Scale,
} from 'lucide-react';
import { getCurrentLuckyDraw, getLuckyDrawHistory } from '../services/api';

export default function LuckyDrawPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState(null);
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

  const totalReviews = data?.totalApprovedReviews ?? 0;
  const totalSubmitted = data?.totalSubmittedReviews ?? totalReviews;
  const nextReviewNum = data?.nextReviewNumber ?? (totalSubmitted + 1);
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

  const faqs = [
    {
      q: 'Lucky Draw kab conduct hota hai? Kya koi month-end deadline hai?',
      a: 'Nahi! Ye monthly deadline par based nahi hai. Ye Review Milestones par chalta hai. Jaise hi 600 verified reviews complete hote hain, 1st Lucky Draw open ho jata hai (₹5,000 Cash). 1,000 reviews par 2nd Lucky Draw khulta hai (₹10,000 Cash), aur 1,500 reviews par 3rd Mega Lucky Draw khulta hai (₹15,000 Cash)!',
    },
    {
      q: 'Pichle winner agle lucky draw me part le sakte hain?',
      a: 'Nahi! Fair play ke liye rule ye hai ki jo customer ek milestone me winner ban jata hai, vo agle draws me participate nahi karega. Iska matlab: Milestone 2 me 1,000 me se 1 winner minus hoke 999 log hi compete karenge! Aur Milestone 3 me 1,500 me se 2 previous winners minus hoke 1,498 log hi ₹15,000 ke liye compete karenge.',
    },
    {
      q: 'Winners kaise select kiye jate hain?',
      a: 'Cryptographically secure fair random selection algorithm use hota hai jo un verified customer reviews me se unbiased tarike se winner choose karta hai jinhone valid screenshot ke sath review submit kiya ho.',
    },
    {
      q: 'Cash prize kaise milega?',
      a: 'Winner nikalte hi Pillowala team direct unke registered WhatsApp / Phone number par call karke verify karti hai aur prize direct unke UPI (Google Pay, PhonePe, Paytm) ya Bank Account me instant transfer kar diya jata hai.',
    },
    {
      q: 'Ek customer multiple reviews submit kar sakta hai?',
      a: 'Haan! Agar aapne Flipkart ya Meesho se alag alag orders kiye hain aur har order ka verified review screenshot upload karte hain, to har approved review ek separate lucky draw entry mani jayegi.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 select-none pb-20">
      {/* Hero Header */}
      <section className="bg-stone-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Flame size={14} className="text-amber-400 animate-pulse" />
            <span>PILLOWALA REWARD CLUB // ₹30,000 CASH MILESTONE ENGINE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            MILESTONE MEGA CASH DRAWS
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            No calendar deadlines! Lucky draws automatically unlock at <strong>600</strong>, <strong>1,000</strong> & <strong>1,500</strong> verified customer reviews on Flipkart & Meesho.
          </p>

          {/* Live System Counter */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
              <Users size={14} className="text-amber-400" />
              <span><strong>{totalSubmitted} Total Reviews Submitted</strong></span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border-2 border-amber-400 text-amber-300 shadow-sm">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Aapka Submission: <strong className="text-white underline decoration-amber-400">Review #{nextReviewNum}</strong> Hoga!</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200">
              <Award size={14} className="text-amber-400" />
              <span>Cash Pool: <strong>₹30,000 Direct Cash</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-12">
        {/* 3 Milestone Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Trophy size={22} className="text-amber-500" />
                <span>The 3 Milestone Lucky Draws</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Reviews automatically unlock higher tiers. Previous winners are permanently excluded from future draws!
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m) => {
              const isCompleted = m.status === 'completed';
              const isUnlocked = m.status === 'unlocked';
              const winner = m.winner || (m.draw ? m.draw.winner : null);

              const tierStyle = {
                1: {
                  cardBg: 'border-stone-200 bg-stone-50/50',
                  badge: 'bg-stone-200 text-stone-800 border-stone-300',
                  icon: '🥈',
                  title: 'Tier 1 // Silver',
                  rule: '600 Participants // 1 Winner',
                  note: 'Open to the first 600 verified reviews',
                },
                2: {
                  cardBg: 'border-amber-300 bg-gradient-to-b from-amber-50/40 via-white to-white ring-1 ring-amber-400/30',
                  badge: 'bg-amber-100 text-amber-900 border-amber-300',
                  icon: '🥇',
                  title: 'Tier 2 // Gold',
                  rule: '999 Participants // 1 Winner',
                  note: 'Winner #1 is excluded (1000 - 1 = 999)',
                },
                3: {
                  cardBg: 'border-yellow-400 bg-gradient-to-b from-yellow-50/50 via-white to-white ring-2 ring-yellow-400/40 shadow-lg',
                  badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold',
                  icon: '👑',
                  title: 'Tier 3 // Diamond Mega',
                  rule: '1,498 Participants // 1 Winner',
                  note: 'Winners #1 & #2 excluded (1500 - 2 = 1498)',
                },
              }[m.milestoneNumber];

              return (
                <div
                  key={m.milestoneNumber}
                  className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${tierStyle.cardBg}`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${tierStyle.badge}`}>
                        {tierStyle.icon} Milestone {m.milestoneNumber} ({m.target})
                      </span>

                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Declared</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-stone-950 flex items-center gap-1">
                          <Sparkles size={12} />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                          <Lock size={12} />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* Prize Value */}
                    <div className="space-y-1 mb-4">
                      <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest block">
                        Cash Prize
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                        ₹{m.prizeAmount.toLocaleString('en-IN')} Cash
                      </h3>
                    </div>

                    {/* Participant Pool & Exclusion Note */}
                    <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1 text-xs font-mono mb-5 shadow-xs">
                      <div className="flex justify-between items-center text-stone-800">
                        <span className="text-stone-500">Participant Pool:</span>
                        <span className="font-bold text-amber-700">{tierStyle.rule}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                        ⚖️ {tierStyle.note}
                      </div>
                    </div>

                    {/* Winner Details OR Progress Bar */}
                    {isCompleted && winner ? (
                      <div className="p-4 rounded-2xl bg-stone-50 border border-amber-300 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Winner:</span>
                          <span className="font-bold text-stone-900 text-sm">{winner.customerName}</span>
                        </div>

                        <div className="flex items-center justify-between font-mono">
                          <span className="text-stone-500">Phone:</span>
                          <span className="text-stone-700 font-semibold">{winner.customerPhoneMasked}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Platform:</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                            {winner.purchasePlatform}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                          <span className="text-stone-500">Prize Status:</span>
                          <span className="font-bold text-emerald-700">₹{m.prizeAmount.toLocaleString('en-IN')} UPI Transferred</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4 rounded-2xl bg-white border border-stone-200">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-stone-500">Progress:</span>
                          <span className="text-stone-900 font-bold">{Math.min(totalReviews, m.target)} / {m.target}</span>
                        </div>

                        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(2, (totalReviews / m.target) * 100))}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[11px] font-mono text-stone-500">
                          <span>{m.progressPercent}% of target</span>
                          <span className="text-amber-700 font-semibold">
                            {m.remainingReviews > 0 ? `${m.remainingReviews} reviews left` : 'Unlocked!'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Proof footer */}
                  <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck size={14} />
                      <span>Verified Submissions</span>
                    </span>

                    {winner?.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewProof(winner.imageUrl)}
                        className="text-xs font-mono font-bold text-amber-700 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
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
        </div>

        {/* Mathematical Transparency & Exclusion Rules Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Scale size={15} />
              <span>Fair Play & Elimination Math</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              How the Participant Pool Shrinks
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Every customer gets a fair chance. A winner in Milestone 1 cannot win Milestone 2 or 3!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase">Draw #1</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-stone-200 text-stone-800">
                  Target: 600
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900">₹5,000 Cash</h3>
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Reviews:</span>
                  <strong>600</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Past Winners:</span>
                  <strong>0</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-1 text-amber-700">
                  <span>Eligible:</span>
                  <strong>600 Participants</strong>
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                1 lucky winner is chosen. This winner is permanently excluded from all upcoming draws.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase">Draw #2</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-200 text-amber-900">
                  Target: 1,000 (+400)
                </span>
              </div>
              <h3 className="text-xl font-bold text-amber-900">₹10,000 Cash</h3>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Reviews:</span>
                  <strong>1,000</strong>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Excluded Winner:</span>
                  <strong>- 1 (from Draw #1)</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-1 text-amber-800 font-bold">
                  <span>Eligible:</span>
                  <strong>999 Participants</strong>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Only the 999 remaining non-winning customers enter this draw for ₹10,000.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-yellow-50/60 border border-yellow-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-yellow-900 uppercase">Draw #3 (Mega)</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-yellow-300 text-yellow-950">
                  Target: 1,500 (+500)
                </span>
              </div>
              <h3 className="text-xl font-bold text-yellow-950">₹15,000 Cash</h3>
              <div className="p-3 bg-white rounded-xl border border-yellow-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Reviews:</span>
                  <strong>1,500</strong>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Excluded Winners:</span>
                  <strong>- 2 (from Draws #1 & #2)</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-1 text-yellow-900 font-bold">
                  <span>Eligible:</span>
                  <strong>1,498 Participants</strong>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                1 mega winner receives ₹15,000 cash out of exactly 1,498 eligible participants!
              </p>
            </div>
          </div>
        </div>

        {/* 4-Step Entry Process */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
              Simple 4-Step Entry
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              How to Participate & Win
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Zero extra fees. 100% genuine rewards for our verified marketplace buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Order on Marketplace</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Purchase any Pillowala bedsheet or pillow from Amazon, Flipkart, or Meesho.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Post 5-Star Review</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Share your positive review on the marketplace along with genuine product pictures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Upload Screenshot</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Scan the package QR card or upload your review proof screenshot on our portal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-mono font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-amber-950 text-sm">Milestone Cash Draw</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                At 600, 1,000, and 1,500 reviews, winners receive ₹5,000, ₹10,000, and ₹15,000 direct UPI cash!
              </p>
            </div>
          </div>
        </div>

        {/* Live Entries / Recent Participants Queue */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Flame size={18} />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Live Review Submissions Queue ({totalSubmitted} Reviews Received)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Abhi tak kul <strong>{totalSubmitted} reviews</strong> submit ho chuke hain. Har submission ko ek official Entry # milta hai!
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-xs flex items-center gap-1.5">
                <Sparkles size={13} className="text-stone-950 animate-pulse" />
                <span>Aapka Review: #{nextReviewNum} Hoga!</span>
              </span>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-stone-400">
              Abhi tak koi review submit nahi hua hai. Pehla review dekar Review #1 banein!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {recent.map((item, idx) => {
                const entryNum = item.entryNumber || (totalSubmitted - idx);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/30 border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-stone-950 text-amber-300 shadow-2xs flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-amber-400" />
                        <span>Review #{entryNum}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-stone-200 text-stone-700">
                        {item.purchasePlatform}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-stone-800 font-semibold line-clamp-1" title={item.productName}>
                        {item.productName || 'Pillowala Premium Product'}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mt-1.5 pt-1.5 border-t border-stone-200/70">
                        <span className="text-amber-600 font-bold">★ {item.rating || 5} Star Verified</span>
                        <span className="text-emerald-700 font-semibold">Lucky Ticket Active</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-amber-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-stone-500">
              Everything you need to know about Pillowala&apos;s Review Milestone Mega Cash Draws.
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
            Ready to Win Up to ₹15,000 Cash?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
            SUBMIT YOUR REVIEW & SECURE YOUR ENTRY
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
            Upload your Flipkart or Meesho review screenshot now. Instant entry into all upcoming milestone draws!
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
