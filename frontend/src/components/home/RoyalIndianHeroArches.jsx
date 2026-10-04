import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RoyalIndianHeroArches() {
  const arches = [
    {
      id: 1,
      title: 'ROYAL VELVET',
      subtitle: '350 TC Palace Grade',
      image: '/assets/royal/arch1.jpg',
      tag: 'HERITAGE ARCHIVE',
      link: '/category/bedsheets',
    },
    {
      id: 2,
      title: 'WINTER FLANNEL',
      subtitle: 'Elastic King Fitted Sheet',
      image: 'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg',
      tag: 'FLIPKART OFFICIAL',
      link: '/products?marketplace=flipkart',
    },
    {
      id: 3,
      title: 'PURE COTTON 200 TC',
      subtitle: '5-Piece Set With Frill Covers',
      image: 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg',
      tag: 'MEESHO MERI SHOP',
      link: '/products?marketplace=meesho',
    },
    {
      id: 4,
      title: 'CLOUD MICRO-BOUNCE',
      subtitle: 'Ergonomic Sleeping Pillows (2 Pack)',
      image: 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
      tag: 'REST ARCHIVE',
      link: '/category/pillows',
    },
  ];

  return (
    <section className="relative w-full bg-[#54111B] text-[#FAF7F2] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059]/40 select-none overflow-hidden">
      {/* Subtle Ornate Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Tag & Sub-heading */}
        <div className="text-center space-y-2 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.35em] text-[#E4CA88] uppercase font-serif">
            <span>✦</span>
            <span>ROYAL TEXTILE ARCHIVE OF PANIPAT</span>
            <span>✦</span>
          </div>
          <h1 className="font-royal-decor text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-[#FAF7F2] drop-shadow-md">
            THE ROYAL JHAROKHA // ARCHIVE
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#E8DCCB]/80 max-w-xl mx-auto tracking-wide">
            Handcrafted luxury bedsheets, 350 TC heavyweight velvet, and cloud-like microfibre sleeping pillows engineered for deep restorative rest.
          </p>
        </div>

        {/* The 4 Mughal Jharokha Arches matching reference image */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {arches.map((arch) => (
            <Link
              key={arch.id}
              to={arch.link}
              className="group relative flex flex-col items-center overflow-hidden rounded-t-[100px] sm:rounded-t-[140px] rounded-b-2xl border-2 border-[#C5A059]/60 hover:border-[#E4CA88] bg-[#3F0B13] transition-all duration-500 hover:-translate-y-2 shadow-2xl"
            >
              {/* Image Frame with Arch Top */}
              <div className="relative w-full aspect-[3/5] overflow-hidden">
                <img
                  src={arch.image}
                  alt={arch.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.92] contrast-[1.05]"
                  loading="lazy"
                />

                {/* Inner Arch Gold Hairline Border */}
                <div className="absolute inset-1 rounded-t-[96px] sm:rounded-t-[136px] rounded-b-xl border border-[#C5A059]/30 pointer-events-none" />

                {/* Gradient Vignette for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3F0B13] via-[#3F0B13]/20 to-transparent pointer-events-none" />

                {/* Top Arch Tag */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-serif uppercase tracking-[0.2em] bg-[#54111B]/80 backdrop-blur-md text-[#E4CA88] border border-[#C5A059]/40 whitespace-nowrap shadow-md">
                    {arch.tag}
                  </span>
                </div>

                {/* Bottom Content within Arch */}
                <div className="absolute bottom-4 inset-x-3 text-center space-y-1">
                  <h3 className="font-royal text-sm sm:text-base font-bold uppercase tracking-wider text-[#FAF7F2] group-hover:text-[#E4CA88] transition-colors">
                    {arch.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-serif text-[#E8DCCB]/80 line-clamp-1">
                    {arch.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Arch Base Ribbon */}
              <div className="w-full py-2 bg-[#36080F] border-t border-[#C5A059]/40 text-center flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-serif uppercase tracking-[0.2em] text-[#E4CA88] group-hover:bg-[#54111B] transition-colors">
                <span>VIEW ATELIER</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}

          {/* Floating Center Gold Emblem matching reference MAHA GAURI */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#54111B]/95 backdrop-blur-xl border-2 border-[#C5A059] items-center justify-center text-center p-3 shadow-2xl z-20 pointer-events-none">
            <div className="flex flex-col items-center text-[#E4CA88] space-y-0.5">
              <span className="text-xs">✦</span>
              <span className="font-royal-decor text-[11px] font-bold tracking-widest uppercase text-white leading-tight">
                PILLOWALA
              </span>
              <span className="text-[7px] font-serif uppercase tracking-widest text-[#C5A059]">
                EST. 2022
              </span>
              <span className="text-xs">✦</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Arches */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            to="/products"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E4CA88] text-[#54111B] font-royal font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl flex items-center gap-2"
          >
            <span>EXPLORE ALL 29 PRODUCTS</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link
            to="/review"
            className="px-8 py-3.5 rounded-full bg-[#3F0B13] hover:bg-[#4E0E18] text-[#E8DCCB] border border-[#C5A059]/60 font-royal font-semibold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg flex items-center gap-2"
          >
            <QrCode size={14} className="text-[#C5A059]" />
            <span>CLAIM 5-STAR REVIEW REWARD</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
