import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  if (!product) return null;

  const marketplaceConfig = {
    amazon: {
      name: 'Amazon',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      btnBg: 'bg-[#FF9900] hover:bg-[#E88B00] text-gray-900',
      dot: 'bg-[#FF9900]',
    },
    flipkart: {
      name: 'Flipkart',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      btnBg: 'bg-[#2874F0] hover:bg-[#1C60D4] text-white',
      dot: 'bg-[#2874F0]',
    },
    meesho: {
      name: 'Meesho',
      badgeBg: 'bg-pink-100 text-pink-900 border-pink-300',
      btnBg: 'bg-[#F43397] hover:bg-[#D92580] text-white',
      dot: 'bg-[#F43397]',
    },
  };

  const market = marketplaceConfig[product.marketplace] || {
    name: product.marketplace,
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    btnBg: 'bg-stone-800 hover:bg-stone-900 text-white',
    dot: 'bg-stone-700',
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Marketplace Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md shadow-sm bg-white/90">
          <span className={`w-2 h-2 rounded-full ${market.dot}`}></span>
          <span className="text-stone-800">{market.name}</span>
        </div>

        {/* Discount Tag */}
        {discountPercent && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500 text-white shadow-sm">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating || 4.8} size={15} />
            <span className="text-xs font-semibold text-stone-600">
              {product.rating || 4.8}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-stone-400">
                ({product.reviewCount})
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4 pt-2 border-t border-stone-100">
            <span className="text-xl font-bold text-stone-900 font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Button: links to real configured marketplace URL */}
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] ${market.btnBg}`}
          >
            <ShoppingBag size={15} />
            <span>Buy on {market.name}</span>
            <ExternalLink size={13} className="opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
}
