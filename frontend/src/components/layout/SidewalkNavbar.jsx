import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, QrCode, ArrowUpRight, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SidewalkNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 py-3 shadow-sm'
            : 'bg-white border-b border-stone-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo: Clean Brutalist High-Fashion */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl sm:text-3xl font-black tracking-tighter text-stone-950 group-hover:text-stone-700 transition-colors uppercase">
              PILLOWALA
            </span>
            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-600 hidden sm:inline-block">
              ©26
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono-tech text-xs uppercase tracking-[0.2em] text-stone-500">
            <Link to="/products" className="hover:text-stone-950 transition-colors">
              ALL PRODUCTS (29)
            </Link>
            <Link to="/category/bedsheets" className="hover:text-stone-950 transition-colors">
              BEDSHEETS
            </Link>
            <Link to="/category/pillows" className="hover:text-stone-950 transition-colors">
              PILLOWS
            </Link>
            <a href="#coverflow" className="hover:text-stone-950 transition-colors">
              COVERFLOW 3D
            </a>
            <a href="#catalog" className="hover:text-stone-950 transition-colors">
              SELECTION
            </a>
            <a href="#testimonials" className="hover:text-stone-950 transition-colors">
              REVIEWS
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Direct Marketplace Link */}
            <a
              href="https://www.flipkart.com/search?q=pillowala"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:text-stone-950 hover:border-stone-400 text-[11px] font-mono-tech uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#2874F0]"></span>
              <span>FLIPKART</span>
              <ExternalLink size={10} />
            </a>

            {/* Review Portal Reward CTA Button */}
            <Link
              to="/review"
              className="px-4 py-2 rounded-full bg-stone-950 text-white font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <QrCode size={13} />
              <span>CLAIM REWARD</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/review"
              className="px-3 py-1.5 rounded-full bg-stone-950 text-white text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <QrCode size={12} />
              <span>REWARD</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white/98 backdrop-blur-xl px-4 py-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col space-y-3 font-mono-tech text-sm uppercase tracking-wider text-stone-700">
              <Link to="/products" className="py-2 border-b border-stone-100 hover:text-stone-950">
                All Products (29)
              </Link>
              <Link to="/category/bedsheets" className="py-2 border-b border-stone-100 hover:text-stone-950">
                Bedsheets Collection
              </Link>
              <Link to="/category/pillows" className="py-2 border-b border-stone-100 hover:text-stone-950">
                Pillows & Cushions
              </Link>
              <a href="#coverflow" className="py-2 border-b border-stone-100 hover:text-stone-950">
                3D CoverFlow Showcase
              </a>
              <a href="#catalog" className="py-2 border-b border-stone-100 hover:text-stone-950">
                Catalog & Filters
              </a>
              <a href="#testimonials" className="py-2 border-b border-stone-100 hover:text-stone-950">
                Customer Testimonials
              </a>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
              <a
                href="https://www.flipkart.com/search?q=pillowala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-mono-tech uppercase font-bold text-center flex items-center justify-center gap-2"
              >
                <span>VISIT OFFICIAL FLIPKART STORE</span>
                <ExternalLink size={13} />
              </a>
              <Link
                to="/review"
                className="w-full py-3 rounded-xl bg-stone-950 text-white text-xs font-mono-tech font-black uppercase text-center flex items-center justify-center gap-2"
              >
                <QrCode size={14} />
                <span>CLAIM REVIEW REWARD</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
