import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareQuote, CheckCircle2, QrCode } from 'lucide-react';
import { getApprovedReviews } from '../../services/api';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await getApprovedReviews({ limit: 6 });
        setReviews(data.data || []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const marketplaceColors = {
    amazon: 'text-[#FF9900] bg-amber-50 border-amber-200',
    flipkart: 'text-[#2874F0] bg-blue-50 border-blue-200',
    meesho: 'text-[#F43397] bg-pink-50 border-pink-200',
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-500 font-semibold text-xs tracking-wider uppercase mb-2">
              <MessageSquareQuote size={15} />
              <span>Real Experiences From Real Indian Homes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Verified Customer Reviews
            </h2>
            <p className="text-stone-500 text-sm mt-2 max-w-lg">
              Every review below is submitted by a customer who scanned the QR card included with their Pillowala package.
            </p>
          </div>

          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-50 border border-brand-200 hover:bg-brand-100 text-brand-700 font-semibold text-xs tracking-wide transition-colors"
          >
            <QrCode size={15} />
            <span>Have a pillow? Review it here</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching verified customer reviews..." />
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center bg-brand-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
            No customer reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => {
              const platformClass =
                marketplaceColors[r.purchasePlatform] ||
                'text-stone-700 bg-stone-50 border-stone-200';

              return (
                <div
                  key={r._id}
                  className="bg-brand-50/70 rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-300"
                >
                  <div>
                    {/* Header: Stars + Platform Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={r.rating} size={16} />
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${platformClass}`}
                      >
                        {r.purchasePlatform}
                      </span>
                    </div>

                    {/* Customer Photo if available */}
                    {r.imageUrl && (
                      <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-stone-200 border border-stone-200">
                        <img
                          src={r.imageUrl}
                          alt="Customer product photo"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Review text */}
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                      "{r.reviewText}"
                    </p>
                  </div>

                  {/* Customer Info and Product */}
                  <div className="pt-4 border-t border-brand-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                      <span>{r.customerName}</span>
                      <CheckCircle2 size={13} className="text-emerald-600 inline" />
                      <span className="text-[10px] font-normal text-stone-500">Verified Buyer</span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      Product: <span className="font-medium text-stone-700">{r.productName}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
