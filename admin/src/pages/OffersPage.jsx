import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Tag, Calendar, Sparkles, Eye } from 'lucide-react';
import AdminHeader from '../components/layout/AdminHeader';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../services/api';
import OfferTemplateCard from '../components/common/OfferTemplateCard';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountText: '',
    couponCode: '',
    template: 'template-luxe-gold',
    image: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    active: true,
  });

  const fetchOffersList = async () => {
    try {
      setLoading(true);
      const res = await getOffers();
      setOffers(res.data || []);
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersList();
  }, []);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    setFormData({
      title: '',
      description: '',
      discountText: '',
      couponCode: '',
      template: 'template-luxe-gold',
      image: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: in30Days.toISOString().split('T')[0],
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (o) => {
    setEditingOffer(o);
    setFormData({
      title: o.title,
      description: o.description || '',
      discountText: o.discountText,
      couponCode: o.couponCode || '',
      template: o.template || 'template-luxe-gold',
      image: o.image || '',
      startDate: o.startDate ? new Date(o.startDate).toISOString().split('T')[0] : '',
      endDate: o.endDate ? new Date(o.endDate).toISOString().split('T')[0] : '',
      active: o.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await updateOffer(editingOffer._id, formData);
      } else {
        await createOffer(formData);
      }
      setIsModalOpen(false);
      fetchOffersList();
    } catch (err) {
      alert('Failed to save offer: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-stone-50">
      <AdminHeader
        title="Promotions & Offers"
        subtitle="Manage seasonal coupons, marketplace discounts, and value bundles"
      />

      <div className="p-8 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 font-semibold">{offers.length} Offers</span>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Plus size={16} />
            <span>Create New Offer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-stone-400 text-xs">
              Loading active offers...
            </div>
          ) : offers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-stone-400 text-xs bg-white rounded-2xl border border-stone-200">
              No promotions currently configured.
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer._id}
                className="flex flex-col justify-between space-y-3 bg-white p-3 rounded-3xl border border-stone-200 shadow-xs"
              >
                <OfferTemplateCard offer={offer} previewMode={true} />

                <div className="px-2 py-1 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-[11px] text-stone-600">
                    Template: {offer.template || 'template-luxe-gold'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(offer)}
                      className="px-3 py-1 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {editingOffer ? 'Edit Promotion & Template' : 'Design New Offer Banner'}
                </h3>
                <p className="text-xs text-stone-500">
                  Select from 4 graphic templates. Your text, discount, and coupon code will dynamically render.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Live Visual Preview */}
              <div className="lg:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                    <Eye size={13} />
                    <span>Live Banner Preview</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    Auto-Reflecting
                  </span>
                </div>
                <OfferTemplateCard offer={formData} previewMode={true} />
              </div>

              {/* Right Column: Template Picker & Form Fields */}
              <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-4 text-xs">
                {/* Template Selector */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Choose Graphic Design Template</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: 'template-luxe-gold',
                        name: 'Luxe Gold & Onyx',
                        desc: 'Hotel suite luxury',
                        color: 'border-amber-400 bg-stone-950 text-amber-300',
                      },
                      {
                        id: 'template-royal-indigo',
                        name: 'Royal Indigo & Violet',
                        desc: 'Combo bonanza',
                        color: 'border-indigo-400 bg-indigo-950 text-indigo-200',
                      },
                      {
                        id: 'template-emerald-fresh',
                        name: 'Emerald Botanical',
                        desc: '100% Organic cotton',
                        color: 'border-emerald-400 bg-emerald-950 text-emerald-200',
                      },
                      {
                        id: 'template-sunset-coral',
                        name: 'Sunset Festive VIP',
                        desc: 'Cashback & rewards',
                        color: 'border-orange-400 bg-orange-950 text-amber-200',
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, template: t.id })}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          formData.template === t.id
                            ? `${t.color} ring-2 ring-stone-900 font-bold shadow-xs`
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <div className="text-[11px] leading-tight font-bold">{t.name}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Monsoon Sleep Sanctuary Sale"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Discount Badge
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.discountText}
                      onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
                      placeholder="e.g. Flat 35% OFF"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={formData.couponCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couponCode: e.target.value.toUpperCase().replace(/\s+/g, ''),
                        })
                      }
                      placeholder="REST35"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe pillows, bedsheets, or cashback terms..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer shadow-xs"
                  >
                    {editingOffer ? 'Save Changes' : 'Publish Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
