import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts } from '../../services/api';

// Inline Icons (Zero external dependencies)
const ChevronLeftIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// High-resolution authentic scraped products fallback (Flipkart & Meesho)
const fallbackScrapedProducts = [
  {
    tag: "FLIPKART // VELVET",
    titleLine1: "FLEECE VELVET",
    titleLine2: "350 TC KING FITTED",
    desc: "Luxury plush winter bedsheet with 2 zipper pillow covers (₹628)",
    img: "https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg",
    ctaText: "BUY ON FLIPKART",
    ctaUrl: "https://www.flipkart.com/pillowala-fleece-velvet-king-fitted-elastic-350-tc-floral-1-bedsheet-2-pillow-covers/p/itm14b625d21ae4f?pid=BDSHQWH6TZYHVMHS",
  },
  {
    tag: "MEESHO // BESTSELLER",
    titleLine1: "FIBER PILLOW",
    titleLine2: "PACK OF 2 (16x26)",
    desc: "Ultra-bounce hypoallergenic microfibres for deep spine support (₹387)",
    img: "https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512",
    ctaText: "BUY ON MEESHO",
    ctaUrl: "https://www.meesho.com/s/p/7atwd7",
  },
  {
    tag: "FLIPKART // 5-PIECE",
    titleLine1: "PURE COTTON 200TC",
    titleLine2: "BEDSHEET + 4 COVERS",
    desc: "Flat summer king sheet with 2 frill pillows + 2 cushion covers (₹458)",
    img: "https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg",
    ctaText: "BUY ON FLIPKART",
    ctaUrl: "https://dl.flipkart.com/s/v95syrNNNN",
  },
  {
    tag: "MEESHO // VELVET",
    titleLine1: "WARM FLANNEL",
    titleLine2: "ZIP CLOSER BEDSHEET",
    desc: "Heavyweight floral velvet double king fitted sheet (₹644)",
    img: "https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512",
    ctaText: "BUY ON MEESHO",
    ctaUrl: "https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho1lmw",
  },
  {
    tag: "FLIPKART // PILLOWS",
    titleLine1: "NAVY STRIPED",
    titleLine2: "MICROFIBRE SLEEPING",
    desc: "Hotel-grade luxury striped pillows with double-stitched border (₹300)",
    img: "https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/j/b/e/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcduxcecpv.jpeg",
    ctaText: "BUY ON FLIPKART",
    ctaUrl: "https://dl.flipkart.com/s/8Ee7vkuuuN",
  },
  {
    tag: "MEESHO // SET OF 5",
    titleLine1: "OLIVE GREEN",
    titleLine2: "COTTON 90x95 INCH",
    desc: "Set of 5 with ruffled decorative pillowcases and cushion covers (₹439)",
    img: "https://images.meesho.com/images/products/741293602/w9eqn_512.avif?width=512",
    ctaText: "BUY ON MEESHO",
    ctaUrl: "https://www.meesho.com/cotton-flat-bedsheet-90-x-95-inch-i-set-of-5-i-frill-decorated-pillow-and-cushion-cover-i-olive-green/p/c9chsy",
  },
  {
    tag: "FLIPKART // WOOLEN",
    titleLine1: "350 TC WOOLEN",
    titleLine2: "WINTER FITTED SHEET",
    desc: "Deep-pocket elastic snug grip with vivid botanical floral print (₹630)",
    img: "https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/u/n/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahjahhqjgk.jpeg",
    ctaText: "BUY ON FLIPKART",
    ctaUrl: "https://dl.flipkart.com/s/v9KtEyNNNN",
  },
  {
    tag: "MEESHO // COZY",
    titleLine1: "BED PILLOW 16x24",
    titleLine2: "SET OF 2 COMBOS",
    desc: "Breathable fluffy resilient microfiber bed pillows for daily use (₹374)",
    img: "https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512",
    ctaText: "BUY ON MEESHO",
    ctaUrl: "https://www.meesho.com/bed-pillowcozy-pillow-16x24-2-pcs/p/bsh3um",
  },
];

