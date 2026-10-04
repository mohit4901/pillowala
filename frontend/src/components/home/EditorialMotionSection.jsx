import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, CheckCircle2, Feather, ShieldCheck } from 'lucide-react';

export default function EditorialMotionSection() {
  return (
    <section className="bg-white text-stone-950 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-stone-200 select-none">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section 1: THE ARCHIVE // OF DEEP REST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-[0.25em] text-stone-500">
              <span className="w-2 h-2 rounded-full bg-stone-950"></span>
              <span>VOL. 01 // TEXTILE ARCHITECTURE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-stone-950 leading-[0.95]">
              THE ARCHIVE // OF DEEP REST
            </h2>

            <p className="font-mono-tech text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
              We stripped bedding of generic synthetic fillers and unbreathable polyester. Built with high-density 350 TC velvet flannel, breathable 200 TC long-staple cotton, and ergonomic micro-bounce fibre pillows.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs font-mono-tech">
              <div>
                <span className="text-xl font-black text-stone-950 block">350 TC</span>
                <span className="text-stone-500 text-[10px] uppercase tracking-wider">Heavy Winter Grade</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-200" />
              <div>
                <span className="text-xl font-black text-stone-950 block">100% COTTON</span>
                <span className="text-stone-500 text-[10px] uppercase tracking-wider">Zero Chemical Odor</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-200" />
              <div>
                <span className="text-xl font-black text-stone-950 block">MICRO-BOUNCE</span>
                <span className="text-stone-500 text-[10px] uppercase tracking-wider">Spine Alignment</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/category/bedsheets"
                className="inline-flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-widest text-stone-950 hover:text-stone-600 transition-colors group"
              >
                <span>EXPLORE BEDSHEETS ARCHIVE</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <span className="text-stone-300">•</span>
              <Link
                to="/category/pillows"
                className="inline-flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-widest text-stone-950 hover:text-stone-600 transition-colors group"
              >
                <span>EXPLORE PILLOWS ARCHIVE</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Lookbook Photo Grid: Gemini Generated Luxury Bedding & Pillow visuals */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 1: Sculptural Bedsheet Motion */}
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group relative shadow-md">
              <img
                src="/assets/sidewalk/bedsheet_motion.jpg"
                alt="Sculptural 350 TC Velvet Bedsheet Motion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-stone-200 shadow-sm flex items-center justify-between text-[10px] font-mono-tech text-stone-900">
                <span className="font-bold">SCULPTURAL FLANNEL MOTION</span>
                <span className="text-stone-500 font-semibold">350 TC VELVET</span>
              </div>
            </div>

            {/* Card 2: Pillow Craft & Architecture */}
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group relative sm:mt-12 shadow-md">
              <img
                src="/assets/sidewalk/pillow_craft.jpg"
                alt="Architectural Sleeping Pillow Craft"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-stone-200 shadow-sm flex items-center justify-between text-[10px] font-mono-tech text-stone-900">
                <span className="font-bold">RESILIENT PILLOW MATRIX</span>
                <span className="text-stone-500 font-semibold">MICROFIBRE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ARCHIVED // MOTION BANNER in Crisp Luxury Light Style */}
        <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-50 p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-stone-500 block">
              FACTORY DIRECT // PANIPAT TEXTILE HUB
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black uppercase text-stone-950 tracking-tight">
              ARCHIVED // MOTION
            </h3>
            <p className="font-mono-tech text-xs sm:text-sm text-stone-600 max-w-lg">
              Every pillow bounce and bedsheet hem is quality inspected before dispatch. Direct marketplace fulfillment on Flipkart and Meesho across 19,000+ Indian pincodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 z-10">
            <Link
              to="/products?marketplace=flipkart"
              className="px-6 py-3.5 rounded-full bg-[#2874F0] text-white font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md"
            >
              FLIPKART STORE (11)
            </Link>
            <Link
              to="/products?marketplace=meesho"
              className="px-6 py-3.5 rounded-full bg-[#9C27B0] text-white font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-purple-600 transition-all shadow-md"
            >
              MEESHO STORE (18)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
