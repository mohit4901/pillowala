import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    marketplace: 'amazon',
    orderId: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-brand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Customer Support & Assistance
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Have a question regarding your order from Amazon, Flipkart, or Meesho? Our sleep concierge is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="md:col-span-5 bg-brand-charcoal text-white rounded-3xl p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold">Contact Concierge</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              We respond to all customer inquiries within 12 business hours. Please have your marketplace Order ID ready.
            </p>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-accent shrink-0" />
                <span>support@pillowala.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-accent shrink-0" />
                <span>+91 98765 43210 (Mon-Sat, 10am-7pm)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <span>Pillowala Sleep Labs, Industrial Area Phase II, Gurugram, Haryana - 122002</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-700 text-xs text-stone-400">
              ⚡ For instant order tracking or replacement, you can also use your Amazon or Flipkart order panel.
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-soft">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-bold text-stone-900 text-lg">Message Received!</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Thank you for reaching out. Our support team will review your order details and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Marketplace</label>
                    <select
                      value={form.marketplace}
                      onChange={(e) => setForm({ ...form, marketplace: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500"
                    >
                      <option value="amazon">Amazon India</option>
                      <option value="flipkart">Flipkart</option>
                      <option value="meesho">Meesho</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Order ID (from marketplace invoice)</label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                    placeholder="e.g. 402-1234567-8901234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we assist you with your pillow or sleep comfort?"
                    className="w-full p-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand-charcoal hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Send size={14} />
                  <span>Send Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
