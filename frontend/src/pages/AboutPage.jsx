import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Award, QrCode } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 bg-brand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Story Intro */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
            <Sparkles size={14} />
            <span>The Pillowala Mission</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Crafted for Restful Nights, <br />
            <span className="italic font-normal text-brand-500">Engineered for Healthy Spines</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            In modern India, millions of professionals, parents, and students wake up with chronic cervical stiffness, neck cramps, and fatigue. We created Pillowala to fix Indian sleep habits with authentic ergonomic engineering.
          </p>
        </div>

        {/* Brand Core Imagery */}
        <div className="rounded-3xl overflow-hidden shadow-soft border-4 border-white bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
            alt="Pillowala Craftsmanship"
            className="w-full aspect-[21/9] object-cover"
          />
        </div>

        {/* Narrative */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-soft space-y-6 text-stone-700 text-sm sm:text-base leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Why Our Physical Review Card Matters
          </h2>
          <p>
            When you purchase a pillow from Amazon, Flipkart, or Meesho, you put your trust in our craftsmanship before feeling the fabric. That is why every Pillowala box contains an official welcome card with a direct QR code.
          </p>
          <p>
            We do not use artificial bot reviews or bought endorsements. Every rating you see on our platform comes directly from customers who unboxed their pillow, scanned their physical card, and shared their authentic feedback.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/70">
              <Award className="text-brand-500 mb-2" size={24} />
              <h4 className="font-bold text-stone-900 text-sm">OEKO-TEX Certified</h4>
              <p className="text-xs text-stone-500 mt-1">Chemical-free, skin safe for babies and adults.</p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/70">
              <ShieldCheck className="text-brand-500 mb-2" size={24} />
              <h4 className="font-bold text-stone-900 text-sm">Doctor Recommended</h4>
              <p className="text-xs text-stone-500 mt-1">Tested for cervical spine contour preservation.</p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/70">
              <Heart className="text-brand-500 mb-2" size={24} />
              <h4 className="font-bold text-stone-900 text-sm">Made in India</h4>
              <p className="text-xs text-stone-500 mt-1">Proudly stitched and assembled by Indian artisans.</p>
            </div>
          </div>
        </div>

        {/* Review CTA */}
        <div className="text-center pt-4">
          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-charcoal text-white text-sm font-bold shadow-md hover:bg-stone-900 transition-colors"
          >
            <QrCode size={18} />
            <span>Have a Pillowala Card? Review Your Product Here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
