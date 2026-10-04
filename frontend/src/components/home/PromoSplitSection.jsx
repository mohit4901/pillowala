import React from 'react';
import { Link } from 'react-router-dom';

export default function PromoSplitSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: OUR PROCESS */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden group shadow-2xs">
            {/* Background Texture: Wavy Woven Percale Weave generated with Gemini */}
            <img
              src="/assets/promo/process.jpg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80';
              }}
              alt="Our Process - Bedding Craftsmanship"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10" />

            {/* Floating Centered White Box Card */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-white px-8 sm:px-12 py-7 sm:py-9 text-center shadow-lg max-w-sm w-full space-y-2 border border-stone-100">
                <h3 className="font-sans text-base sm:text-lg font-bold tracking-widest uppercase text-stone-900">
                  OUR PROCESS
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 italic">
                  Learn what's in a great set of sheets & pillows
                </p>
                <div className="pt-2">
                  <Link
                    to="/about"
                    className="text-xs font-bold text-[#0066FF] tracking-wider uppercase underline underline-offset-4 hover:text-[#0052CC] transition-colors"
                  >
                    LEARN MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: IN THE PRESS */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden group shadow-2xs">
            {/* Background Photo: Woman relaxing in bed with magazine generated with Gemini */}
            <img
              src="/assets/promo/press.jpg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1512290903671-17adc81048e5?auto=format&fit=crop&w=1200&q=80';
              }}
              alt="In the Press - Media & Reviews"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10" />

            {/* Floating Centered White Box Card */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-white px-8 sm:px-12 py-7 sm:py-9 text-center shadow-lg max-w-sm w-full space-y-2 border border-stone-100">
                <h3 className="font-sans text-base sm:text-lg font-bold tracking-widest uppercase text-stone-900">
                  IN THE PRESS
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 italic">
                  See what they are talking about
                </p>
                <div className="pt-2">
                  <Link
                    to="/review"
                    className="text-xs font-bold text-[#0066FF] tracking-wider uppercase underline underline-offset-4 hover:text-[#0052CC] transition-colors"
                  >
                    READ MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
