import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does the physical QR code review card work?',
      a: 'Every Pillowala pillow package arrives with a physical greeting insert containing a QR code. When you scan the code with your phone camera, you are directed straight to our mobile-first review portal (pillowala.com/review) where you select whether you bought from Amazon, Flipkart, or Meesho, select your pillow, rate your experience, and share genuine feedback in under 45 seconds.',
    },
    {
      q: 'Which pillow is best for neck pain and cervical stiffness?',
      a: 'Our Ergonomic Cervical Memory Foam Pillow is engineered specifically with dual-depth contour lobes (high lobe for side sleeping, lower lobe for back sleeping) that hold the cervical spine in neutral horizontal alignment, relieving pressure from neck muscles.',
    },
    {
      q: 'Are Pillowala pillows washable?',
      a: 'All our memory foam pillows come with a premium zippered bamboo/organic cotton outer cover that is fully machine washable. The memory foam core itself should not be submerged in water; simply spot-clean and let air dry in an airy room away from direct harsh sunlight.',
    },
    {
      q: 'How do marketplace replacements work if I bought on Amazon, Flipkart, or Meesho?',
      a: 'Since your order is fulfilled directly through Amazon, Flipkart, or Meesho, you enjoy each platform’s full return and replacement protection. If there is any shipping defect, you can initiate a seamless replacement directly through your marketplace orders page or reach our WhatsApp support team.',
    },
    {
      q: 'What is the 100-Night Sleep Trial guarantee?',
      a: 'Your body typically needs 10 to 14 days to adjust to a new ergonomic cervical curvature if transitioning from flat cotton pillows. We stand behind our ergonomic design: if your sleep quality does not noticeably improve, reach out to our customer care for loft adjustment guidance or assistance.',
    },
  ];

  return (
    <section className="py-20 bg-brand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500 block mb-2">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Everything you need to know about our pillow ergonomics, materials, and QR review program.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-soft overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-stone-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
