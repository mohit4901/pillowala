import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import { getOffers } from '../../services/api';

import OfferTemplateCard from '../common/OfferTemplateCard';

export default function CurrentOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data.data || []);
      } catch (err) {
        console.error('Failed to load offers:', err);
      }
    };
    loadOffers();
  }, []);

  if (offers.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50/70 via-brand-50 to-orange-50/50 border-y border-brand-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500 mb-1">
              <Sparkles size={14} />
              <span>Exclusive Savings</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Current Marketplace Offers & Coupons
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.slice(0, 4).map((offer) => (
            <OfferTemplateCard key={offer._id} offer={offer} previewMode={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
