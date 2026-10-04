import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function InstagramSection() {
  const instaImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80',
      alt: 'Crisp white duvet and pillows',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512290903671-17adc81048e5?auto=format&fit=crop&w=600&q=80',
      alt: 'Relaxing and reading in morning bed',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      alt: 'Carefree ocean morning calm',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80',
      alt: 'Stacked clean folded sheets on black chair',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      alt: 'Minimalist bedroom suite aesthetics',
      hasOverlay: true,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title matching Brooklinen */}
        <div className="text-center mb-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-sans text-sm sm:text-base font-bold tracking-widest uppercase text-stone-900 hover:text-[#0066FF] transition-colors"
          >
            <span>CLICK HERE TO SHOP OUR INSTAGRAM</span>
            <span className="text-base">📷</span>
          </Link>
        </div>

        {/* 5-Photo Grid matching reference image */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {instaImages.map((item) => (
            <Link
              key={item.id}
              to="/products"
              className="group relative aspect-square overflow-hidden bg-stone-100 block"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* 5th tile overlay / slider hint */}
              {item.hasOverlay ? (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center p-3 text-center transition-opacity group-hover:bg-black/50">
                  <div className="border border-white/80 p-3 w-full h-full flex flex-col items-center justify-center text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      VIEW
                    </span>
                    <span className="text-xs font-serif font-bold">COLLECTION</span>
                    <ChevronRight size={18} className="mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-xs uppercase tracking-wider transition-opacity bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    Shop Look
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Centered SEE MORE Link */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#0066FF] underline underline-offset-4 hover:text-[#0052CC] transition-colors"
          >
            SEE MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
