import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { getProducts } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await getProducts({});
        const items = res.data || [];
        setProducts(items);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'flipkart') return p.marketplace === 'flipkart';
    if (activeFilter === 'meesho') return p.marketplace === 'meesho';
    if (activeFilter === 'bedsheets') return (p.categoryId?.slug?.includes('bedsheet') || p.name?.toLowerCase().includes('bedsheet'));
    if (activeFilter === 'pillows') return (!p.name?.toLowerCase().includes('bedsheet'));
    return true;
  });

  const flipkartCount = products.filter((p) => p.marketplace === 'flipkart').length;
  const meeshoCount = products.filter((p) => p.marketplace === 'meesho').length;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Verified Marketplace Catalog</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Our Complete Collection
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Explore authentic Pillowala sleep essentials live on India's top marketplaces with guaranteed factory-direct pricing.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Products ({products.length})
            </button>

            <button
              onClick={() => setActiveFilter('flipkart')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                activeFilter === 'flipkart'
                  ? 'bg-[#2874F0] text-white shadow-sm'
                  : 'bg-blue-50 hover:bg-blue-100 text-[#2874F0]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2874F0]"></span>
              Flipkart ({flipkartCount})
            </button>

            <button
              onClick={() => setActiveFilter('meesho')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                activeFilter === 'meesho'
                  ? 'bg-[#9F2089] text-white shadow-sm'
                  : 'bg-pink-50 hover:bg-pink-100 text-[#9F2089]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#9F2089]"></span>
              Meesho ({meeshoCount})
            </button>

            <button
              onClick={() => setActiveFilter('bedsheets')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'bedsheets'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Bedsheets
            </button>

            <button
              onClick={() => setActiveFilter('pillows')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === 'pillows'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Pillows & Cushions
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner text="Loading Pillowala catalog..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-stone-50 rounded-2xl">
            No products found matching this filter.
          </div>
        ) : (
          /* Dynamic Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((p, index) => {
              const mainImg =
                p.images && p.images.length > 0
                  ? p.images[0]
                  : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800';
              const isFlipkart = p.marketplace === 'flipkart';
              const discount =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={p._id || index}
                  className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-soft transition-all duration-300 overflow-hidden relative"
                >
                  {/* Badge: Marketplace & Discount */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-2xs ${
                        isFlipkart
                          ? 'bg-[#2874F0] text-white border-[#2874F0]'
                          : 'bg-[#9F2089] text-white border-[#9F2089]'
                      }`}
                    >
                      {isFlipkart ? 'Flipkart' : 'Meesho'}
                    </span>
                    {discount && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Image Container */}
                  <div className="w-full aspect-[4/3] bg-stone-50/50 p-4 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={mainImg}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        title={p.name}
                        className="font-sans text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 leading-snug"
                      >
                        {p.name}
                      </h3>
                      {p.categoryId?.name && (
                        <p className="text-[11px] text-stone-400 font-medium mt-1">
                          {p.categoryId.name}
                        </p>
                      )}
                    </div>

                    {/* Price and Rating */}
                    <div className="pt-2 border-t border-stone-100 flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-stone-900">
                            ₹{p.price}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-stone-500">
                          <div className="flex text-amber-400 text-xs">★</div>
                          <span className="font-semibold text-stone-700">{p.rating || 4.4}</span>
                          <span>({p.reviewCount || 340})</span>
                        </div>
                      </div>

                      {/* Buy / Review CTA */}
                      {p.externalUrl ? (
                        <a
                          href={p.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-stone-900 hover:bg-[#0066FF] transition-colors shadow-2xs"
                        >
                          <span>Buy</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link
                          to="/review"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-stone-900 hover:bg-[#0066FF] transition-colors shadow-2xs"
                        >
                          Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Full Catalog Link */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-stone-900 hover:bg-black text-white transition-all shadow-sm hover:shadow-md"
          >
            <span>View All {products.length} Products in Catalog</span>
            <span>▸</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
