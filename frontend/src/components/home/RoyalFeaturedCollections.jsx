import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import { getProducts } from '../../services/api';

export default function RoyalFeaturedCollections() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // High-res fallback with real scraped products
  const fallbackItems = [
    {
      _id: '1',
      name: 'Fleece Velvet King Fitted 350 TC Bedsheet',
      price: 628,
      marketplace: 'flipkart',
      images: ['https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg'],
      url: 'https://www.flipkart.com/pillowala-fleece-velvet-king-fitted-elastic-350-tc-floral-1-bedsheet-2-pillow-covers/p/itm14b625d21ae4f?pid=BDSHQWH6TZYHVMHS',
    },
    {
      _id: '2',
      name: 'Pure Cotton Flat Bedsheet 90x95 (Set of 5 with Frill Covers)',
      price: 664,
      marketplace: 'meesho',
      images: ['https://images.meesho.com/images/products/680376785/1p5n1_512.avif?width=512'],
      url: 'https://www.meesho.com/cotton-flat-bedsheet-90-x-95-inch-i-set-of-5-i-frill-decorated-pillow-and-cushion-cover-i-olive-green/p/c9chsy?ms=2&source=Meri+Shop',
    },
    {
      _id: '3',
      name: 'Flannel Warm Velvet Fitted Bedsheet With Zip Closer',
      price: 644,
      marketplace: 'meesho',
      images: ['https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512'],
      url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho1lmw',
    },
    {
      _id: '4',
      name: '16x26 Microfibre Sleeping Pillows (Pack of 2)',
      price: 387,
      marketplace: 'meesho',
      images: ['https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512'],
      url: 'https://www.meesho.com/s/p/7atwd7',
    },
    {
      _id: '5',
      name: 'Pure Cotton 200 TC Summer King Sheet + 4 Covers',
      price: 458,
      marketplace: 'flipkart',
      images: ['https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg'],
      url: 'https://dl.flipkart.com/s/v95syrNNNN',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 5 });
        const list = res.data || res || [];
        if (Array.isArray(list) && list.length >= 5) {
          setFeaturedItems(list.slice(0, 5));
        } else {
          setFeaturedItems(fallbackItems);
        }
      } catch (err) {
        setFeaturedItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getDirectUrl = (p) => {
    return p.buyLinks?.flipkart || p.buyLinks?.meesho || p.affiliateUrl || p.url || '#';
  };

  return (
    <section className="w-full bg-[#FAF7F2] text-[#2A1519] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCCB] select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Row matching reference image: Left Title + Right Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/40">
          <div>
            <h2 className="font-royal text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#54111B]">
              FEATURED COLLECTIONS
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mt-1.5" />
          </div>

          <div className="flex items-center gap-4 text-xs font-serif uppercase tracking-[0.2em] text-[#8A5A2B]">
            <Link to="/" className="hover:text-[#54111B] transition-colors">
              HOME, COLLECTIONS ▾
            </Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/about" className="hover:text-[#54111B] transition-colors">
              ABOUT US
            </Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/offers" className="hover:text-[#54111B] transition-colors">
              OFFERS
            </Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/contact" className="hover:text-[#54111B] transition-colors">
              CONTACT US
            </Link>
          </div>
        </div>

        {/* 5-Column Product Cards Grid matching reference image */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {featuredItems.map((item) => {
            const isFlipkart = (item.marketplace || '').toLowerCase() === 'flipkart';
            const img = item.images?.[0] || fallbackItems[0].images[0];
            const buyUrl = getDirectUrl(item);

            return (
              <div
                key={item._id || item.name}
                className="group flex flex-col bg-white rounded-xl border border-[#E8DCCB] hover:border-[#C5A059] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md"
              >
                {/* Image Container with subtle warm tone */}
                <div className="relative aspect-[3/4] w-full bg-[#F5EFE6] overflow-hidden">
                  <img
                    src={img}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Marketplace Badge Top Left */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] font-serif uppercase tracking-wider text-white font-bold shadow-xs ${
                      isFlipkart ? 'bg-[#2874F0]' : 'bg-[#9C27B0]'
                    }`}
                  >
                    {isFlipkart ? 'FLIPKART' : 'MEESHO'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3 text-center">
                  <h3
                    title={item.name}
                    className="font-serif text-xs font-semibold text-[#54111B] line-clamp-2 min-h-[32px] group-hover:text-[#8A5A2B] transition-colors"
                  >
                    {item.name}
                  </h3>

                  {/* Gold Pill Button matching reference image (+ ₹628) */}
                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-full bg-gradient-to-r from-[#FDF9EE] via-[#F7ECCB] to-[#FDF9EE] border border-[#C5A059]/70 hover:border-[#54111B] text-[#54111B] hover:text-white hover:bg-[#54111B] text-xs font-royal font-bold tracking-wider flex items-center justify-center gap-1 shadow-xs hover:shadow-sm transition-all"
                  >
                    <span>+ ₹{item.price || 499}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
