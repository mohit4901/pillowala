import React from 'react';
import { Link } from 'react-router-dom';

export default function IamReadyForBed() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-stone-200 grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Peaceful Sleeping Couple Photo matching screenshot */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px] w-full overflow-hidden bg-stone-100">
          <img
            src="/assets/iam/sleep_couple.jpg"
            alt="Ready for bed couple sleeping"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Right Column: Solid Black Block with Clean White Typography matching screenshot */}
        <div className="bg-black text-white p-10 sm:p-14 lg:p-20 flex flex-col justify-center items-start space-y-6">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            READY FOR BED?
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            PILLOWALA™ was designed to make it easy for the consumer to shop. There are no colored obnoxious icons. PILLOWALA™ is authentic, up-front and direct to the point.
          </p>

          <div className="pt-2">
            <a
              href="#all-products"
              className="px-8 py-3.5 rounded-full bg-black hover:bg-stone-900 text-white border border-white/80 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-md"
            >
              SHOP THE COLLECTION
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
