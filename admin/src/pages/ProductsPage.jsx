import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import AdminHeader from '../components/layout/AdminHeader';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  scrapeProduct,
} from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplaceFilter, setMarketplaceFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Scraper Modal State
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState(null);
  const [scrapeError, setScrapeError] = useState('');
  const [scrapeCategoryId, setScrapeCategoryId] = useState('');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    images: '',
    marketplace: 'amazon',
    categoryId: '',
    externalUrl: '',
    featured: false,
    active: true,
  });

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts({ marketplace: marketplaceFilter, search: search.trim() }),
        getCategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [marketplaceFilter]);

  const handleOpenScrape = () => {
    setScrapeUrl('');
    setScrapedProduct(null);
    setScrapeError('');
    setScrapeCategoryId(categories[0]?._id || '');
    setIsScrapeModalOpen(true);
  };

  const handlePerformScrape = async (overrideUrl) => {
    const targetUrl = (overrideUrl || scrapeUrl).trim();
    if (!targetUrl) {
      setScrapeError('Please enter a valid product URL');
      return;
    }

    try {
      setScrapeLoading(true);
      setScrapeError('');
      const res = await scrapeProduct(targetUrl);
      if (res.success && res.data) {
        setScrapedProduct(res.data);
      } else {
        setScrapeError(res.message || 'Failed to scrape product details');
      }
    } catch (err) {
      setScrapeError(err.response?.data?.message || err.message || 'Scraping failed');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleSaveScraped = async () => {
    if (!scrapedProduct) return;
    try {
      setScrapeLoading(true);
      const payload = {
        ...scrapedProduct,
        categoryId: scrapeCategoryId || undefined,
        active: true,
      };
      await createProduct(payload);
      setIsScrapeModalOpen(false);
      setScrapedProduct(null);
      setScrapeUrl('');
      await fetchCatalog();
    } catch (err) {
      setScrapeError('Failed to save scraped product: ' + (err.response?.data?.message || err.message));
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleAutoFillInModal = async () => {
    if (!formData.externalUrl) return;
    try {
      const res = await scrapeProduct(formData.externalUrl);
      if (res.success && res.data) {
        const d = res.data;
        setFormData((prev) => ({
          ...prev,
          name: d.name || prev.name,
          description: d.description || prev.description,
          price: d.price || prev.price,
          originalPrice: d.originalPrice || prev.originalPrice,
          marketplace: d.marketplace || prev.marketplace,
          images: d.images ? d.images.join(', ') : prev.images,
        }));
      }
    } catch (err) {
      alert('Could not auto-fetch: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      images: '',
      marketplace: 'amazon',
      categoryId: categories[0]?._id || '',
      externalUrl: '',
      featured: false,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || '',
      images: p.images?.join(', ') || '',
      marketplace: p.marketplace,
      categoryId: p.categoryId?._id || p.categoryId || '',
      externalUrl: p.externalUrl,
      featured: p.featured,
      active: p.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        images: formData.images
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (!payload.categoryId) delete payload.categoryId;

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      fetchCatalog();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleToggleActive = async (p) => {
    try {
      await updateProduct(p._id, { active: !p.active });
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, active: !p.active } : item))
      );
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-stone-50">
      <AdminHeader
        title="Product Catalog Management"
        subtitle="Configure Amazon, Flipkart, and Meesho pillow listings and Buy Now links"
      />

      <div className="p-8 space-y-6 flex-1">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={marketplaceFilter}
              onChange={(e) => setMarketplaceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
            >
              <option value="all">All Marketplaces</option>
              <option value="amazon">Amazon</option>
              <option value="flipkart">Flipkart</option>
              <option value="meesho">Meesho</option>
            </select>

            <span className="text-xs text-stone-500">{products.length} products</span>
          </div>

          <button
            onClick={handleOpenScrape}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles size={16} />
            <span>⚡ Import Product by Link</span>
          </button>
        </div>

        {/* Products Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-stone-400 text-xs">
              Loading product catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-16 text-center text-stone-400 text-xs bg-white rounded-2xl border border-stone-200">
              No products found for this marketplace filter.
            </div>
          ) : (
            products.map((prod) => {
              const img =
                prod.images && prod.images.length > 0
                  ? prod.images[0]
                  : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={prod._id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-soft transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-900 shadow-xs">
                        {prod.marketplace}
                      </div>
                      {prod.featured && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
                          Featured
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug">
                        {prod.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-bold text-stone-900">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        prod.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {prod.active ? 'Active' : 'Disabled'}
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={prod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                        title="View Marketplace Link"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Edit Pillow Product' : 'Add New Pillow Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pillowala Cervical Memory Foam Contour Pillow"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe ergonomics, materials, casing, bounce-back..."
                  className="w-full p-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="2499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Marketplace</label>
                  <select
                    value={formData.marketplace}
                    onChange={(e) => setFormData({ ...formData, marketplace: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none font-medium bg-white"
                  >
                    <option value="amazon">Amazon</option>
                    <option value="flipkart">Flipkart</option>
                    <option value="meesho">Meesho</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none font-medium bg-white"
                  >
                    <option value="">None / General</option>
                    <optgroup label="🛌 PILLOWS COLLECTION">
                      {categories
                        .filter((c) => c.parentCategory === 'pillows' || c.slug === 'pillows')
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="🛏️ BEDSHEETS COLLECTION">
                      {categories
                        .filter((c) => c.parentCategory === 'bedsheets' || c.slug === 'bedsheets')
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-stone-700">
                    External Marketplace Listing URL
                  </label>
                  {formData.externalUrl && (
                    <button
                      type="button"
                      onClick={handleAutoFillInModal}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Auto-Fetch Details</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  required
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://www.amazon.in/dp/... or flipkart or meesho"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image URL(s) (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Featured on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Active / In Stock</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto-Scrape Product by URL Modal */}
      {isScrapeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Auto-Import Product from Marketplace URL
                  </h3>
                  <p className="text-xs text-stone-500">
                    Paste any Meesho, Flipkart, or Amazon link. We'll extract title, photos, price, and rating automatically.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScrapeModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Sample Links */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Quick Test Links
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url =
                      'https://www.flipkart.com/product/p/itme?pid=BDSHPAU5HBUCEM99&lid=LSTBDSHPAU5HBUCEM99UDFET2&_refId=&_appId=CL';
                    setScrapeUrl(url);
                    handlePerformScrape(url);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  ⚡ Flipkart Bedsheet Set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url =
                      'https://www.meesho.com/s/p/7atwd7?utm_source=share_510bfdb524bb7578ed46b2b586cf50e32b5279a379272d4f517e4fc3ee1717be';
                    setScrapeUrl(url);
                    handlePerformScrape(url);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 hover:bg-fuchsia-100 transition-colors cursor-pointer"
                >
                  ⚡ Meesho 16x26 Pillows
                </button>
              </div>
            </div>

            {/* URL Input Bar */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Product Web Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://www.flipkart.com/... or https://www.meesho.com/... or https://www.amazon.in/..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-stone-500"
                />
                <button
                  type="button"
                  disabled={scrapeLoading || !scrapeUrl.trim()}
                  onClick={() => handlePerformScrape()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {scrapeLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Scrape Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error box */}
            {scrapeError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {scrapeError}
              </div>
            )}

            {/* Scraped Product Preview */}
            {scrapedProduct && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white">
                      {scrapedProduct.marketplace}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check size={14} /> Data Scraped Successfully
                    </span>
                  </div>
                  <span className="text-xs text-stone-500">
                    ★ {scrapedProduct.rating || 4.5} ({scrapedProduct.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="flex gap-4">
                  {scrapedProduct.images && scrapedProduct.images[0] && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                      <img
                        src={scrapedProduct.images[0]}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Scraped Title
                      </label>
                      <input
                        type="text"
                        value={scrapedProduct.name}
                        onChange={(e) =>
                          setScrapedProduct({ ...scrapedProduct, name: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          value={scrapedProduct.price}
                          onChange={(e) =>
                            setScrapedProduct({
                              ...scrapedProduct,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-bold text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          MRP / Orig (₹)
                        </label>
                        <input
                          type="number"
                          value={scrapedProduct.originalPrice}
                          onChange={(e) =>
                            setScrapedProduct({
                              ...scrapedProduct,
                              originalPrice: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Assign Category
                        </label>
                        <select
                          value={scrapeCategoryId}
                          onChange={(e) => setScrapeCategoryId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-medium"
                        >
                          <option value="">General / None</option>
                          <optgroup label="🛌 PILLOWS COLLECTION">
                            {categories
                              .filter((c) => c.parentCategory === 'pillows' || c.slug === 'pillows')
                              .map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.name}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="🛏️ BEDSHEETS COLLECTION">
                            {categories
                              .filter((c) => c.parentCategory === 'bedsheets' || c.slug === 'bedsheets')
                              .map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.name}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={scrapedProduct.description}
                    onChange={(e) =>
                      setScrapedProduct({ ...scrapedProduct, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setScrapedProduct(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-200 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    disabled={scrapeLoading}
                    onClick={handleSaveScraped}
                    className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    {scrapeLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save & Add to Catalog</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
