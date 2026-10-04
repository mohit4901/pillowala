import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  QrCode,
  Sparkles
} from 'lucide-react';
import { getProducts } from '../../services/api';

export default function RoyalCatalogGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const items = res?.data || res || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setProducts(items);
        }
      } catch (err) {
        console.error('Failed to load royal catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Marketplace filter
      if (selectedMarketplace !== 'all') {
        const pMarket = (p.marketplace || '').toLowerCase();
        if (selectedMarketplace === 'flipkart' && pMarket !== 'flipkart') return false;
        if (selectedMarketplace === 'meesho' && pMarket !== 'meesho') return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catName = (p.categoryId?.name || p.category || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        if (selectedCategory === 'bedsheet') {
          if (!catName.includes('bedsheet') && !pName.includes('bedsheet') && !pName.includes('fitted') && !pName.includes('flat')) {
            return false;
          }
        } else if (selectedCategory === 'pillow') {
          if (!catName.includes('pillow') && !catName.includes('cushion') && !pName.includes('pillow') && !pName.includes('cushion') && !pName.includes('bolster')) {
            return false;
          }
        }
      }

      // Price filter
      const price = Number(p.price) || 0;
      if (price > priceRange) return false;

      return true;
    });
  }, [products, selectedMarketplace, selectedCategory, priceRange]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSelectedMarketplace('all');
    setSelectedCategory('all');
    setPriceRange(1000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const getDirectBuyUrl = (product) => {
    if (product.buyLinks?.flipkart) return product.buyLinks.flipkart;
    if (product.buyLinks?.meesho) return product.buyLinks.meesho;
    if (product.affiliateUrl) return product.affiliateUrl;
    if (product.url) return product.url;
    if (product.marketplace === 'flipkart') return 'https://www.flipkart.com';
    return 'https://www.meesho.com';
  };

  return (
    <section id="royal-catalog" className="w-full bg-[#FAF7F2] text-[#2A1519] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCCB] select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C5A059]/40">
          <div className="space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-[#8A5A2B] block">
              ✦ COMPLETE CATALOG // 29 AUTHENTIC TEXTILES
            </span>
            <h2 className="font-royal text-2xl sm:text-4xl font-bold uppercase tracking-wider text-[#54111B]">
              THE COMPLETE ROYAL ARCHIVE
            </h2>
            <p className="text-xs sm:text-sm font-serif text-[#6E5558]">
              Browse all handcrafted winter velvet bedsheets and micro-bounce pillows with direct Flipkart and Meesho dispatch.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#54111B] text-[#FAF7F2] shadow-sm font-bold'
                  : 'bg-white text-[#54111B] border border-[#E8DCCB] hover:border-[#C5A059]'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('bedsheet'); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'bedsheet'
                  ? 'bg-[#54111B] text-[#FAF7F2] shadow-sm font-bold'
                  : 'bg-white text-[#54111B] border border-[#E8DCCB] hover:border-[#C5A059]'
              }`}
            >
              Bedsheets (21)
            </button>
            <button
              onClick={() => { setSelectedCategory('pillow'); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'pillow'
                  ? 'bg-[#54111B] text-[#FAF7F2] shadow-sm font-bold'
                  : 'bg-white text-[#54111B] border border-[#E8DCCB] hover:border-[#C5A059]'
              }`}
            >
              Pillows & Cushions (8)
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Filter Sidebar + 4-Col Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filter */}
          <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-6 h-fit lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <span className="font-royal text-xs font-bold uppercase tracking-wider text-[#54111B] flex items-center gap-1.5">
                <SlidersHorizontal size={14} />
                <span>FILTER COLLECTION</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[10px] font-serif uppercase text-[#8A5A2B] hover:text-[#54111B]"
              >
                <RotateCcw size={11} />
                <span>RESET</span>
              </button>
            </div>

            {/* Platform Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#54111B] block">
                PLATFORM
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Marketplaces' },
                  { id: 'flipkart', label: 'Flipkart Official (11)', color: 'bg-[#2874F0]' },
                  { id: 'meesho', label: 'Meesho Store (18)', color: 'bg-[#9C27B0]' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMarketplace(m.id); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif transition-colors text-left ${
                      selectedMarketplace === m.id
                        ? 'bg-[#FAF7F2] text-[#54111B] font-bold border border-[#C5A059]'
                        : 'text-[#6E5558] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {m.color && <span className={`w-2 h-2 rounded-full ${m.color}`} />}
                      <span>{m.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2 border-t border-[#E8DCCB] pt-4">
              <div className="flex items-center justify-between text-xs font-serif">
                <span className="font-bold text-[#54111B]">MAX PRICE</span>
                <span className="font-bold text-[#8A5A2B]">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-[#54111B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-serif text-[#8A5A2B]">
                <span>₹200</span>
                <span>₹600</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-2 border-t border-[#E8DCCB] pt-4">
              <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#54111B] block">
                SORT ORDER
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D5C6B1] rounded-xl px-3 py-2 text-xs font-serif text-[#54111B] focus:outline-none"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Review Reward Reminder */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#FDF9EE] to-[#FAF7F2] border border-[#C5A059]/50 text-center space-y-2">
              <div className="flex justify-center text-[#C5A059]">
                <Sparkles size={16} />
              </div>
              <h4 className="font-royal text-xs font-bold uppercase text-[#54111B]">
                BOUGHT FROM FLIPKART?
              </h4>
              <p className="text-[10px] font-serif text-[#6E5558] leading-tight">
                Submit screenshot review to receive direct UPI cashback.
              </p>
              <Link
                to="/review"
                className="block py-1.5 px-3 rounded-full bg-[#54111B] text-[#FAF7F2] font-serif text-[10px] uppercase font-bold tracking-wider hover:bg-[#701A26] transition-colors"
              >
                Claim Reward →
              </Link>
            </div>
          </aside>

          {/* Right Product Cards (4 Columns) */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-[#F3ECE0] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E8DCCB] space-y-3">
                <p className="font-serif text-sm text-[#6E5558]">No products found for this filter combination.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 rounded-full bg-[#54111B] text-[#FAF7F2] text-xs font-royal font-bold uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((p) => {
                  const isFlipkart = (p.marketplace || '').toLowerCase() === 'flipkart';
                  const primaryImg = p.images?.[0] || 'https://rukminim2.flixcart.com/image/800/800/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg';
                  const buyUrl = getDirectBuyUrl(p);

                  return (
                    <div
                      key={p._id || p.name}
                      className="group flex flex-col bg-white rounded-xl border border-[#E8DCCB] hover:border-[#C5A059] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md"
                    >
                      {/* Product Image Frame */}
                      <div className="relative aspect-[3/4] w-full bg-[#F5EFE6] overflow-hidden">
                        <img
                          src={primaryImg}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Top Left Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-serif uppercase tracking-wider text-white font-bold shadow-xs ${
                              isFlipkart ? 'bg-[#2874F0]' : 'bg-[#9C27B0]'
                            }`}
                          >
                            {isFlipkart ? 'FLIPKART' : 'MEESHO'}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-serif text-[#8A5A2B]">
                            <span className="flex items-center gap-1 text-amber-600 font-bold">
                              <Star size={10} fill="currentColor" />
                              <span>4.8</span>
                            </span>
                            <span className="text-emerald-700 font-medium">In Stock</span>
                          </div>

                          <h3
                            title={p.name}
                            className="font-serif text-xs font-semibold text-[#54111B] line-clamp-2 min-h-[32px] group-hover:text-[#8A5A2B] transition-colors leading-tight"
                          >
                            {p.name}
                          </h3>
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="pt-2 border-t border-[#E8DCCB]/60 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="font-royal text-base font-bold text-[#54111B]">
                              ₹{p.price || 499}
                            </span>
                            {p.mrp && p.mrp > p.price && (
                              <span className="text-[10px] font-serif text-stone-400 line-through">
                                ₹{p.mrp}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <a
                              href={buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`py-1.5 px-2 rounded-lg text-[10px] font-serif font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1 text-white transition-all shadow-xs ${
                                isFlipkart
                                  ? 'bg-[#2874F0] hover:bg-blue-600'
                                  : 'bg-[#9C27B0] hover:bg-purple-600'
                              }`}
                            >
                              <span>BUY</span>
                              <ExternalLink size={10} />
                            </a>

                            <Link
                              to={`/review?productId=${p._id}`}
                              className="py-1.5 px-2 rounded-lg text-[10px] font-serif font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1 bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#54111B] border border-[#E8DCCB] transition-colors"
                            >
                              <QrCode size={10} />
                              <span>RATE</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#E8DCCB] pt-4 text-xs font-serif text-[#6E5558]">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-full border border-[#D5C6B1] disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-full bg-[#54111B] text-[#FAF7F2] disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
