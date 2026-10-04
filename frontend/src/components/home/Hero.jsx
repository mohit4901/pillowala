import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const slides = [
    {
      id: 1,
      image: '/assets/hero/slide1.jpg',
      fallback: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=2200&q=85',
      badge: 'SIGNATURE LUXURY COLLECTION',
      headline: 'BEST. SHEETS. EVER.',
      subtext: 'MIX AND MATCH YOUR WAY TO BED PERFECTION',
      ctaText: 'SHOP BEST SELLERS',
      ctaLink: '/products?featured=true',
    },
    {
      id: 2,
      image: '/assets/hero/slide2.jpg',
      fallback: 'https://images.unsplash.com/photo-1512290903671-17adc81048e5?auto=format&fit=crop&w=2200&q=85',
      badge: 'DOCTOR RECOMMENDED ERGONOMICS',
      headline: 'WAKE UP REFRESHED.',
      subtext: 'ENGINEERED CERVICAL SUPPORT & CLOUD-SOFT REPOSE',
      ctaText: 'EXPLORE PILLOWS',
      ctaLink: '/category/pillows',
    },
    {
      id: 3,
      image: '/assets/hero/slide3.jpg',
      fallback: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=2200&q=85',
      badge: '100% PURE ORGANIC COTTON',
      headline: 'THE ART OF DEEP REST.',
      subtext: 'COOLING 300+ THREAD COUNT WEAVES & FITTED SETS',
      ctaText: 'EXPLORE BEDSHEETS',
      ctaLink: '/category/bedsheets',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto-play timer (changes every 5.5s, pauses on user hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative w-full h-[540px] sm:h-[640px] lg:h-[720px] overflow-hidden bg-stone-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Collection Carousel"
    >
      {/* Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with gentle zoom effect */}
            <img
              src={slide.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = slide.fallback;
              }}
              alt={slide.headline}
              className={`w-full h-full object-cover object-[center_35%] filter brightness-[0.88] transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Gradient Overlays for High-Contrast Crisp Typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/35" />

            {/* Slide Content Box */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6">
              <div className="max-w-4xl space-y-3.5 sm:space-y-4 text-white">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white shadow-sm mb-1 animate-fadeIn">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>{slide.badge}</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight sm:tracking-normal drop-shadow-lg text-white">
                  {slide.headline}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm lg:text-base font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-stone-100 drop-shadow-md max-w-xl mx-auto">
                  {slide.subtext}
                </p>

                {/* Action CTA Button */}
                <div className="pt-3">
                  <Link
                    to={slide.ctaLink}
                    className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Left Chevron Button */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/25 hover:bg-white/80 text-white hover:text-stone-900 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Chevron Button */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/25 hover:bg-white/80 text-white hover:text-stone-900 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom Dot Navigation Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === current
                ? 'w-8 h-2.5 bg-[#0066FF] shadow-sm'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/90'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
