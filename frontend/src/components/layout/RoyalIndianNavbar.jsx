import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, QrCode, Sparkles, ExternalLink, ShieldCheck, Phone } from 'lucide-react';

export default function RoyalIndianNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full select-none">
      {/* 1. Top Announcement Ribbon in Deep Royal Maroon matching reference image */}
      <div className="w-full bg-[#54111B] text-[#E8DCCB] py-2 px-4 border-b border-[#C5A059]/30 text-[11px] tracking-[0.25em] uppercase font-serif">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059]">✦</span>
            <span className="hidden sm:inline">PAN-INDIA EXPRESS DISPATCH • 100% PURE WEAVE</span>
            <span className="sm:hidden">FREE DISPATCH • 100% PURE WEAVE</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-[#C5A059]/90">
              OFFICIAL FLIPKART & MEESHO PARTNER
            </span>
            <span className="text-[#C5A059]">✦</span>
            <span className="flex items-center gap-1 text-[#E8DCCB]">
              <span>🇮🇳 IN / ₹</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header with Royal Ornament Emblem matching MAHA GAURI */}
      <div className="w-full bg-[#FAF7F2] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCCB]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Customer Care & Review Portal Link */}
          <div className="hidden md:flex items-center gap-4 text-xs tracking-wider text-[#54111B]">
            <Link
              to="/review"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A059]/50 bg-white hover:bg-[#F3ECE0] transition-colors shadow-xs"
            >
              <QrCode size={13} className="text-[#54111B]" />
              <span className="font-semibold text-[11px] uppercase">Review Reward</span>
            </Link>
            <a
              href="https://www.flipkart.com/search?q=pillowala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#54111B]/80 hover:text-[#54111B] flex items-center gap-1 text-[11px] uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-[#2874F0]"></span>
              <span>Flipkart Store</span>
            </a>
          </div>

          {/* Center: Majestic Brand Logo with Royal Flourish Ornaments */}
          <div className="flex flex-col items-center justify-center text-center mx-auto">
            {/* Royal Indian Arch / Flourish SVG Motif */}
            <div className="flex items-center gap-2 mb-1 text-[#C5A059]">
              <svg width="36" height="12" viewBox="0 0 36 12" fill="none" className="rotate-180">
                <path d="M0 6C8 6 12 0 18 0C24 0 28 6 36 6C28 6 24 12 18 12C12 12 8 6 0 6Z" fill="#C5A059" fillOpacity="0.8"/>
              </svg>
              <span className="text-[10px] tracking-[0.3em] font-serif uppercase text-[#8A5A2B]">EST. 2022</span>
              <svg width="36" height="12" viewBox="0 0 36 12" fill="none">
                <path d="M0 6C8 6 12 0 18 0C24 0 28 6 36 6C28 6 24 12 18 12C12 12 8 6 0 6Z" fill="#C5A059" fillOpacity="0.8"/>
              </svg>
            </div>

            {/* Brand Title: PILLOWALA in Royal Serif Font */}
            <Link to="/" className="group flex flex-col items-center">
              <span className="font-royal-decor text-3xl sm:text-5xl font-black tracking-wider text-[#54111B] group-hover:text-[#701A26] transition-colors uppercase drop-shadow-xs">
                PILLOWALA
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#8A5A2B] uppercase font-serif mt-1">
                ROYAL SLEEP TEXTILE ATELIER • PANIPAT
              </span>
            </Link>
          </div>

          {/* Right: Marketplace Quick Links & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.meesho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A059]/50 bg-white hover:bg-[#F3ECE0] text-[#54111B] text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#9C27B0]"></span>
              <span>Meesho Store</span>
              <ExternalLink size={10} />
            </a>

            <Link
              to="/review"
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#54111B] text-[#E8DCCB] text-[10px] uppercase font-semibold tracking-wider"
            >
              <QrCode size={12} />
              <span>Reward</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#54111B] hover:bg-[#E8DCCB]/40"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Deep Maroon Ribbon Navigation Bar matching reference image */}
      <nav className="hidden md:block w-full bg-[#54111B] border-y border-[#C5A059]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 lg:gap-6 py-2.5">
          <Link
            to="/"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            HOME
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/products"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            ALL COLLECTIONS (29)
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/category/bedsheets"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            BEDSHEETS ARCHIVE
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/category/pillows"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            LUXURY PILLOWS
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/offers"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            ROYAL OFFERS
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/review"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            REVIEWS & REWARDS
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/about"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            ABOUT US
          </Link>
          <span className="text-[#C5A059]/40">•</span>
          <Link
            to="/contact"
            className="px-4 py-1 text-xs tracking-[0.2em] font-serif text-[#FAF7F2] hover:text-[#E4CA88] uppercase transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8DCCB] px-6 py-6 space-y-4 animate-fadeIn text-[#54111B] font-serif">
          <div className="flex flex-col space-y-3 text-sm tracking-wider uppercase border-b border-[#E8DCCB] pb-4">
            <Link to="/" className="py-1.5 hover:text-[#8A5A2B]">Home</Link>
            <Link to="/products" className="py-1.5 hover:text-[#8A5A2B]">All Collections (29)</Link>
            <Link to="/category/bedsheets" className="py-1.5 hover:text-[#8A5A2B]">Bedsheets Archive</Link>
            <Link to="/category/pillows" className="py-1.5 hover:text-[#8A5A2B]">Luxury Pillows & Cushions</Link>
            <Link to="/offers" className="py-1.5 hover:text-[#8A5A2B]">Royal Deals & Coupons</Link>
            <Link to="/review" className="py-1.5 hover:text-[#8A5A2B]">Claim Review Cashback</Link>
            <Link to="/about" className="py-1.5 hover:text-[#8A5A2B]">About Pillowala Mills</Link>
            <Link to="/contact" className="py-1.5 hover:text-[#8A5A2B]">Contact & Support</Link>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href="https://www.flipkart.com/search?q=pillowala"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl bg-[#2874F0] text-white text-xs text-center font-bold tracking-wider uppercase"
            >
              Flipkart Official Store (11)
            </a>
            <a
              href="https://www.meesho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl bg-[#9C27B0] text-white text-xs text-center font-bold tracking-wider uppercase"
            >
              Meesho Store (18)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
