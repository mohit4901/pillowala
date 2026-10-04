import React, { useState } from 'react';

export default function NewsletterBar() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <section className="bg-[#EAEAEA] border-y border-stone-300/70 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 text-center lg:text-left">
          {/* Left Text */}
          <span className="text-xs sm:text-sm font-semibold text-stone-700 shrink-0">
            Sign up for the latest news and deals
          </span>

          {/* Center Form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full max-w-md justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email address..."
              className="w-full bg-white border border-stone-300 px-3 sm:px-4 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#0066FF] rounded-l-none placeholder-stone-400 italic"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
            >
              {subscribed ? 'THANKS!' : 'SUBSCRIBE'}
            </button>
          </form>

          {/* Right Social Media Icons matching Brooklinen reference */}
          <div className="flex items-center gap-1.5 shrink-0 text-stone-600">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-stone-300 flex items-center justify-center text-xs font-bold hover:text-[#0066FF] hover:border-[#0066FF] transition-colors"
              aria-label="Facebook"
            >
              f
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-stone-300 flex items-center justify-center text-xs font-bold hover:text-[#0066FF] hover:border-[#0066FF] transition-colors"
              aria-label="Twitter"
            >
              t
            </a>
            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-stone-300 flex items-center justify-center text-xs font-bold hover:text-[#0066FF] hover:border-[#0066FF] transition-colors"
              aria-label="Pinterest"
            >
              p
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-stone-300 flex items-center justify-center text-xs font-bold hover:text-[#0066FF] hover:border-[#0066FF] transition-colors"
              aria-label="Instagram"
            >
              ig
            </a>
            {/* Tumblr / Blog */}
            <a
              href="https://pillowala.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-white border border-stone-300 flex items-center justify-center text-xs font-bold hover:text-[#0066FF] hover:border-[#0066FF] transition-colors"
              aria-label="Tumblr"
            >
              t
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
