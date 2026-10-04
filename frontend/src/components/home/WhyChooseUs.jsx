import React from 'react';
import { Feather, Shield, Wind, Sparkles, HeartHandshake } from 'lucide-react';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: <Sparkles className="text-brand-accent" size={24} />,
      title: 'Ergonomic Spine Alignment',
      description: 'Engineered contours cradle the cervical curvature, reducing pressure points on shoulders and upper cervical vertebrae.',
    },
    {
      icon: <Wind className="text-brand-accent" size={24} />,
      title: 'Breathable Temperature Flow',
      description: 'Open-cell memory foam and 300TC organic cotton shells circulate cool air throughout the night, preventing heat buildup.',
    },
    {
      icon: <Shield className="text-brand-accent" size={24} />,
      title: 'Rigorous 7-Point Quality Check',
      description: 'Every pillow batch is tested for bounce-back resiliency, odorless materials, and seam durability before dispatch.',
    },
    {
      icon: <Feather className="text-brand-accent" size={24} />,
      title: 'Zero Pressure Rebound',
      description: 'High-density foam adapts to side, back, or stomach sleeping styles in seconds without flattening over time.',
    },
    {
      icon: <HeartHandshake className="text-brand-accent" size={24} />,
      title: 'Genuine Marketplace Trust',
      description: 'Available on Amazon, Flipkart, and Meesho with complete doorstep returns and prompt replacement policies.',
    },
  ];

  return (
    <section className="py-20 bg-brand-100/60 border-y border-brand-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500 block mb-2">
            The Pillowala Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Why Discerning Sleepers Choose Us
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            We spent over 18 months perfecting the density, fabric weave, and loft of our pillows so you wake up revitalized every morning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-brand-200/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="font-semibold text-stone-900 text-base mb-2">{b.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
