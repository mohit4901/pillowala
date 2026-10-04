import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getProducts } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StepProduct({
  platform,
  selectedProduct,
  onSelectProduct,
  onNext,
  onBack,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchPlatformProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProducts({ marketplace: platform });
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products for marketplace:', err);
        setError('Could not load products. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    if (platform) {
      fetchPlatformProducts();
    }
  }, [platform]);

  const platformName = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : 'Marketplace';

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (
        (typeof p.category === 'string' ? p.category : p.category?.name || p.category?.slug) ||
        (typeof p.categoryId === 'string' ? p.categoryId : p.categoryId?.name || p.categoryId?.slug) ||
        ''
      ).toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      // Category filter
      if (categoryFilter === 'bedsheets' && !cat.includes('bedsheet') && !name.includes('bedsheet') && !name.includes('sheet')) {
        return false;
      }
      if (categoryFilter === 'pillows' && !cat.includes('pillow') && !name.includes('pillow') && !name.includes('bolster') && !name.includes('cushion')) {
        return false;
      }

      // Search query
      if (q && !name.includes(q)) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      <div className="text-center space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-900 leading-tight">
          WHICH ITEM DID YOU ORDER?
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Select your purchased product from our official <span className="font-bold text-stone-900">{platformName}</span> catalog.
        </p>
      </div>

      {/* Quick Search & Category Tabs */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by pillow or bedsheet title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-200 text-xs font-mono-tech placeholder:text-stone-400 focus:outline-none focus:border-black bg-stone-50/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${products.length})` },
            { id: 'bedsheets', label: 'Bedsheets' },
            { id: 'pillows', label: 'Pillows' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-black text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text={`Loading ${platformName} catalog...`} />
      ) : error ? (
        <div className="p-6 text-center bg-red-50 rounded-2xl border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs space-y-2">
          <p>No products found matching "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
            className="text-xs font-bold text-black underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1">
          {filteredProducts.map((prod) => {
            const isSelected = selectedProduct?._id === prod._id;
            const img =
              prod.images && prod.images.length > 0
                ? prod.images[0]
                : 'https://rukminim2.flixcart.com/image/800/800/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg';

            return (
              <div
                key={prod._id}
                onClick={() => onSelectProduct(prod)}
                className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex items-center justify-between gap-3 shadow-xs hover:shadow-sm ${
                  isSelected
                    ? 'border-black bg-stone-50 ring-2 ring-black/10 scale-[1.01]'
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={img}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-display font-bold text-stone-900 text-xs uppercase tracking-tight line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-stone-900 text-sm">
                        ₹{Number(prod.price || 499).toLocaleString('en-IN')}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] font-mono-tech text-stone-400 line-through">
                          ₹{Number(prod.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 size={16} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>BACK</span>
        </button>

        <button
          type="button"
          disabled={!selectedProduct}
          onClick={onNext}
          className={`flex-1 py-3.5 px-6 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
            selectedProduct
              ? 'bg-black text-white hover:bg-stone-800 shadow-stone-900/20 active:scale-[0.99]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>CONTINUE TO RATE ON APP</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
