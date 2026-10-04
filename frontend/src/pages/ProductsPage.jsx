import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMarketplace = searchParams.get('marketplace') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marketplace, setMarketplace] = useState(initialMarketplace);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Load products based on filters
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (marketplace !== 'all') params.marketplace = marketplace;
        if (selectedCategory !== 'all') params.categoryId = selectedCategory;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await getProducts(params);
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [marketplace, selectedCategory, searchQuery]);

  const handleMarketplaceChange = (m) => {
    setMarketplace(m);
    if (m === 'all') {
      searchParams.delete('marketplace');
    } else {
      searchParams.set('marketplace', m);
    }
    setSearchParams(searchParams);
  };

  const platforms = [
    { id: 'all', name: 'All Products' },
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'meesho', name: 'Meesho' },
  ];

  return (
    <div className="py-12 bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Our Complete Product Catalog
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Explore authentic Pillowala sleep essentials and bedsheets available on Flipkart and Meesho.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-soft mb-8 space-y-4">
          {/* Top Row: Marketplace Tabs & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Marketplace Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleMarketplaceChange(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    marketplace === p.id
                      ? 'bg-brand-charcoal text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pillows by name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
            </div>
          </div>

          {/* Bottom Row: Master Collections & Category Filters */}
          {categories.length > 0 && (
            <div className="pt-2 border-t border-stone-100 text-xs space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-stone-400 font-semibold shrink-0">Collection:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl shrink-0 transition-all font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-brand-charcoal text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Catalog
                </button>
                {/* Find pillows and bedsheets root categories */}
                {categories
                  .filter((c) => c.slug === 'pillows' || c.slug === 'bedsheets' || c.parentCategory === 'root' || c.isMain)
                  .map((rootCat) => (
                    <button
                      key={rootCat._id}
                      onClick={() => setSelectedCategory(rootCat.slug || rootCat._id)}
                      className={`px-3.5 py-1.5 rounded-xl shrink-0 transition-all font-bold ${
                        selectedCategory === rootCat._id || selectedCategory === rootCat.slug
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                    >
                      {rootCat.slug === 'pillows' ? '🛌 ' : '🛏️ '}
                      {rootCat.name}
                    </button>
                  ))}
              </div>

              {/* Subcategories Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-stone-400 text-[11px] shrink-0">Types:</span>
                {categories
                  .filter((c) => c.slug !== 'pillows' && c.slug !== 'bedsheets' && c.parentCategory !== 'root')
                  .map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => setSelectedCategory(sub._id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 text-[11px] transition-colors ${
                        selectedCategory === sub._id
                          ? 'bg-brand-100 text-brand-900 font-bold border border-brand-300'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/50'
                      }`}
                    >
                      <span className="opacity-60 mr-1">
                        {sub.parentCategory === 'bedsheets' ? '🛏️' : '🛌'}
                      </span>
                      {sub.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <LoadingSpinner text="Loading pillow catalog..." />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-soft max-w-md mx-auto">
            <ShoppingBag size={48} className="text-stone-300 mx-auto mb-4" />
            <h3 className="font-bold text-stone-800 text-lg">No Pillows Found</h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Try adjusting your search terms or clearing the selected marketplace/category filters.
            </p>
            <button
              onClick={() => {
                setMarketplace('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
