import React from 'react';
import IamHero from '../components/home/IamHero';
import IamCategoryCards from '../components/home/IamCategoryCards';
import IamHowDoYouSleep from '../components/home/IamHowDoYouSleep';
import IamReadyForBed from '../components/home/IamReadyForBed';
import CoverFlowCarousel from '../components/home/CoverFlowCarousel';
import EverydaySelection from '../components/home/EverydaySelection';
import TestimonialsMarquee from '../components/home/TestimonialsMarquee';
import LuckyDrawSection from '../components/home/LuckyDrawSection';

export default function HomePage() {
  return (
    <div className="bg-white text-stone-900 min-h-screen selection:bg-black selection:text-white">
      {/* 1. Hero: I AM WHO I AM Lifestyle Hero with Breakfast In Bed Couple */}
      <IamHero />

      {/* 2. Three Lifestyle Category Cards: COOL, REJUVENATING, ALTERNATIVE */}
      <IamCategoryCards />

      {/* 3. HOW DO YOU SLEEP? with 3D FLOATING WHITE PILLOWS Overlapping Black & White */}
      <IamHowDoYouSleep />

      {/* 4. 3D CoverFlow Carousel: ICONIC RELEASES // 3D CATALOG (Kept As Requested) */}
      <div id="coverflow">
        <CoverFlowCarousel />
      </div>

      {/* 5. READY FOR BED? Split 2-Column Section (Couple Sleeping + Black Card) */}
      <IamReadyForBed />

      {/* 6. Complete Product Catalog: All 29 Real Scraped Products with Left Filter Sidebar */}
      <div id="all-products">
        <EverydaySelection />
      </div>

      {/* 7. Monthly Mega Lucky Draw: Top 3 Verified Winners (1st, 2nd, 3rd) & Month-End Countdown */}
      <div id="lucky-draw">
        <LuckyDrawSection />
      </div>

      {/* 8. Customer Reviews: Verified Marketplace Buyers with Order IDs */}
      <div id="reviews" className="py-12 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 block">
            VERIFIED REVIEWS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
            WHAT OUR SLEEPERS SAY
          </h2>
        </div>
        <TestimonialsMarquee />
      </div>
    </div>
  );
}
