import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function IamCategoryCards() {
  const cards = [
    {
      id: 1,
      tag: 'PILLOWALA',
      title: 'COOL.',
      subtitle: 'PILLOW',
      desc: 'The Pillowala Cool pillow is perfect if you often sleep warm or maybe peep your toes out of the covers at night!',
      img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&h=400&q=80',
      bgColor: 'bg-pink-100',
      shopLink: '/category/pillows',
    },
    {
      id: 2,
      tag: 'PILLOWALA',
      title: 'REJUVENATING.',
      subtitle: 'BEDSHEET',
      desc: 'Prolong your mattress’s life as you add an extra layer of comfort with our 350 TC heavyweight velvet flannel sheets.',
      img: '/assets/sidewalk/hero_white.jpg',
      bgColor: 'bg-stone-100',
      shopLink: '/category/bedsheets',
    },
    {
      id: 3,
      tag: 'PILLOWALA',
      title: 'ALTERNATIVE.',
      subtitle: 'COMFORTER & SETS',
      desc: 'The Pillowala Alternative series combines softness and gentle warmth with its hypoallergenic, resilient microfibers.',
      img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&h=400&q=80',
      bgColor: 'bg-stone-100',
      shopLink: '/products',
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col space-y-4 group">
            {/* Image Frame with Overlay Title matching screenshot */}
            <div className={`relative aspect-[16/10] w-full rounded-none overflow-hidden ${card.bgColor}`}>
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Bottom Card Overlay Bar with Title & SHOP button */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest block">
                    {card.tag}
                  </span>
                  <span className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-tight block leading-none">
                    {card.title}
                  </span>
                  <span className="text-[11px] font-bold text-stone-200 uppercase tracking-wider block">
                    {card.subtitle}
                  </span>
                </div>

                <Link
                  to={card.shopLink}
                  className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-white hover:text-black border border-white/40 text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  SHOP
                </Link>
              </div>
            </div>

            {/* Description & Read More */}
            <div className="space-y-2">
              <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-normal">
                {card.desc}
              </p>
              <Link
                to={card.shopLink}
                className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
              >
                <span>Read more »</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
