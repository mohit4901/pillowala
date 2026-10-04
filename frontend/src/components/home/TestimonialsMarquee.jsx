import React from 'react';
import { Star, CheckCircle2, ShoppingBag } from 'lucide-react';

const defaultTestimonials = [
  {
    author: {
      name: 'Aarav Sharma',
      handle: '@flipkart_verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Flipkart',
      product: 'Woolen Winter Bedsheet 350 TC',
    },
    text: 'Ordered the 350 TC Woolen fitted bedsheet on Flipkart. The elastic fitting is absolutely tight and doesn’t slip from the mattress at all. Fabric is thick and super warm for Delhi winters!',
    rating: 5,
    orderId: 'OD329048123',
  },
  {
    author: {
      name: 'Pooja Verma',
      handle: '@meesho_shopper',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Meesho',
      product: '16x26 Fiber Pillow Pack of 2',
    },
    text: 'Meesho par itne saste me itna premium pillow pack milna impossible lag raha tha! Microfibre bounce is genuinely good, no neck pain after sleeping. Value for money.',
    rating: 5,
    orderId: 'MEE91823719',
  },
  {
    author: {
      name: 'Vikram Malhotra',
      handle: '@flipkart_plus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Flipkart',
      product: 'Fleece Velvet King Fitted Bedsheet',
    },
    text: 'The zipper pillow covers are a gamechanger. Bedsheet fabric feels like luxury hotel velvet. Already claimed my review cashback via Pillowala portal!',
    rating: 5,
    orderId: 'OD881920391',
  },
  {
    author: {
      name: 'Sneha Kulkarni',
      handle: '@meesho_verified',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Meesho',
      product: 'Olive Green Cotton Bedsheet Set of 5',
    },
    text: 'Olive green color is gorgeous! Pure cotton with matching frill pillow and cushion covers. Looks extremely high-end on our king size double bed.',
    rating: 5,
    orderId: 'MEE66728192',
  },
  {
    author: {
      name: 'Rohan Gupta',
      handle: '@flipkart_verified',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Flipkart',
      product: 'Navy Striped Microfibre Sleeping Pillow (2 Pack)',
    },
    text: 'Proper hotel-style striped pillows. Stays fluffy even after weeks of use. Flipkart delivery was within 48 hours. 10/10 recommendation!',
    rating: 5,
    orderId: 'OD419827102',
  },
  {
    author: {
      name: 'Ananya Roy',
      handle: '@meesho_buyer',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80',
      marketplace: 'Meesho',
      product: 'Flannel Warm Velvet Zip Closer Bedsheet',
    },
    text: 'Super soft velvet texture and vibrant print. Heavy winter quality that feels warm the moment you lie down. Customer review portal is super easy to submit screenshot.',
    rating: 5,
    orderId: 'MEE55192837',
  },
];

export default function TestimonialsMarquee({
  title = "TRUSTED BY // ROUTINE",
  description = "Real feedback from verified purchasers across Flipkart and Meesho.",
  testimonials = defaultTestimonials,
  className = "",
}) {
  return (
    <section className={`bg-black text-white py-20 sm:py-28 px-0 overflow-hidden relative border-t border-b border-stone-800/80 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center mb-12 px-4">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-[0.25em] text-stone-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>100% VERIFIED MARKETPLACE BUYERS</span>
        </div>

        {/* Section Heading */}
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white max-w-3xl leading-[1.05]">
          {title}
        </h2>
        <p className="font-tech text-stone-400 text-xs sm:text-sm max-w-lg">
          {description}
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="flex overflow-hidden py-4 [--gap:1.5rem] [gap:var(--gap)] flex-row group">
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
            {[...Array(3)].map((_, setIndex) =>
              testimonials.map((testimonial, i) => {
                const isFk = testimonial.author.marketplace === 'Flipkart';
                return (
                  <div
                    key={`${setIndex}-${i}`}
                    className="w-[340px] sm:w-[400px] shrink-0 bg-white rounded-2xl p-6 border border-[#E8DCCB] hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between shadow-xs group/card"
                  >
                    <div>
                      {/* Top Bar: Author & Platform Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.author.avatar}
                            alt={testimonial.author.name}
                            className="w-11 h-11 rounded-full object-cover border border-[#C5A059]/40"
                            loading="lazy"
                          />
                          <div className="text-left">
                            <h4 className="font-royal font-bold text-sm text-[#54111B] tracking-wide">
                              {testimonial.author.name}
                            </h4>
                            <span className="font-serif text-[11px] text-[#8A5A2B] block">
                              {testimonial.author.handle}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            isFk
                              ? 'bg-blue-50 text-[#2874F0] border-[#2874F0]/30'
                              : 'bg-pink-50 text-[#9C27B0] border-[#9C27B0]/30'
                          }`}
                        >
                          {testimonial.author.marketplace}
                        </span>
                      </div>

                      {/* Product Tag */}
                      <div className="mb-3 text-left">
                        <span className="font-serif text-[11px] text-[#54111B] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DCCB] inline-flex items-center gap-1.5">
                          <ShoppingBag size={11} className="text-[#8A5A2B]" />
                          <span className="truncate max-w-[280px]">{testimonial.author.product}</span>
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex text-amber-500 gap-1 mb-3">
                        {[...Array(5)].map((_, sIdx) => (
                          <Star key={sIdx} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="font-serif text-xs sm:text-sm text-[#4A3538] text-left leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Verified Order Footer */}
                    <div className="mt-5 pt-3 border-t border-[#E8DCCB] flex items-center justify-between text-[11px] text-[#8A5A2B] font-serif">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 size={12} />
                        <span>Verified Order</span>
                      </span>
                      <span>Order #{testimonial.orderId}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Left & Right Smooth Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/6 bg-gradient-to-r from-[#F7F2E7] to-transparent sm:block z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/6 bg-gradient-to-l from-[#F7F2E7] to-transparent sm:block z-20" />
      </div>
    </section>
  );
}
