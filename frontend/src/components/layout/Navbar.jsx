import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown, QrCode } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setShopDropdown(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 border-b ${
          scrolled ? 'border-stone-200 shadow-xs py-3' : 'border-stone-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo: Clean Lowercase Brooklinen Style */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-serif text-2xl sm:text-[28px] font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
              pillowala<span className="text-[#0066FF]">.</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold tracking-wider text-stone-800 uppercase">
            {/* SHOP Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdown(true)}
              onMouseLeave={() => setShopDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#0066FF] transition-colors py-2 cursor-pointer"
              >
                <span>SHOP</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${shopDropdown ? 'rotate-180 text-[#0066FF]' : ''}`} />
              </button>

              {shopDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 shadow-soft-lg rounded-xl py-3 z-50 animate-fadeIn text-left normal-case">
                  <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Master Collections
                  </div>
                  <Link
                    to="/category/pillows"
                    className="flex items-center justify-between px-4 py-2 hover:bg-stone-50 text-stone-800 hover:text-[#0066FF] text-sm font-semibold transition-colors"
                  >
                    <span>🛌 Pillows Collection</span>
                    <span className="text-[10px] text-stone-400 uppercase">Explore</span>
                  </Link>
                  <Link
                    to="/category/bedsheets"
                    className="flex items-center justify-between px-4 py-2 hover:bg-stone-50 text-stone-800 hover:text-[#0066FF] text-sm font-semibold transition-colors"
                  >
                    <span>🛏️ Bedsheets Collection</span>
                    <span className="text-[10px] text-stone-400 uppercase">Explore</span>
                  </Link>
                  <div className="border-t border-stone-100 my-2" />
                  <Link
                    to="/products"
                    className="block px-4 py-2 hover:bg-stone-50 text-stone-800 hover:text-[#0066FF] text-xs font-bold transition-colors"
                  >
                    Browse All Products →
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/products?featured=true"
              className="hover:text-[#0066FF] transition-colors py-2"
            >
              BEST SELLERS
            </Link>

            <Link
              to="/about"
              className="hover:text-[#0066FF] transition-colors py-2"
            >
              ABOUT
            </Link>

            <Link
              to="/review"
              className="hover:text-[#0066FF] transition-colors py-2"
            >
              REVIEWS
            </Link>

            <Link
              to="/offers"
              className="hover:text-[#0066FF] transition-colors py-2"
            >
              OFFERS
            </Link>
          </nav>

          {/* Right Action Icons: Search, Review/Account, Cart Bag */}
          <div className="flex items-center gap-4 sm:gap-6 text-stone-800">
            {/* Search Icon & Dropdown Input */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:text-[#0066FF] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-full mt-2 w-72 bg-white p-2 rounded-xl border border-stone-200 shadow-soft-lg flex items-center gap-2 z-50 animate-fadeIn"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sheets, pillows..."
                    autoFocus
                    className="w-full px-3 py-1.5 text-xs text-stone-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-lg shrink-0 hover:bg-[#0052CC]"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Review / QR Portal CTA Link */}
            <Link
              to="/review"
              id="nav-review-cta"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#0066FF] transition-colors"
            >
              <QrCode size={15} className="text-stone-500" />
              <span>Review Portal</span>
            </Link>

            {/* Shopping Bag Icon: Brooklinen Style "0 items" */}
            <Link
              to="/products"
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer"
              aria-label="View Catalog & Bag"
            >
              <ShoppingBag size={18} />
              <span className="text-xs font-semibold text-stone-700 hidden sm:inline">0 items</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-stone-700 hover:text-stone-950 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white animate-fadeIn">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <Link to="/" className="font-serif text-2xl font-bold text-stone-900" onClick={() => setIsOpen(false)}>
              pillowala<span className="text-[#0066FF]">.</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-left">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] block mb-1">
                Official Review QR Portal
              </span>
              <p className="text-xs text-stone-600 mb-2">
                Have a review card from your package? Submit your screenshot to enter our ₹30,000 Lucky Draw.
              </p>
              <Link
                to="/review"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0066FF] text-white font-bold text-xs"
              >
                <QrCode size={15} />
                <span>Submit Product Review</span>
              </Link>
            </div>

            <div className="space-y-1 text-sm font-semibold tracking-wider uppercase text-stone-800">
              <Link
                to="/category/pillows"
                onClick={() => setIsOpen(false)}
                className="block py-3 border-b border-stone-100"
              >
                🛌 Pillows Collection
              </Link>
              <Link
                to="/category/bedsheets"
                onClick={() => setIsOpen(false)}
                className="block py-3 border-b border-stone-100"
              >
                🛏️ Bedsheets Collection
              </Link>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="block py-3 border-b border-stone-100"
              >
                All Products
              </Link>
              <Link
                to="/offers"
                onClick={() => setIsOpen(false)}
                className="block py-3 border-b border-stone-100"
              >
                Deals & Offers
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block py-3 border-b border-stone-100"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
