import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  ArrowUpRight,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  QrCode,
  X
} from 'lucide-react';
import { getProducts } from '../../services/api';

export default function EverydaySelection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
        console.error('Failed to load everyday products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products based on user selections
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Marketplace filter
      if (selectedMarketplace !== 'all') {
        const pMarket = (p.marketplace || '').toLowerCase();
        if (selectedMarketplace === 'flipkart' && pMarket !== 'flipkart') return false;
        if (selectedMarketplace === 'meesho' && pMarket !== 'meesho') return false;
      }

      // Master Category filter
      if (selectedCategory !== 'all') {
        const pCategory = (
          (typeof p.category === 'string' ? p.category : p.category?.name || p.category?.slug) ||
          (typeof p.categoryId === 'string' ? p.categoryId : p.categoryId?.name || p.categoryId?.slug) ||
          ''
        ).toLowerCase();
        const pName = (p.name || '').toLowerCase();
        if (selectedCategory === 'bedsheet') {
          const isBedsheet = pCategory.includes('bedsheet') || pName.includes('bedsheet') || pName.includes('sheet');
          if (!isBedsheet) return false;
        }
        if (selectedCategory === 'pillow') {
          const isPillow = pCategory.includes('pillow') || pName.includes('pillow') || pName.includes('bolster') || pName.includes('cushion');
          if (!isPillow) return false;
        }
      }

      // Fabric / Spec filter
      if (selectedFabric !== 'all') {
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();
        if (selectedFabric === 'velvet') {
          if (!pName.includes('flannel') && !pName.includes('velvet') && !pDesc.includes('velvet')) return false;
        }
        if (selectedFabric === 'cotton') {
          if (!pName.includes('cotton') && !pDesc.includes('cotton')) return false;
        }
        if (selectedFabric === 'fiber') {
          if (!pName.includes('fibre') && !pName.includes('fiber') && !pName.includes('microfibre')) return false;
        }
      }

      // Price filter
      const pPrice = Number(p.price || 0);
      if (pPrice > priceRange) return false;

      return true;
    });
  }, [products, selectedMarketplace, selectedCategory, selectedFabric, priceRange]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedMarketplace !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedFabric !== 'all') count++;
    if (priceRange < 1000) count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [selectedMarketplace, selectedCategory, selectedFabric, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedMarketplace('all');
    setSelectedCategory('all');
    setSelectedFabric('all');
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

  // Reusable Filter Content (used in Desktop Sidebar and Mobile Collapsible)
  const renderFilterControls = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 font-mono-tech text-xs font-bold uppercase tracking-wider text-black">
          <SlidersHorizontal size={14} />
          <span>FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1 text-[11px] font-mono-tech text-stone-500 hover:text-black transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>RESET</span>
        </button>
      </div>

      {/* Platform Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-stone-600 block">
          PLATFORM
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-1 gap-1.5">
          {[
            { id: 'all', label: 'All', count: products.length },
            { id: 'flipkart', label: 'Flipkart', count: 11, color: 'bg-[#2874F0]' },
            { id: 'meesho', label: 'Meesho', count: 18, color: 'bg-[#9C27B0]' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setSelectedMarketplace(item.id); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono-tech transition-colors text-left cursor-pointer ${
                selectedMarketplace === item.id
                  ? 'bg-black text-white font-bold shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {item.color && <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />}
                <span className="truncate">{item.label}</span>
              </span>
              <span className={`text-[10px] hidden sm:inline ${selectedMarketplace === item.id ? 'text-stone-300' : 'text-stone-400'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Textile Spec Filter */}
      <div className="space-y-2 border-t border-stone-200 pt-4">
        <label className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-stone-600 block">
          TEXTILE SPECIFICATION
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Textiles' },
            { id: 'velvet', label: '350 TC Flannel Velvet' },
            { id: 'cotton', label: '200 TC Pure Cotton' },
            { id: 'fiber', label: 'Microfiber Pillows' },
          ].map((fab) => (
            <button
              key={fab.id}
              onClick={() => { setSelectedFabric(fab.id); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono-tech transition-colors text-left cursor-pointer ${
                selectedFabric === fab.id
                  ? 'bg-black text-white font-bold shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{fab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 border-t border-stone-200 pt-4">
        <div className="flex items-center justify-between text-[11px] font-mono-tech">
          <span className="font-bold uppercase tracking-wider text-stone-600">MAX PRICE</span>
          <span className="text-black font-black">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="200"
          max="1000"
          step="50"
          value={priceRange}
          onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono-tech text-stone-500">
          <span>₹200</span>
          <span>₹600</span>
          <span>₹1000+</span>
        </div>
      </div>

      {/* Sort Order */}
      <div className="space-y-2 border-t border-stone-200 pt-4">
        <label className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-stone-600 block">
          SORT ORDER
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono-tech text-stone-900 focus:outline-none focus:border-black cursor-pointer"
        >
          <option value="featured">Featured / Bestsellers</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Product Name (A-Z)</option>
        </select>
      </div>

      {/* Quick Review Portal Banner */}
      <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-100/80 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-amber-700 font-bold">
          <Sparkles size={13} />
          <span>BOUGHT FROM FLIPKART/MEESHO?</span>
        </div>
        <p className="text-[10px] font-mono-tech text-stone-600 leading-relaxed">
          Scan your QR code or submit screenshot to claim cash rewards.
        </p>
        <Link
          to="/review"
          className="inline-flex items-center gap-1 text-xs font-mono-tech font-bold uppercase tracking-wider text-black hover:underline pt-0.5"
        >
          <span>CLAIM REWARD NOW →</span>
        </Link>
      </div>
    </div>
  );

  return (
    <section id="catalog" className="bg-white text-stone-900 py-10 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 border-t border-b border-stone-200 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-stone-200">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-[0.3em] text-stone-500">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              <span>CATALOG // ARCHIVE 2026</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none">
              EVERYDAY // SELECTION
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-stone-600">
              Showing {sortedProducts.length} factory-direct textiles across Flipkart & Meesho
            </p>
          </div>

          {/* Quick Category Filters & Pagination Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                ALL ({products.length})
              </button>
              <button
                onClick={() => { setSelectedCategory('bedsheet'); setCurrentPage(1); }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'bedsheet'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                BEDSHEETS (21)
              </button>
              <button
                onClick={() => { setSelectedCategory('pillow'); setCurrentPage(1); }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'pillow'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                PILLOWS (8)
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider bg-stone-100 border border-stone-300 text-black hover:bg-stone-200 transition-colors ml-auto cursor-pointer"
            >
              <SlidersHorizontal size={12} />
              <span>FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Pagination Controls Top Right */}
            <div className="hidden sm:flex items-center gap-1 ml-auto border border-stone-200 rounded-full p-1 bg-stone-50">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-black disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-mono-tech font-bold flex items-center justify-center transition-all ${
                    currentPage === i + 1
                      ? 'bg-black text-white'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-black disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Collapsible Filter Drawer (Expands only on mobile when clicked) */}
        {mobileFiltersOpen && (
          <div className="lg:hidden mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 animate-fadeIn">
            {renderFilterControls()}
          </div>
        )}

        {/* Main Content Layout: Left Filter Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 sm:pt-10">
          {/* Left Sidebar Filter (Visible on desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-stone-50 p-6 rounded-2xl border border-stone-200 h-fit lg:sticky lg:top-24">
            {renderFilterControls()}
          </aside>

          {/* Right Product Grid Column: 2 columns on mobile, 3 on lg, 4 on xl */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 sm:h-80 bg-stone-100 rounded-2xl animate-pulse border border-stone-200"
                  />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-24 border border-dashed border-stone-200 rounded-3xl space-y-4">
                <p className="font-mono-tech text-stone-500 text-sm">No products match your active filter combination.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-black text-white font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Mobile: 2-column compact grid, Tablet: 3 columns, Desktop: 4 columns */
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
                {paginatedProducts.map((product) => {
                  const isFlipkart = (product.marketplace || '').toLowerCase() === 'flipkart';
                  const primaryImg = product.images?.[0] || 'https://rukminim2.flixcart.com/image/800/800/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg';
                  const buyUrl = getDirectBuyUrl(product);

                  return (
                    <div
                      key={product._id || product.name}
                      className="group flex flex-col bg-white rounded-xl sm:rounded-2xl border border-stone-200 hover:border-black transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md"
                    >
                      {/* Product Image Frame */}
                      <div className="relative aspect-square sm:aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02]"
                          loading="lazy"
                        />

                        {/* Top Left Marketplace Badge */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                          <span
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-widest text-white shadow-xs ${
                              isFlipkart ? 'bg-[#2874F0]' : 'bg-[#9C27B0]'
                            }`}
                          >
                            {isFlipkart ? 'FLIPKART' : 'MEESHO'}
                          </span>
                        </div>

                        {/* Top Right Thread Count / Special Badge */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-800 border border-stone-200">
                            {product.name.toLowerCase().includes('350') ? '350 TC' : product.name.toLowerCase().includes('cotton') ? '100% COTTON' : 'SUPER BOUNCE'}
                          </span>
                        </div>
                      </div>

                      {/* Product Metadata & Action Bar */}
                      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-white">
                        <div className="space-y-1 sm:space-y-1.5">
                          {/* Rating & In-Stock */}
                          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono-tech text-stone-500">
                            <span className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold">
                              <Star size={10} fill="currentColor" />
                              <span>4.8</span>
                              <span className="text-stone-400">({product.reviewsCount || '120+'})</span>
                            </span>
                            <span className="text-emerald-600 flex items-center gap-0.5 font-medium text-[8px] sm:text-[10px]">
                              <CheckCircle2 size={9} />
                              <span>IN STOCK</span>
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3
                            title={product.name}
                            className="font-display font-bold text-[11px] sm:text-xs uppercase tracking-tight text-black line-clamp-2 min-h-[28px] sm:min-h-[32px] group-hover:text-stone-700 transition-colors leading-snug"
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="pt-1.5 sm:pt-2 border-t border-stone-100 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="font-display text-sm sm:text-lg font-black text-black">
                                ₹{product.price || 499}
                              </span>
                              {product.mrp && product.mrp > product.price && (
                                <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-400 line-through">
                                  ₹{product.mrp}
                                </span>
                              )}
                            </div>
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-[9px] sm:text-[10px] font-mono-tech text-emerald-600 font-bold">
                                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                            <a
                              href={buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-all ${
                                isFlipkart
                                  ? 'bg-[#2874F0] hover:bg-blue-600 text-white shadow-xs'
                                  : 'bg-[#9C27B0] hover:bg-purple-600 text-white shadow-xs'
                              }`}
                            >
                              <span>BUY</span>
                              <ExternalLink size={10} />
                            </a>

                            <Link
                              to={`/review?productId=${product._id}`}
                              className="py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
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

            {/* Bottom Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 pt-6">
                <span className="text-xs font-mono-tech text-stone-500">
                  Page {currentPage} of {totalPages} ({sortedProducts.length} products)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-300 text-xs font-mono-tech text-stone-700 hover:text-black hover:border-black disabled:opacity-30 disabled:hover:border-stone-300 transition-colors cursor-pointer"
                  >
                    PREVIOUS
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black text-white text-xs font-mono-tech font-bold hover:bg-stone-800 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    NEXT
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
