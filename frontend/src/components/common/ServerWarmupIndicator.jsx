import React, { useState, useEffect } from 'react';
import { CloudLightning, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ServerWarmupIndicator() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'warming' | 'ready'
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const pingUrl = rawApiUrl.replace(/\/+$/, '') + '/ping';

    let isMounted = true;
    let slowTimer = null;

    // Show warning only if backend takes > 1.8 seconds (Render cold start)
    slowTimer = setTimeout(() => {
      if (isMounted && status !== 'ready') {
        setStatus('warming');
        setVisible(true);
      }
    }, 1800);

    const checkServer = async (retries = 3) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(pingUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' },
        });
        clearTimeout(timeoutId);

        if (res.ok && isMounted) {
          clearTimeout(slowTimer);
          if (status === 'warming') {
            setStatus('ready');
            setTimeout(() => {
              if (isMounted) setVisible(false);
            }, 2500);
          } else {
            // Already fast, don't show any notification
            setStatus('ready');
            setVisible(false);
          }
        } else if (retries > 0 && isMounted) {
          setTimeout(() => checkServer(retries - 1), 2000);
        }
      } catch (err) {
        if (retries > 0 && isMounted) {
          setTimeout(() => checkServer(retries - 1), 2500);
        }
      }
    };

    checkServer();

    return () => {
      isMounted = false;
      clearTimeout(slowTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 transition-all duration-500 ease-out transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3 px-4 py-3 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-stone-800 text-xs sm:text-sm font-medium">
        {status === 'warming' ? (
          <>
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-amber-400 opacity-75"></span>
              <CloudLightning className="relative text-amber-400 animate-pulse" size={17} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-100">Warming up secure cloud server...</span>
              <span className="text-[11px] text-stone-400">Taking ~15-30s on first visit. Thank you for your patience!</span>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className="text-emerald-400" size={18} />
            <span className="font-semibold text-emerald-300">Server Connected & Ready!</span>
          </>
        )}
      </div>
    </div>
  );
}
