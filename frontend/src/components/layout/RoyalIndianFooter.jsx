import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, QrCode, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';

export default function RoyalIndianFooter() {
  return (
    <footer className="w-full bg-[#460C14] text-[#E8DCCB] border-t-2 border-[#C5A059]/50 select-none">
      {/* Upper Footer Columns matching reference image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand Heritage & Social Icons */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <span className="font-royal-decor text-2xl font-bold uppercase tracking-wider text-[#FAF7F2]">
                PILLOWALA
              </span>
              <span className="text-[10px] tracking-[0.25em] font-serif uppercase text-[#C5A059]">
                HERITAGE SLEEP ATELIER • EST. 2022
              </span>
            </div>

            <p className="text-xs font-serif text-[#D5C6B1] leading-relaxed max-w-sm">
              Dedicated to the royal heritage of Indian beddings. Weaving heavy 350 TC flannel velvet bedsheets and resilient micro-bounce pillows directly at our mills in Panipat, Haryana.
            </p>

            {/* Social Icons matching reference image */}
            <div className="flex items-center gap-2 pt-2">
              {['Facebook', 'Twitter', 'Instagram', 'Pinterest'].map((network, i) => (
                <div
                  key={network}
                  className="w-8 h-8 rounded-full bg-[#5A1620] border border-[#C5A059]/40 flex items-center justify-center text-xs text-[#E4CA88] hover:bg-[#C5A059] hover:text-[#460C14] transition-colors cursor-pointer"
                >
                  {network[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Master Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-royal text-xs font-bold uppercase tracking-[0.2em] text-[#E4CA88] border-b border-[#C5A059]/30 pb-2">
              MASTER COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#D5C6B1]">
              <li>
                <Link to="/category/bedsheets" className="hover:text-[#FAF7F2] transition-colors">
                  Winter Velvet Bedsheets (350 TC)
                </Link>
              </li>
              <li>
                <Link to="/category/bedsheets" className="hover:text-[#FAF7F2] transition-colors">
                  Pure Cotton Flat Sheets (200 TC)
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-[#FAF7F2] transition-colors">
                  Microfiber Sleeping Pillows (2-Pack)
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-[#FAF7F2] transition-colors">
                  Handcrafted Frill Cushion Sets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#FAF7F2] transition-colors">
                  All 29 Scraped Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Marketplaces & Verification */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-royal text-xs font-bold uppercase tracking-[0.2em] text-[#E4CA88] border-b border-[#C5A059]/30 pb-2">
              OFFICIAL CHANNELS
            </h4>
            <ul className="space-y-2 text-xs font-serif text-[#D5C6B1]">
              <li>
                <a
                  href="https://www.flipkart.com/search?q=pillowala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAF7F2] flex items-center gap-1.5 transition-colors"
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
                  className="hover:text-[#FAF7F2] flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#9C27B0]"></span>
                  <span>Meesho Meri Shop (18)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <Link
                  to="/review"
                  className="hover:text-[#FAF7F2] flex items-center gap-1.5 transition-colors text-[#E4CA88]"
                >
                  <QrCode size={12} />
                  <span>Scan QR / Claim Review Reward</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF7F2] transition-colors">
                  Our Panipat Weaving Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Mill Origin */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-royal text-xs font-bold uppercase tracking-[0.2em] text-[#E4CA88] border-b border-[#C5A059]/30 pb-2">
              CUSTOMER CARE
            </h4>
            <div className="space-y-2 text-xs font-serif text-[#D5C6B1]">
              <p>Panipat Textile Mill, Haryana, 132103</p>
              <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
              <p className="text-[#E4CA88]">care@pillowala.com</p>
              <div className="pt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 size={12} />
                <span>100% Genuine Weave</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Golden Copyright Ribbon matching reference image */}
      <div className="w-full bg-[#36080F] py-4 px-4 border-t border-[#C5A059]/40 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs font-serif text-[#C5A059] tracking-wider uppercase">
          <span>PANIPAT WEAVING MILLS • QUALITY ASSURED SINCE 2022</span>
          <span>COPYRIGHT © 2026 PILLOWALA. HANDCRAFTED ROYAL SLEEP TEXTILES OF INDIA.</span>
          <div className="flex items-center gap-3 text-[#D5C6B1]">
            <Link to="/about" className="hover:text-[#FAF7F2]">Privacy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#FAF7F2]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
