import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Gift,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCcw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
  Shuffle,
  Clock,
  Check,
  Lock,
  Flame,
  Award,
  Phone,
  Mail,
  ShoppingBag,
} from 'lucide-react';
import {
  getAdminLuckyDrawEligible,
  conductAdminLuckyDraw,
  toggleLuckyDrawPublish,
  deleteLuckyDraw,
  getLuckyDrawHistory,
} from '../services/api';

export default function LuckyDrawPage() {
  const [adminData, setAdminData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawingMilestone, setDrawingMilestone] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [adminOverride, setAdminOverride] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setActionError('');
      const [eligibleRes, historyRes] = await Promise.all([
        getAdminLuckyDrawEligible(),
        getLuckyDrawHistory(),
      ]);

      if (eligibleRes.success) {
        setAdminData(eligibleRes.data);
      }
      if (historyRes.success) {
        setHistory(historyRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load lucky draw data:', err);
      setActionError('Failed to load lucky draw data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConductDraw = async (milestoneNumber) => {
    try {
      setDrawingMilestone(milestoneNumber);
      setActionError('');
      setActionSuccess('');

      const res = await conductAdminLuckyDraw({
        milestoneNumber,
        adminOverride,
        status: 'published',
      });

      if (res.success) {
        setActionSuccess(res.message || `🎉 Milestone ${milestoneNumber} draw successfully conducted!`);
        await loadData();
      } else {
        setActionError(res.message || 'Draw failed.');
      }
    } catch (err) {
      console.error('Lucky draw error:', err);
      setActionError(err.response?.data?.message || 'Error conducting draw.');
    } finally {
      setDrawingMilestone(null);
    }
  };

  const handleTogglePublish = async (drawId) => {
    try {
      const res = await toggleLuckyDrawPublish(drawId);
      if (res.success) {
        setActionSuccess(`Milestone status updated to ${res.data?.status}`);
        await loadData();
      }
    } catch (err) {
      setActionError('Failed to toggle status.');
    }
  };

  const handleResetDraw = async (drawId, milestoneNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to reset Milestone ${milestoneNumber} draw? The winning review will be restored to the eligible pool and you will be able to draw again.`
      )
    ) {
      return;
    }
    try {
      const res = await deleteLuckyDraw(drawId);
      if (res.success) {
        setActionSuccess(`Milestone ${milestoneNumber} draw reset successfully.`);
        await loadData();
      }
    } catch (err) {
      setActionError('Failed to reset draw.');
    }
  };

  const totalApproved = adminData?.totalApprovedReviews ?? 0;
  const milestones = adminData?.milestones || [];
  const previousWinners = adminData?.previousWinners || [];
  const sampleEligible = adminData?.sampleEligible || [];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Trophy size={26} />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Milestone Review Lucky Draw Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review thresholds at <strong>600 (₹5K)</strong>, <strong>1,000 (₹10K)</strong>, and <strong>1,500 (₹15K)</strong>. Past winners are permanently eliminated from future draws.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono bg-stone-100 px-3 py-2 rounded-xl border border-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={adminOverride}
              onChange={(e) => setAdminOverride(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-bold text-stone-800">Admin Test Mode</span>
            <span className="text-[10px] text-stone-500">(Bypass review count)</span>
          </label>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess('')}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError('')}
            className="text-rose-700 hover:text-rose-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span>Verified Reviews</span>
            <Users size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl font-black text-stone-900 font-mono">
            {totalApproved}
          </div>
          <div className="text-[11px] text-stone-400">Total approved in database</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span>Completed Draws</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-stone-900 font-mono">
            {previousWinners.length} / 3
          </div>
          <div className="text-[11px] text-stone-400">Milestones drawn</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span>Total Cash Pool</span>
            <Award size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl font-black text-stone-900 font-mono">
            ₹30,000
          </div>
          <div className="text-[11px] text-stone-400">₹5K + ₹10K + ₹15K Cash</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span>Eliminated Winners</span>
            <ShieldCheck size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-black text-stone-900 font-mono">
            {previousWinners.length}
          </div>
          <div className="text-[11px] text-stone-400">Excluded from upcoming draws</div>
        </div>
      </div>

      {/* 3 Milestone Control Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Flame size={20} className="text-amber-500" />
            <span>Milestone Draws Control Panel</span>
          </h2>
          {adminOverride && (
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⚡ Admin Test Mode Active (Bypassing Threshold Checks)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {milestones.map((m) => {
            const isCompleted = m.isCompleted;
            const draw = m.draw;
            const winner = draw?.winner;
            const isDrawing = drawingMilestone === m.milestoneNumber;

            const isLockedSequence =
              m.milestoneNumber > 1 &&
              !adminOverride &&
              !milestones.find((prev) => prev.milestoneNumber === m.milestoneNumber - 1)?.isCompleted;

            const canDrawNow =
              !isCompleted &&
              !isLockedSequence &&
              (totalApproved >= m.target || adminOverride);

            const tierMeta = {
              1: {
                accent: 'border-stone-300 bg-white',
                headerBadge: 'bg-stone-100 text-stone-800 border-stone-300',
                poolLabel: '600 Eligible Participants',
                ruleDetail: 'All first 600 verified reviews eligible.',
              },
              2: {
                accent: 'border-amber-300 bg-gradient-to-b from-amber-50/20 via-white to-white ring-1 ring-amber-400/20',
                headerBadge: 'bg-amber-100 text-amber-900 border-amber-300',
                poolLabel: '999 Eligible Participants',
                ruleDetail: 'Milestone 1 winner permanently excluded (1000 - 1 = 999).',
              },
              3: {
                accent: 'border-yellow-400 bg-gradient-to-b from-yellow-50/30 via-white to-white ring-2 ring-yellow-400/30 shadow-md',
                headerBadge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold',
                poolLabel: '1,498 Eligible Participants',
                ruleDetail: 'Milestone 1 & 2 winners permanently excluded (1500 - 2 = 1498).',
              },
            }[m.milestoneNumber];

            return (
              <div
                key={m.milestoneNumber}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${tierMeta.accent}`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${tierMeta.headerBadge}`}>
                      Milestone {m.milestoneNumber} // {m.target} Reviews
                    </span>

                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </span>
                    ) : isLockedSequence ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-500 border border-stone-200 flex items-center gap-1">
                        <Lock size={12} />
                        <span>Sequence Locked</span>
                      </span>
                    ) : totalApproved >= m.target || adminOverride ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-stone-950 flex items-center gap-1 animate-pulse">
                        <Sparkles size={12} />
                        <span>Ready to Draw</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <Clock size={12} />
                        <span>In Progress</span>
                      </span>
                    )}
                  </div>

                  {/* Cash Prize Display */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest block">
                      Direct Cash Prize
                    </span>
                    <h3 className="text-3xl font-black text-stone-900 tracking-tight font-mono">
                      ₹{m.prizeAmount.toLocaleString('en-IN')}
                    </h3>
                  </div>

                  {/* Pool & Elimination Formula */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono space-y-1 mb-5">
                    <div className="flex justify-between items-center text-stone-800">
                      <span className="text-stone-500">Target Pool:</span>
                      <span className="font-bold text-amber-800">{tierMeta.poolLabel}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                      ⚖️ {tierMeta.ruleDetail}
                    </div>
                  </div>

                  {/* Winner Details Card (if completed) */}
                  {isCompleted && winner ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 text-xs mb-4">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                        <span className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                          <Trophy size={14} className="text-amber-500" />
                          <span>Winner Declared</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-white text-emerald-800 border border-emerald-200">
                          {winner.purchasePlatform}
                        </span>
                      </div>

                      <div className="space-y-1.5 font-mono">
                        <div className="flex justify-between text-stone-800">
                          <span className="text-stone-500">Name:</span>
                          <span className="font-bold">{winner.customerName}</span>
                        </div>
                        <div className="flex justify-between text-stone-800">
                          <span className="text-stone-500">Phone:</span>
                          <a
                            href={`https://wa.me/91${winner.customerPhone?.replace(/[^0-9]/g, '').slice(-10)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <Phone size={11} />
                            <span>{winner.customerPhone || 'N/A'}</span>
                          </a>
                        </div>
                        <div className="flex justify-between text-stone-800">
                          <span className="text-stone-500">Email:</span>
                          <span className="truncate max-w-[150px]">{winner.customerEmail || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-stone-800">
                          <span className="text-stone-500">Order ID:</span>
                          <span>{winner.orderId || 'N/A'}</span>
                        </div>
                      </div>

                      {winner.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(winner.imageUrl)}
                          className="w-full mt-2 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View Review Screenshot</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Progress Bar towards target */
                    <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-stone-500">Review Progress:</span>
                        <span className="text-stone-900 font-bold">{Math.min(totalApproved, m.target)} / {m.target}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(2, (totalApproved / m.target) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-stone-500">
                        <span>{m.progressPercent}% Target</span>
                        <span className="text-amber-800 font-bold">
                          {totalApproved >= m.target ? 'Target Met!' : `${m.target - totalApproved} reviews needed`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-stone-200/80">
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(draw._id)}
                        className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-mono font-bold uppercase tracking-wider text-stone-700 transition-colors"
                      >
                        {draw.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetDraw(draw._id, m.milestoneNumber)}
                        className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                        title="Reset this milestone draw"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canDrawNow || isDrawing}
                      onClick={() => handleConductDraw(m.milestoneNumber)}
                      className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                        canDrawNow
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black shadow-md'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <Shuffle size={14} className={isDrawing ? 'animate-spin' : ''} />
                      <span>
                        {isDrawing
                          ? 'Conducting Fair Draw...'
                          : canDrawNow
                          ? `Draw ₹${m.prizeAmount.toLocaleString('en-IN')} Winner`
                          : isLockedSequence
                          ? `Milestone ${m.milestoneNumber - 1} Required First`
                          : `Need ${m.target - totalApproved} Reviews`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Winners Hall of Fame & Payment Disbursal Desk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Gift size={20} className="text-amber-500" />
              <span>Winners Hall of Fame & Cash Disbursal Desk</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Contact declared winners directly on WhatsApp/Phone to transfer their cash prize via UPI.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-lg">
            {previousWinners.length} Winners Declared
          </span>
        </div>

        {previousWinners.length === 0 ? (
          <div className="text-center py-10 text-stone-400 font-mono text-xs">
            No milestone draws conducted yet. Reach 600 reviews to unlock Milestone 1!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Milestone</th>
                  <th className="py-3 px-3">Cash Prize</th>
                  <th className="py-3 px-3">Winner Name</th>
                  <th className="py-3 px-3">Contact (WhatsApp/UPI)</th>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Platform</th>
                  <th className="py-3 px-3">Draw Date</th>
                  <th className="py-3 px-3 text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {previousWinners.map((pw, i) => (
                  <tr key={i} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 rounded font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        Milestone {pw.milestoneNumber} ({pw.milestoneTarget} Reviews)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700 text-sm">
                      ₹{pw.prizeAmount.toLocaleString('en-IN')} Cash
                    </td>
                    <td className="py-3 px-3 font-bold text-stone-900">
                      {pw.winner.customerName}
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={`https://wa.me/91${pw.winner.customerPhone?.replace(/[^0-9]/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone size={12} />
                        <span>{pw.winner.customerPhone || 'N/A'}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-stone-600">{pw.winner.orderId || 'N/A'}</td>
                    <td className="py-3 px-3 uppercase">{pw.winner.purchasePlatform}</td>
                    <td className="py-3 px-3 text-stone-500">
                      {new Date(pw.drawDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {pw.winner.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(pw.winner.imageUrl)}
                          className="text-amber-700 hover:text-amber-600 font-bold underline cursor-pointer"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Eligible Participants Queue (Sample) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Users size={18} className="text-amber-600" />
              <span>Eligible Verified Reviews Queue (First-Come Sequence)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Only verified reviews with <strong>approved</strong> status participate. Previous winners are automatically filtered out.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-500">
            Showing {sampleEligible.length} of {totalApproved - previousWinners.length} eligible
          </span>
        </div>

        {sampleEligible.length === 0 ? (
          <div className="text-center py-8 text-stone-400 font-mono text-xs">
            No approved reviews found in database. Approve customer reviews in the Reviews tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Submitted At</th>
                  <th className="py-2.5 px-3 text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sampleEligible.slice(0, 15).map((rev) => (
                  <tr key={rev._id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-stone-900">{rev.customerName}</td>
                    <td className="py-2.5 px-3 text-stone-600">{rev.customerPhone || 'N/A'}</td>
                    <td className="py-2.5 px-3 uppercase">{rev.purchasePlatform}</td>
                    <td className="py-2.5 px-3 text-amber-500 font-bold">{rev.rating} ★</td>
                    <td className="py-2.5 px-3 text-stone-600 truncate max-w-[200px]">{rev.productName}</td>
                    <td className="py-2.5 px-3 text-stone-500">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {rev.imageUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(rev.imageUrl)}
                          className="text-amber-700 hover:text-amber-600 font-bold underline cursor-pointer"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-stone-300">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Review Proof Screenshot
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-stone-400 hover:text-stone-900 font-bold text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={previewImage}
              alt="Proof"
              className="max-h-[70vh] w-auto object-contain rounded-2xl border border-stone-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
