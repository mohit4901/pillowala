import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-stone-600 pt-14 pb-12 border-t border-stone-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-12">
          {/* Col 1: SHOP */}
          <div>
            <h4 className="font-bold text-stone-900 tracking-wider uppercase mb-4 text-[11px]">
              SHOP
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <Link to="/products?featured=true" className="hover:text-[#0066FF] transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/category/cotton-bedsheets" className="hover:text-[#0066FF] transition-colors">
                  Classic Sheets
                </Link>
              </li>
              <li>
                <Link to="/category/luxury-bedsheets" className="hover:text-[#0066FF] transition-colors">
                  Luxe Sheets
                </Link>
              </li>
              <li>
                <Link to="/category/bedsheet-sets" className="hover:text-[#0066FF] transition-colors">
                  Comforters & Sets
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-[#0066FF] transition-colors">
                  Pillows
                </Link>
              </li>
              <li>
                <Link to="/category/bedsheets" className="hover:text-[#0066FF] transition-colors">
                  Bedsheets
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#0066FF] transition-colors">
                  Bundles & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: ABOUT */}
          <div>
            <h4 className="font-bold text-stone-900 tracking-wider uppercase mb-4 text-[11px]">
              ABOUT
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <Link to="/about" className="hover:text-[#0066FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/category/bedsheets" className="hover:text-[#0066FF] transition-colors">
                  Our Sheets
                </Link>
              </li>
              <li>
                <Link to="/category/pillows" className="hover:text-[#0066FF] transition-colors">
                  Our Pillows
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0066FF] transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link to="/review" className="hover:text-[#0066FF] transition-colors font-semibold text-stone-800">
                  Reviews & QR Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0066FF] transition-colors">
                  Press & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div>
            <h4 className="font-bold text-stone-900 tracking-wider uppercase mb-4 text-[11px]">
              HELP
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <Link to="/contact" className="hover:text-[#0066FF] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0066FF] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0066FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0066FF] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/review" className="hover:text-[#0066FF] transition-colors">
                  Order Verification
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#0066FF] transition-colors">
                  Refer a Friend
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0066FF] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: SHOP WITH US & PAYMENTS */}
          <div>
            <h4 className="font-bold text-stone-900 tracking-wider uppercase mb-4 text-[11px]">
              SHOP WITH US
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-5 text-[10px] font-bold text-stone-700">
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">Amazon</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">Flipkart</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">Meesho</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">UPI</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">RuPay</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">Visa</span>
              <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded">Mastercard</span>
            </div>
            <p className="text-[11px] text-stone-400">
              © {new Date().getFullYear()} Pillowala Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