export default function CoverFlowCarousel({
  sectionLabel = "ICONIC RELEASES // 3D CATALOG",
  autoplay = true,
  autoplayDelay = 5000,
  className = "",
  onCtaClick,
}) {
  const [items, setItems] = useState(fallbackScrapedProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);

  // Fetch live products from backend to dynamically populate coverflow
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        const res = await getProducts({});
        const list = res.data || [];
        if (list.length > 0) {
          const dynamicItems = list.slice(0, 10).map((p) => {
            const isFk = p.marketplace === 'flipkart';
            const nameWords = p.name.split(' ');
            const line1 = nameWords.slice(0, 3).join(' ');
            const line2 = nameWords.slice(3, 7).join(' ');

            const buyUrl = p.buyLinks?.flipkart || p.buyLinks?.meesho || p.affiliateUrl || p.url || p.externalUrl || (p.marketplace === 'flipkart' ? 'https://www.flipkart.com' : 'https://www.meesho.com');

            return {
              tag: `${p.marketplace.toUpperCase()} // ₹${p.price}`,
              titleLine1: line1.toUpperCase(),
              titleLine2: line2 ? line2.toUpperCase() : 'PILLOWALA ARCHIVE',
              desc: `${p.name.slice(0, 75)}...`,
              img: p.images?.[0] || fallbackScrapedProducts[0].img,
              ctaText: `BUY ON ${p.marketplace.toUpperCase()}`,
              ctaUrl: buyUrl,
            };
          });
          setItems(dynamicItems);
        }
      } catch (e) {
        console.warn('CoverFlow fallback used:', e.message);
      }
    };
    fetchRealProducts();
  }, []);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx % total);
  };

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;
    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      id="coverflow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#111111',
        padding: '80px 0 70px',
        overflow: 'hidden',
        userSelect: 'none',
        borderBottom: '1px solid #E5E5E5',
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      }}
      className={className}
    >
      {/* Soft Ambient Blur Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 0.35,
          overflow: 'hidden',
        }}
      >
        <img
          src={items[currentIndex]?.img}
          alt="ambience background"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.1) blur(48px)',
            transform: 'scale(1.2)',
            transition: 'opacity 1000ms ease, filter 1000ms ease',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.98) 100%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 z-10 flex flex-col items-center">
        {/* Eyebrow */}
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-10">
            <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #111111)' }} />
            <h3
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#1c1917',
                margin: 0,
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              {sectionLabel}
            </h3>
            <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #111111, transparent)' }} />
          </div>
        )}

        {/* 3D Coverflow Stage */}
        <div
          className="relative w-full h-[520px] flex justify-center items-center mb-8"
          style={{ perspective: '1400px' }}
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = 'translateX(0px) scale(0.4) rotateY(0deg)';
            let opacity = 0;
            let zIndex = 0;
            let filter = 'brightness(0.35) blur(3px)';
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = 'translateX(0px) scale(1) rotateY(0deg)';
              opacity = 1;
              zIndex = 30;
              filter = 'brightness(1)';
            } else if (offset === 1) {
              transform = 'translateX(285px) scale(0.84) rotateY(-24deg)';
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === 2) {
              transform = 'translateX(510px) scale(0.68) rotateY(-38deg)';
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            } else if (offset === total - 1) {
              transform = 'translateX(-285px) scale(0.84) rotateY(24deg)';
              opacity = 0.65;
              zIndex = 20;
              filter = 'brightness(0.75)';
            } else if (offset === total - 2) {
              transform = 'translateX(-510px) scale(0.68) rotateY(38deg)';
              opacity = 0.38;
              zIndex = 10;
              filter = 'brightness(0.55) blur(1px)';
            }

            return (
              <div
                key={idx}
                onClick={() => !isCenter && goToSlide(idx)}
                style={{
                  position: 'absolute',
                  width: '330px',
                  height: '500px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#0a0a0a',
                  border: isCenter ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: 'center center',
                  transition: 'all 800ms cubic-bezier(0.25, 1, 0.5, 1)',
                  boxShadow: isCenter
                    ? '0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(255,255,255,0.15)'
                    : '0 15px 35px rgba(0,0,0,0.6)',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                {/* Photo */}
                <img
                  src={item.img}
                  alt={item.titleLine1}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.98) 100%)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Content Overlay */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    padding: '22px 20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    zIndex: 20,
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? 'translateY(0px)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  {/* Tag */}
                  <div style={{ textAlign: 'right', width: '100%', paddingRight: '4px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#ffffff',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: 'auto',
                      paddingBottom: '4px',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.65rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.1,
                        fontFamily: "'Syne', sans-serif",
                        textShadow: '0 3px 14px rgba(0,0,0,0.95)',
                      }}
                    >
                      {item.titleLine1}
                    </h2>

                    {item.titleLine2 && (
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: '#e5e5e5',
                          lineHeight: 1.2,
                          fontFamily: "'Space Grotesk', sans-serif",
                          textShadow: '0 3px 10px rgba(0,0,0,0.9)',
                        }}
                      >
                        {item.titleLine2}
                      </span>
                    )}

                    <div
                      style={{
                        width: '36px',
                        height: '2px',
                        backgroundColor: '#ffffff',
                        borderRadius: '2px',
                        margin: '6px auto 5px',
                        boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                      }}
                    />

                    {item.desc && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.88)',
                          maxWidth: '280px',
                          margin: '0 0 12px',
                          lineHeight: 1.35,
                          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                        }}
                      >
                        {item.desc}
                      </p>
                    )}

                    <a
                      href={item.ctaUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (onCtaClick) {
                          e.preventDefault();
                          onCtaClick(item);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 22px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        transition: 'transform 200ms ease, background-color 200ms ease',
                      }}
                      className="hover:scale-105 hover:bg-stone-200"
                    >
                      <span>{item.ctaText || 'VIEW PRODUCT'}</span>
                      <ArrowRightIcon />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous product"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            color: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            zIndex: 40,
            transition: 'all 200ms ease',
          }}
          className="hover:bg-stone-900 hover:text-white hover:border-stone-900"
        >
          <ChevronLeftIcon />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next product"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            color: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            zIndex: 40,
            transition: 'all 200ms ease',
          }}
          className="hover:bg-stone-900 hover:text-white hover:border-stone-900"
        >
          <ChevronRightIcon />
        </button>

        {/* Pagination Dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 30 }}>
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                height: '7px',
                width: idx === currentIndex ? '30px' : '7px',
                borderRadius: '9999px',
                backgroundColor: idx === currentIndex ? '#111111' : '#d4d4d8',
                border: 'none',
                cursor: 'pointer',
                boxShadow: idx === currentIndex ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
