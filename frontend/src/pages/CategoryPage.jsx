import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShoppingBag, Layers, CheckCircle2 } from 'lucide-react';
import { getCategoryById, getCategories, getProducts } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubFilter, setActiveSubFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMasterCollection = categoryName === 'pillows' || categoryName === 'bedsheets';

  useEffect(() => {
    setActiveSubFilter('all');
  }, [categoryName]);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      try {
        setLoading(true);
        // Load category by slug
        const catRes = await getCategoryById(categoryName);
        const cat = catRes.data;
        setCategory(cat);

        // If master category, also fetch its child subcategories
        if (isMasterCollection || cat?.parentCategory === 'root' || cat?.isMain) {
          const allCatsRes = await getCategories();
          const children = (allCatsRes.data || []).filter(
            (c) => c.parentCategory === categoryName || c.parentCategory === cat?.slug
          );
          setSubcategories(children);
        } else {
          setSubcategories([]);
        }

        // Fetch products
        const params = {};
        if (activeSubFilter !== 'all') {
          params.categoryId = activeSubFilter;
        } else if (cat?._id) {
          params.categoryId = cat._id;
        } else {
          params.categoryId = categoryName;
        }

        const prodRes = await getProducts(params);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      loadCategoryAndProducts();
    }
  }, [categoryName, activeSubFilter]);

  // Determine master category for breadcrumb/back-link
  const parentCategorySlug = category?.parentCategory && category.parentCategory !== 'root'
    ? category.parentCategory
    : null;

  return (
    <div className="py-12 bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <Link to="/products" className="hover:text-brand-500 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} />
            <span>Catalog</span>
          </Link>
          {parentCategorySlug && (
            <>
              <span className="text-stone-300">/</span>
              <Link to={`/category/${parentCategorySlug}`} className="hover:text-brand-500 transition-colors capitalize">
                {parentCategorySlug} Collection
              </Link>
            </>
          )}
          <span className="text-stone-300">/</span>
          <span className="text-stone-900 font-bold">{category?.name || categoryName}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-charcoal text-white p-8 sm:p-12 shadow-soft">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles size={13} />
              <span>
                {isMasterCollection ? 'Master Collection' : 'Curated Subcategory'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              {category?.name || (isMasterCollection ? `${categoryName.toUpperCase()} Collection` : 'Pillow Category')}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {category?.description ||
                (isMasterCollection
                  ? `Discover our complete ${categoryName} range, engineered for sleep posture and crafted with certified premium materials.`
                  : 'Tailored sleep essentials designed for maximum comfort and restful nights.')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-stone-300 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                100% Genuine Marketplace Fulfillment
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Verified Customer Reviews
              </span>
            </div>
          </div>

          {/* Background Image / Accent */}
          <img
            src={
              category?.image ||
              (categoryName === 'bedsheets'
                ? '/assets/categories/bedsheets/cover.jpg'
                : '/assets/categories/pillows/cover.jpg')
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                categoryName === 'bedsheets'
                  ? 'https://images.unsplash.com/photo-1629949009765-40fc74c950c0?auto=format&fit=crop&w=1200&q=80'
                  : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80';
            }}
            alt={category?.name || categoryName}
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px] pointer-events-none"
          />
        </div>

        {/* Master Collection Subcategory Filter Tabs */}
        {subcategories.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-soft">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
              <Layers size={14} className="text-brand-500" />
              <span>Filter by Subcategory</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveSubFilter('all')}
                className={`px-4 py-2 rounded-xl shrink-0 font-bold transition-all ${
                  activeSubFilter === 'all'
                    ? 'bg-brand-charcoal text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                All {category?.name || 'Items'} ({products.length})
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setActiveSubFilter(sub._id)}
                  className={`px-4 py-2 rounded-xl shrink-0 font-medium transition-all ${
                    activeSubFilter === sub._id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Products Grid */}
        {loading ? (
          <LoadingSpinner text="Loading collection products..." />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 text-stone-500 text-sm max-w-md mx-auto shadow-soft">
            <ShoppingBag size={42} className="text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base mb-1">No Products Listed Yet</h3>
            <p className="text-xs text-stone-500 mb-6">
              Our marketplace catalog for this collection is currently being updated by the admin team.
            </p>
            <Link
              to="/products"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-semibold"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Showing {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
