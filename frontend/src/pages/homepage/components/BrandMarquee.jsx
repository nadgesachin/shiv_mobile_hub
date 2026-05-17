import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';

const FALLBACK_BRANDS = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Xiaomi',
  'Realme',
  'Vivo',
  'Oppo',
  'Google',
  'Nothing',
  'iQOO',
  'Motorola',
  'Asus',
];

const BrandMarquee = () => {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);

  useEffect(() => {
    let mounted = true;
    apiService
      .getProducts({ limit: 200 })
      .then((res) => {
        if (!mounted) return;
        const list = res?.data?.products || res?.data || [];
        const uniq = Array.from(
          new Set(list.map((p) => p.brand).filter(Boolean))
        ).slice(0, 14);
        if (uniq.length >= 4) setBrands(uniq);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Duplicate the array for seamless infinite scroll
  const items = [...brands, ...brands];

  return (
    <section className="w-full py-6 border-y border-gray-100 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Trusted brands we stock &amp; service
          </span>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex gap-10 sm:gap-14 whitespace-nowrap will-change-transform"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {items.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="flex items-center text-2xl sm:text-3xl font-headline font-bold text-slate-400 hover:text-slate-700 transition-colors select-none"
            >
              {b}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandMarquee;
