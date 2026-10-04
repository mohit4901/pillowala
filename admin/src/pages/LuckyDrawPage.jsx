import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Gift,
  Sparkles,
  Calendar,
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
} from 'lucide-react';
import {
  getAdminLuckyDrawEligible,
  conductAdminLuckyDraw,
  toggleLuckyDrawPublish,
  deleteLuckyDraw,
  getLuckyDrawHistory,
} from '../services/api';

export default function LuckyDrawPage() {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [eligibleData, setEligibleData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Month list generator (last 6 months + next month)
  const generateMonthOptions = () => {
    const options = [];
    const base = new Date();
    for (let i = -5; i <= 1; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      options.push({ val, label });
    }
    return options.reverse();
  };

  const monthOptions = generateMonthOptions();

  const loadData = async (month = selectedMonth) => {
    try {
      setLoading(true);
      setActionError('');
      const [eligibleRes, historyRes] = await Promise.all([
        getAdminLuckyDrawEligible(month),
        getLuckyDrawHistory(),
      ]);

      if (eligibleRes.success) {
        setEligibleData(eligibleRes.data);
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
    loadData(selectedMonth);
  }, [selectedMonth]);

  const handleConductDraw = async () => {
    try {
      setDrawing(true);
      setActionError('');
      setActionSuccess('');

      const res = await conductAdminLuckyDraw({
        month: selectedMonth,
        status: 'published',
      });

      if (res.success) {
        setActionSuccess(`🎉 3 Lucky Draw Winners successfully selected and published for ${eligibleData?.monthLabel || selectedMonth}!`);
        await loadData(selectedMonth);
      } else {
        setActionError(res.message || 'Draw failed.');
      }
    } catch (err) {
      console.error('Lucky draw error:', err);
      setActionError(err.response?.data?.message || 'Error conducting draw.');
    } finally {
      setDrawing(false);
    }
  };

  const handleTogglePublish = async (drawId) => {
    try {
      const res = await toggleLuckyDrawPublish(drawId);
      if (res.success) {
        setActionSuccess(`Lucky Draw status updated to ${res.data?.status}`);
        await loadData(selectedMonth);
      }
    } catch (err) {
      setActionError('Failed to toggle status.');
    }
  };

  const handleDelete = async (drawId) => {
    if (!window.confirm('Are you sure you want to reset this lucky draw? The winning records will be cleared and you can draw again.')) {
      return;
    }
    try {
      const res = await deleteLuckyDraw(drawId);
      if (res.success) {
        setActionSuccess('Lucky draw reset successfully.');
        await loadData(selectedMonth);
      }
    } catch (err) {
      setActionError('Failed to reset draw.');
    }
  };

  const currentDraw = eligibleData?.existingDraw;
  const winners = currentDraw?.winners || [];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Trophy size={24} />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Monthly Mega Lucky Draw
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Randomly draw 3 verified customer winners (1st, 2nd, 3rd) from month-end review responses & publish to website.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs">
            <Calendar size={16} className="text-amber-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-stone-800 bg-transparent outline-none cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label} {opt.val === currentMonthStr ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadData(selectedMonth)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 shadow-xs transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Action Messages */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Month Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Month Submissions</span>
            <Users size={16} className="text-stone-400" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">
            {eligibleData?.totalInMonth || 0}
          </p>
          <span className="text-[11px] text-stone-400">All customer review responses</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Screenshot Verified</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">
            {eligibleData?.withScreenshot || 0}
          </p>
          <span className="text-[11px] text-stone-400">Valid proof attached for draw</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Marketplace Distribution</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            {eligibleData?.platformBreakdown?.map((pb) => (
              <span
                key={pb._id}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700"
              >
                {pb._id}: {pb.count}
              </span>
            ))}
            {(!eligibleData?.platformBreakdown || eligibleData.platformBreakdown.length === 0) && (
              <span className="text-xs text-stone-400">No submissions yet</span>
            )}
          </div>
          <span className="text-[11px] text-stone-400">Amazon, Flipkart, Meesho</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Draw Status</span>
            <Clock size={16} className="text-stone-400" />
          </div>
          <div className="pt-0.5">
            {currentDraw ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  currentDraw.status === 'published'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Check size={12} />
                <span>{currentDraw.status === 'published' ? 'Live on Frontend' : 'Draft / Hidden'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                <span>Not Drawn Yet</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-400">{eligibleData?.monthLabel || selectedMonth}</span>
        </div>
      </div>

      {/* Main Draw Action / Winners Showcase Area */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Gift size={20} className="text-amber-500" />
              <span>Official Winners for {eligibleData?.monthLabel || selectedMonth}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentDraw
                ? `Conducted on ${new Date(currentDraw.drawDate).toLocaleDateString()} with ${currentDraw.totalEligibleParticipants} eligible participants.`
                : 'Click button below to trigger the random 3-winner draw for this month.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentDraw && (
              <>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(currentDraw._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    currentDraw.status === 'published'
                      ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {currentDraw.status === 'published' ? 'Hide from Frontend' : 'Publish to Frontend'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(currentDraw._id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                  title="Reset and clear draw"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}

            <button
              type="button"
              disabled={drawing}
              onClick={handleConductDraw}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shuffle size={15} className={drawing ? 'animate-spin' : ''} />
              <span>{drawing ? 'Drawing Random Winners...' : currentDraw ? 'Re-Draw (Shuffle Again)' : '🎲 Conduct Random Lucky Draw'}</span>
            </button>
          </div>
        </div>

        {/* 3 Positions Display: 1st, 2nd, 3rd */}
        {winners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {winners.map((winner) => {
              const isGold = winner.position === 1;
              const isSilver = winner.position === 2;
              const isBronze = winner.position === 3;

              const badgeColor = isGold
                ? 'from-amber-400 via-amber-500 to-yellow-600 text-white'
                : isSilver
                ? 'from-slate-400 via-stone-400 to-stone-500 text-white'
                : 'from-amber-700 via-amber-800 to-amber-900 text-white';

              const platformColors = {
                amazon: 'bg-amber-100 text-amber-800 border-amber-300',
                flipkart: 'bg-blue-100 text-blue-800 border-blue-300',
                meesho: 'bg-rose-100 text-rose-800 border-rose-300',
              };

              return (
                <div
                  key={winner.position}
                  className={`relative rounded-3xl p-6 border transition-all duration-200 ${
                    isGold
                      ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 to-white ring-2 ring-amber-400/30 shadow-lg'
                      : 'border-stone-200 bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Position Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r ${badgeColor} shadow-xs`}
                    >
                      <Trophy size={13} />
                      <span>Position #{winner.position}</span>
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        platformColors[winner.purchasePlatform] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {winner.purchasePlatform}
                    </span>
                  </div>

                  {/* Prize Details */}
                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                      {winner.prizeValue || (isGold ? '₹12,499 Value' : isSilver ? '₹5,999 Value' : '₹2,499 Value')}
                    </p>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug">
                      {winner.prizeTitle}
                    </h3>
                  </div>

                  {/* Customer Information */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 font-medium">Winner:</span>
                      <span className="font-bold text-stone-900">{winner.customerName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 font-medium">Contact:</span>
                      <span className="font-mono text-stone-700 font-semibold">
                        {winner.customerPhone || winner.customerPhoneMasked || 'N/A'}
                      </span>
                    </div>

                    {winner.orderId && (
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 font-medium">Order ID:</span>
                        <span className="font-mono text-stone-700 font-semibold">{winner.orderId}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 font-medium">Product:</span>
                      <span className="font-medium text-stone-800 truncate max-w-[160px]" title={winner.productName}>
                        {winner.productName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                      <span className="text-stone-400 font-medium">Rating:</span>
                      <span className="flex items-center text-amber-500 font-bold gap-0.5">
                        <Star size={13} fill="currentColor" />
                        <span>{winner.rating} / 5</span>
                      </span>
                    </div>
                  </div>

                  {/* Screenshot Proof Preview */}
                  {winner.imageUrl ? (
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Screenshot Proof Attached</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(winner.imageUrl)}
                        className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View Proof</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                      No screenshot attached
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Gift size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-800 text-base">
                No Lucky Draw Conducted for {eligibleData?.monthLabel || selectedMonth} Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                There are {eligibleData?.totalInMonth || 0} reviews recorded this month. Click the button below to randomly pick the 1st, 2nd, and 3rd place winners!
              </p>
            </div>
            <button
              type="button"
              disabled={drawing}
              onClick={handleConductDraw}
              className="px-6 py-3 rounded-full bg-black hover:bg-stone-800 text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer"
            >
              🎲 Draw 3 Random Winners Now
            </button>
          </div>
        )}
      </div>

      {/* History / Archive Table */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Clock size={18} className="text-stone-500" />
            <span>Past Lucky Draw Archive</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase font-mono tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Draw Date</th>
                  <th className="p-3">Participants</th>
                  <th className="p-3">1st Position</th>
                  <th className="p-3">2nd Position</th>
                  <th className="p-3">3rd Position</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {history.map((h) => {
                  const first = h.winners?.find((w) => w.position === 1);
                  const second = h.winners?.find((w) => w.position === 2);
                  const third = h.winners?.find((w) => w.position === 3);

                  return (
                    <tr key={h._id} className="hover:bg-stone-50/70">
                      <td className="p-3 font-bold text-stone-900">{h.monthLabel}</td>
                      <td className="p-3 text-stone-500">{new Date(h.drawDate).toLocaleDateString()}</td>
                      <td className="p-3 font-mono font-semibold">{h.totalEligibleParticipants}</td>
                      <td className="p-3 font-semibold text-amber-700">
                        {first?.customerName || 'N/A'} ({first?.purchasePlatform})
                      </td>
                      <td className="p-3 font-semibold text-stone-600">
                        {second?.customerName || 'N/A'} ({second?.purchasePlatform})
                      </td>
                      <td className="p-3 font-semibold text-stone-600">
                        {third?.customerName || 'N/A'} ({third?.purchasePlatform})
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            h.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMonth(h.month)}
                          className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
                        >
                          View / Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className="w-full flex justify-between items-center px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Review Screenshot Proof
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
