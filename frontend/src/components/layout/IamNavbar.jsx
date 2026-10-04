import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  QrCode,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Trophy,
} from 'lucide-react';

export default function IamNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      num: '01',
      label: 'Home',
      href: '/',
      isRoute: true,
    },
    {
      num: '02',
      label: 'Find My Pillow',
      href: '#sleep-quiz',
      isRoute: false,
      tag: 'Quiz',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      num: '03',
      label: 'All Products',
      href: '#all-products',
      isRoute: false,
      tag: '29 Styles',
      tagColor: 'bg-stone-100 text-stone-800 border-stone-200',
    },
    {
      num: '04',
      label: '3D Showcase',
      href: '#coverflow',
      isRoute: false,
      tag: 'Interactive',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      num: '05',
      label: 'Customer Reviews',
      href: '#reviews',
      isRoute: false,
      tag: '★ 4.9',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      num: '06',
      label: 'Lucky Draw',
      href: '/lucky-draw',
      isRoute: true,
      tag: 'Win ₹5,000',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    },
    {
      num: '07',
      label: 'Our Story',
      href: '/about',
      isRoute: true,
    },
  ];

  const handleNavigation = (item) => {
    setIsMobileMenuOpen(false);
    if (item.isRoute) {
      navigate(item.href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate('/' + item.href);
      } else {
        const el = document.querySelector(item.href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Animation variants for container and staggered items
  const drawerVariants = {
    hidden: {
      opacity: 0,
      y: '-100%',
      transition: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.065,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 22,
        stiffness: 280,
      },
    },
  };

  const bottomCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.45,
        duration: 0.35,
        ease: 'easeOut',
      },
    },
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white ${
        scrolled ? 'border-b border-stone-200 py-3 shadow-xs' : 'border-b border-stone-100 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black group-hover:opacity-80 transition-opacity uppercase">
            PILLOWALA<span className="text-xs font-normal align-top ml-0.5 tracking-normal">™</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs sm:text-[13px] font-medium tracking-wide text-stone-700">
          <Link to="/" className="hover:text-black font-semibold text-black transition-colors">
            Home
          </Link>
          <a href="#sleep-quiz" className="hover:text-black transition-colors">
            Find My Pillow
          </a>
          <a href="#all-products" className="hover:text-black transition-colors">
            All Products
          </a>
          <a href="#coverflow" className="hover:text-black transition-colors">
            3D Showcase
          </a>
          <a href="#reviews" className="hover:text-black transition-colors">
            Reviews
          </a>
          <Link
            to="/lucky-draw"
            className="hover:text-amber-800 transition-colors flex items-center gap-1 font-bold text-amber-700"
          >
            <Trophy size={13} className="text-amber-500" />
            <span>Lucky Draw</span>
            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 uppercase tracking-wider animate-pulse">
              ₹30K
            </span>
          </Link>
          <Link to="/about" className="hover:text-black transition-colors">
            Our Story
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://www.flipkart.com/search?q=pillowala"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:text-black hover:border-black text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#2874F0]"></span>
            <span>Flipkart</span>
            <ExternalLink size={11} />
          </a>

          <Link
            to="/review"
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-stone-800 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-sm"
          >
            <QrCode size={13} />
            <span>Claim Reward</span>
          </Link>
        </div>

        {/* Mobile Navbar Header Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/review"
            className="px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
          >
            <QrCode size={11} />
            <span>Reward</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-stone-800 hover:text-black transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* FULLSCREEN EDITORIAL MOBILE MENU WITH COOL TEXT ANIMATIONS */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-white md:hidden flex flex-col justify-between overflow-hidden"
          >
            {/* Top Bar inside Menu Drawer */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1"
              >
                <span className="font-display text-2xl font-extrabold tracking-tight text-black uppercase">
                  PILLOWALA<span className="text-xs font-normal align-top ml-0.5">™</span>
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to="/review"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-1.5 rounded-full bg-black text-white text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <QrCode size={11} />
                  <span>REWARD</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-stone-900 hover:bg-stone-100 rounded-full transition-transform active:rotate-90 cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Center: Cool Animated Menu Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between space-y-6">
              <motion.div
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {menuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => handleNavigation(item)}
                      className="w-full group text-left py-3.5 border-b border-stone-100 flex items-center justify-between transition-all duration-200 active:scale-[0.99] cursor-pointer"
                    >
                      <div className="flex items-baseline gap-3.5">
                        <span className="font-mono-tech text-xs font-bold text-stone-400 group-hover:text-amber-600 transition-colors">
                          {item.num}
                        </span>
                        <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-900 group-hover:text-black group-hover:translate-x-2 transition-transform duration-200">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.tag && (
                          <span
                            className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full border ${item.tagColor}`}
                          >
                            {item.tag}
                          </span>
                        )}
                        <ArrowUpRight
                          size={18}
                          className="text-stone-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-amber-500 transition-all duration-200"
                        />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom Drawer Actions */}
              <motion.div
                variants={bottomCardVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 pt-2"
              >
                {/* Month-End Lucky Draw Card */}
                <Link
                  to="/review"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-4 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg border border-amber-300 relative overflow-hidden group active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Trophy size={14} className="text-yellow-200" />
                      <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-amber-100">
                        MONTH-END MEGA LUCKY DRAW
                      </span>
                    </div>
                    <span className="text-[9px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-black/25 text-white">
                      3 WINNERS
                    </span>
                  </div>
                  <p className="font-display font-black text-lg uppercase tracking-tight leading-tight">
                    ENTER ₹30,000 LUCKY DRAW →
                  </p>
                  <p className="text-[11px] text-amber-100 font-mono-tech mt-0.5">
                    Submit review proof to win prizes worth ₹30,000
                  </p>
                </Link>

                {/* Flipkart Official Store Button */}
                <a
                  href="https://www.flipkart.com/search?q=pillowala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono-tech font-bold flex items-center justify-between transition-colors border border-stone-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2874F0]"></span>
                    <span>VISIT FLIPKART OFFICIAL STORE</span>
                  </div>
                  <ExternalLink size={13} className="text-stone-500" />
                </a>

                <div className="pt-1 text-center">
                  <span className="text-[9px] font-mono-tech uppercase tracking-[0.2em] text-stone-400">
                    PILLOWALA™ • LUXURY ERGONOMIC COMFORT
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
