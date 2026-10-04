import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check, Clock } from 'lucide-react';
import { getOffers } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OfferTemplateCard from '../components/common/OfferTemplateCard';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    getOffers()
      .then((res) => setOffers(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="py-12 bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1 text-brand-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Special Value Days</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Marketplace Deals & Coupons
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Apply these coupon codes during checkout on Amazon, Flipkart, or Meesho, or unlock exclusive bundles.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching active offers..." />
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 text-stone-500 text-sm max-w-md mx-auto">
            No active promotional coupons at the moment. Check back soon for festive sleep deals!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <OfferTemplateCard key={offer._id} offer={offer} previewMode={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
