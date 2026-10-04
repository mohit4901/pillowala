import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';

export default function SidewalkFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-white text-stone-900 border-t border-stone-200 select-none overflow-hidden">
      {/* Main 4-Column Footer matching user's exact screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Column 1: Brand & Textile Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-stone-950 uppercase">
                PILLOWALA
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-600">
                *EST. 22
              </span>
            </div>
            <p className="font-mono-tech text-xs text-stone-600 leading-relaxed max-w-sm">
              Authentic Indian textile craftsmanship direct from the weaving mills of Panipat. Available on official Flipkart and Meesho platforms with verified buyer protection.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono-tech text-stone-600">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 size={13} />
                <span>100% Genuine</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-sky-600 font-medium">
                <ShieldCheck size={13} />
                <span>Verified Reviews</span>
              </span>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-stone-950">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 font-mono-tech text-xs text-stone-600">
              <li>
                <Link to="/category/bedsheets" className="hover:text-stone-950 transition-colors">
                  Winter Velvet Bedsheets
                </Link>
              </li>
              <li>
                <Link to="/category/bedsheets" className="hover:text-stone-950 transition-colors">
                  Pure Cotton Flat Sheets
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-stone-950 transition-colors">
                  Hypoallergenic Pillows
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-stone-950 transition-colors">
                  Frill Cushion Sets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-stone-950 transition-colors">
                  All 29 Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Channels */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-stone-950">
              OFFICIAL CHANNELS
            </h4>
            <ul className="space-y-2 font-mono-tech text-xs text-stone-600">
              <li>
                <a
                  href="https://www.flipkart.com/search?q=pillowala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-950 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2874F0]"></span>
                  <span>Flipkart Official Store (11)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.meesho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-950 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#9C27B0]"></span>
                  <span>Meesho Meri Shop (18)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <Link to="/review" className="hover:text-stone-950 transition-colors flex items-center gap-1.5">
                  <QrCode size={12} className="text-amber-600" />
                  <span>Scan QR / Claim Reward</span>
                </Link>
              </li>
              <li>
                <Link to="/lucky-draw" className="hover:text-amber-700 font-bold transition-colors flex items-center gap-1.5 text-amber-800">
                  <span>🏆 Monthly Mega Lucky Draw</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-stone-950 transition-colors">
                  About Pillowala Mills
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-stone-950 transition-colors">
                  Customer Support & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Dispatch Notices / Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-stone-950">
              DISPATCH NOTICES
            </h4>
            <p className="font-mono-tech text-xs text-stone-600">
              Receive private product drop alerts and exclusive review reward multipliers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-full overflow-hidden border border-stone-300 bg-stone-50 focus-within:border-stone-900 transition-colors shadow-xs">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-2.5 text-xs font-mono-tech text-stone-900 placeholder-stone-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-stone-950 text-white px-4 font-mono-tech text-xs font-bold hover:bg-stone-800 transition-colors uppercase cursor-pointer"
                >
                  JOIN
                </button>
              </div>
              {subscribed && (
                <span className="text-[11px] font-mono-tech text-emerald-600 block animate-fadeIn font-medium">
                  ✓ Successfully registered for textile dispatches.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Technical Sub-bar matching user's screenshot */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono-tech text-stone-500">
          <div>
            <span>MILL ORIGIN: PANIPAT, HARYANA // PIN 132103</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-stone-900 transition-colors">PRIVACY POLICY</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-stone-900 transition-colors">TERMS OF SERVICE</Link>
            <span>•</span>
            <Link to="/review" className="hover:text-stone-900 transition-colors">REWARD T&C</Link>
          </div>
        </div>
      </div>

      {/* MASSIVE BRUTALIST BOTTOM TYPOGRAPHY matching user's screenshot in WHITE THEME */}
      <div className="w-full px-2 sm:px-4 pt-4 pb-2 border-t border-stone-200 overflow-hidden text-center select-none pointer-events-none bg-stone-50/50">
        <div className="font-display text-[15vw] sm:text-[18vw] font-black uppercase tracking-tighter text-stone-950 leading-[0.8] drop-shadow-xs whitespace-nowrap text-center">
          PILLOWALA
        </div>
      </div>
    </footer>
  );
}
