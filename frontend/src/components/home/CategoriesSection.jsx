import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { getCategories } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Filter subcategories by master parent
  const pillowSubs = categories.filter((c) => c.parentCategory === 'pillows');
  const bedsheetSubs = categories.filter((c) => c.parentCategory === 'bedsheets');

  // Fallback subcategories if database is fresh
  const defaultPillowSubs = [
    { name: 'Memory Foam', slug: 'memory-foam' },
    { name: 'Cervical Orthopedic', slug: 'cervical-orthopedic' },
    { name: '100% Pure Cotton', slug: 'cotton-pillows' },
    { name: 'Hotel Luxury 5-Star', slug: 'hotel-luxury' },
    { name: 'Cooling Gel Infused', slug: 'cooling-gel' },
    { name: 'Travel & Neck Rest', slug: 'travel-neck' },
    { name: 'Twin & Combo Packs', slug: 'pillow-combos' },
  ];

  const defaultBedsheetSubs = [
    { name: '100% Pure Cotton', slug: 'pure-cotton-bedsheets' },
    { name: 'Complete Bedsheet Sets', slug: 'bedsheet-sets' },
    { name: 'Fitted Elastic Sheets', slug: 'fitted-bedsheets' },
    { name: 'Luxury Glace Cotton', slug: 'glace-cotton' },
  ];

  const displayPillowSubs = pillowSubs.length > 0 ? pillowSubs : defaultPillowSubs;
  const displayBedsheetSubs = bedsheetSubs.length > 0 ? bedsheetSubs : defaultBedsheetSubs;

  return (
    <section id="categories" className="py-20 bg-stone-50/60 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full mb-3">
            <Sparkles size={12} className="text-brand-500" />
            <span>Master Collections</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Explore By Master Category
          </h2>
          <p className="text-stone-500 text-sm mt-3">
            Choose between our doctor-designed orthopedic pillows and artisan-crafted breathable bedsheet collections.
          </p>
        </div>

        {/* Dual Master Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Pillows Collection */}
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
            {/* Top Visual Banner */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
              <img
                src="/assets/categories/pillows/cover.jpg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80';
                }}
                alt="Pillows Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/90 text-stone-900 backdrop-blur-md shadow-sm">
                  🛌 Master Category 01
                </span>
              </div>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest block mb-1">
                  Ergonomic Spine Support
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  Pillows Collection
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 mt-1">
                  Orthopedic contour memory foam, pure organic cotton, and cooling gel pillows designed for restorative sleep.
                </p>
              </div>
            </div>

            {/* Subcategory Pills & Link */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Pillow Subcategories ({displayPillowSubs.length})
                  </span>
                  <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Doctor Approved Lofts
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {displayPillowSubs.map((sub) => (
                    <Link
                      key={sub.slug || sub._id}
                      to={`/category/${sub.slug}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 text-stone-700 hover:bg-brand-100 hover:text-brand-700 transition-colors border border-stone-200/60"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/category/pillows"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-charcoal text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm group-hover:shadow-md"
              >
                <span>Explore All Pillows Collection</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Bedsheets Collection */}
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
            {/* Top Visual Banner */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
              <img
                src="/assets/categories/bedsheets/cover.jpg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1629949009765-40fc74c950c0?auto=format&fit=crop&w=1200&q=80';
                }}
                alt="Bedsheets Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/90 text-stone-900 backdrop-blur-md shadow-sm">
                  🛏️ Master Category 02
                </span>
              </div>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest block mb-1">
                  100% Breathable Weaves
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  Bedsheets Collection
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 mt-1">
                  Pure cotton bedsheets, all-around elastic fitted sheets, and luxury glace fabric sets with matching pillowcases.
                </p>
              </div>
            </div>

            {/* Subcategory Pills & Link */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Bedsheet Subcategories ({displayBedsheetSubs.length})
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> 300+ Thread Count
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {displayBedsheetSubs.map((sub) => (
                    <Link
                      key={sub.slug || sub._id}
                      to={`/category/${sub.slug}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-stone-200/60"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/category/bedsheets"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-charcoal text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm group-hover:shadow-md"
              >
                <span>Explore All Bedsheets Collection</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
