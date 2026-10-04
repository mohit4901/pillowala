import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

export default function MarketplaceTrust() {
  const marketplaces = [
    {
      name: 'Amazon India',
      platform: 'amazon',
      badge: 'Fulfilled by Amazon',
      tagline: 'Prime Next-Day Delivery & A-to-z Guarantee',
      color: '#FF9900',
      bgColor: 'bg-amber-50/60 border-amber-200/80',
      badgeColor: 'bg-amber-500 text-white',
      link: 'https://www.amazon.in/s?k=pillowala+pillows',
      perks: ['Prime 1-Day Delivery', 'Easy 10-Day Replacement', 'Verified Reviews'],
    },
    {
      name: 'Flipkart',
      platform: 'flipkart',
      badge: 'Flipkart Assured',
      tagline: 'Quality-checked pillows with swift doorstep drop',
      color: '#2874F0',
      bgColor: 'bg-blue-50/60 border-blue-200/80',
      badgeColor: 'bg-blue-600 text-white',
      link: 'https://www.flipkart.com/search?q=pillowala',
      perks: ['F-Assured Quality Tested', 'SuperCoin Rewards', 'Secure Payment'],
    },
    {
      name: 'Meesho',
      platform: 'meesho',
      badge: 'Top Rated Seller',
      tagline: 'Unbeatable value combos directly from manufacturer',
      color: '#F43397',
      bgColor: 'bg-pink-50/60 border-pink-200/80',
      badgeColor: 'bg-pink-600 text-white',
      link: 'https://www.meesho.com/search?q=pillowala',
      perks: ['Direct Factory Combos', 'Pan-India Free Delivery', 'Cash on Delivery'],
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Shop Our Pillows on Your Favorite Platform
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Every Pillowala package shipped from our warehouses contains an authentic QR code card for seamless customer support and review rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketplaces.map((m) => (
            <div
              key={m.platform}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 ${m.bgColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-stone-900">{m.name}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-4">{m.tagline}</p>

                <ul className="space-y-2 mb-6">
                  {m.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 hover:border-stone-400 font-semibold text-xs text-stone-800 flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Visit {m.name} Store</span>
                <ExternalLink size={14} className="text-stone-400" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
