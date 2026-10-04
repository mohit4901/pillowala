import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Star,
  Calendar,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Hash,
  ExternalLink,
} from 'lucide-react';
import AdminHeader from '../components/layout/AdminHeader';
import {
  getReviews,
  updateReviewStatus,
  deleteReview,
  downloadReviewExport,
} from '../services/api';

export default function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [platform, setPlatform] = useState('all');
  const [rating, setRating] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals state
  const [viewingReview, setViewingReview] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchReviewsList = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: status || 'all',
      };
      if (search.trim()) params.search = search.trim();
      if (platform !== 'all') params.purchasePlatform = platform;
      if (rating !== 'all') params.rating = rating;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getReviews(params);
      setReviews(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync status if URL query changes
  useEffect(() => {
    const qStatus = searchParams.get('status');
    if (qStatus && qStatus !== status) {
      setStatus(qStatus);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchReviewsList();
  }, [currentPage, status, platform, rating, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviewsList();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReviewStatus(id, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      if (viewingReview && viewingReview._id === id) {
        setViewingReview((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this verification record?')) {
      return;
    }
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setTotalCount((prev) => Math.max(prev - 1, 0));
      if (viewingReview && viewingReview._id === id) {
        setViewingReview(null);
      }
    } catch (err) {
      alert('Failed to delete review: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);
      const params = {};
      if (status !== 'all') params.status = status;
      if (platform !== 'all') params.purchasePlatform = platform;
      if (rating !== 'all') params.rating = rating;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (search.trim()) params.search = search.trim();

      await downloadReviewExport(format, params);
    } catch (err) {
      alert('Failed to export reviews: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle size={12} />
            <span>Verified</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle size={12} />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock size={12} />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  const getPlatformBadge = (p) => {
    const map = {
      amazon: 'bg-amber-50 text-amber-900 border-amber-300',
      flipkart: 'bg-blue-50 text-blue-900 border-blue-300',
      meesho: 'bg-pink-50 text-pink-900 border-pink-300',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
          map[p] || 'bg-stone-100 text-stone-700 border-stone-300'
        }`}
      >
        {p}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-stone-50">
      <AdminHeader
        title="Marketplace Review Verification & Monthly Export"
        subtitle="Verify customer screenshots from Amazon, Flipkart, & Meesho and export reports"
      />

      <div className="p-8 space-y-6 flex-1">
        {/* Top Control Bar: Filters & Export */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID, Customer, Phone, or Product..."
                className="w-full pl-9 pr-20 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-semibold"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleExport('xlsx')}
                disabled={exporting}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet size={15} />
                <span>Export XLSX (Excel)</span>
              </button>

              <button
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <FileText size={15} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-stone-100 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Verification</option>
                <option value="approved">Verified / Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none font-medium"
              >
                <option value="all">All Platforms</option>
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="meesho">Meesho</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none font-medium"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
                <option value="3">3 Stars ★★★☆☆</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Reviews Data Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">
              Showing {reviews.length} of {totalCount} submissions
            </span>
            <button
              onClick={fetchReviewsList}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Order ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer & Contact</th>
                  <th className="py-3.5 px-4 font-bold">Platform</th>
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold text-center">Proof Screenshot</th>
                  <th className="py-3.5 px-4 font-bold">Rating</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-400">
                      Loading submissions...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-400">
                      No review verification records found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                        {new Date(r.createdAt).toISOString().split('T')[0]}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-stone-900 text-xs">
                        {r.orderId || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{r.customerName}</div>
                        {r.customerPhone && (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <Phone size={10} />
                            <span>{r.customerPhone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPlatformBadge(r.purchasePlatform)}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="line-clamp-1 font-medium text-stone-900" title={r.productName}>
                          {r.productName}
                        </span>
                      </td>
                      {/* Screenshot Proof Column */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {r.imageUrl ? (
                          <button
                            onClick={() => setPhotoPreview(r.imageUrl)}
                            className="relative group w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-xs inline-block hover:scale-105 transition-transform"
                            title="Click to zoom screenshot proof"
                          >
                            <img
                              src={r.imageUrl}
                              alt="Marketplace review screenshot"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                              Zoom
                            </div>
                          </button>
                        ) : (
                          <span className="text-stone-300 text-[10px]">No Photo</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center text-amber-500 font-bold">
                          <span>{r.rating}</span>
                          <span className="ml-0.5">★</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(r.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingReview(r)}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                            title="Inspect Proof & Details"
                          >
                            <Eye size={15} />
                          </button>

                          {r.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(r._id, 'approved')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="Verify & Approve Screenshot"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}

                          {r.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(r._id, 'rejected')}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                              title="Reject Screenshot"
                            >
                              <XCircle size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                Verification Proof & Order Info
              </h3>
              <button
                onClick={() => setViewingReview(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">Order ID:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{viewingReview.orderId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">Customer:</span>
                  <span className="font-bold text-stone-800">{viewingReview.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">WhatsApp / Phone:</span>
                  <span className="font-bold text-emerald-700">{viewingReview.customerPhone || 'N/A'}</span>
                </div>
                {viewingReview.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">Email:</span>
                    <span className="font-mono text-stone-600">{viewingReview.customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-medium">Marketplace:</span>
                  {getPlatformBadge(viewingReview.purchasePlatform)}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-400 font-medium">Product:</span>
                <span className="font-semibold text-stone-800 text-right max-w-xs">{viewingReview.productName}</span>
              </div>

              {/* Screenshot Proof */}
              {viewingReview.imageUrl && (
                <div>
                  <span className="text-stone-700 font-bold block mb-1">
                    Uploaded Review Screenshot Proof:
                  </span>
                  <div
                    onClick={() => setPhotoPreview(viewingReview.imageUrl)}
                    className="cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 flex items-center justify-center border-2 border-stone-300 hover:border-amber-500 transition-colors"
                  >
                    <img
                      src={viewingReview.imageUrl}
                      alt="Review proof"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 block text-center mt-1">
                    (Click image to view in full resolution)
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-500">{getStatusBadge(viewingReview.status)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(viewingReview._id, 'approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Verify Screenshot
                </button>
                <button
                  onClick={() => handleStatusChange(viewingReview._id, 'rejected')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Resolution Photo Modal */}
      {photoPreview && (
        <div
          onClick={() => setPhotoPreview(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPhotoPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={20} />
            </button>
            <img src={photoPreview} alt="Full resolution proof" className="w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
