import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import apiService from '../../../services/api';

const FALLBACK_HERO = {
  title: 'iPhone 15 Pro Max',
  subtitle: 'Titanium. Tougher. Lighter. Pro.',
  cta: 'Explore',
  link: '/products-catalog',
  imageUrl:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1280&q=80',
};

const useCountdown = (targetMs) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const BentoHero = () => {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  // Flash deal: next midnight
  const midnight = (() => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  })();
  const countdown = useCountdown(midnight);

  useEffect(() => {
    let mounted = true;
    apiService
      .getBanners({ type: 'Banner' })
      .then((res) => {
        if (!mounted) return;
        const items =
          (res?.data?.banners || res?.data || [])
            .filter((b) => b.imageUrl || b.videoUrl)
            .map((b) => ({
              title: b.title,
              subtitle: b.subtitle || '',
              imageUrl: b.imageUrl,
              videoUrl: b.videoUrl,
              link: b.link || '/products-catalog',
              cta: b.cta || 'Shop now',
            }));
        setSlides(items.length ? items : [FALLBACK_HERO]);
      })
      .catch(() => setSlides([FALLBACK_HERO]))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[active] || FALLBACK_HERO;

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 grid-rows-[auto] gap-3 sm:gap-4">
        {/* === Big featured tile === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[420px] sm:min-h-[520px] group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {slide.videoUrl ? (
                <video
                  src={slide.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
            <motion.div
              key={`text-${active}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium uppercase tracking-wider mb-4">
                <Icon name="Sparkles" size={14} /> Featured today
              </span>
              <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-3 text-sm sm:text-lg text-white/80 max-w-xl">
                  {slide.subtitle}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={slide.link}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 sm:px-7 py-3 rounded-full font-semibold hover:bg-slate-100 hover:gap-3 transition-all"
                >
                  {slide.cta || 'Shop now'}
                  <Icon name="ArrowRight" size={18} />
                </Link>
                <Link
                  to="/services-hub"
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full font-semibold border border-white/40 backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  Browse services
                </Link>
              </div>
            </motion.div>

            {/* Slide dots */}
            {slides.length > 1 && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* === Live stats tile === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="md:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white p-6 min-h-[200px]"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Live
          </span>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold">12,840+</div>
              <div className="text-xs text-white/80 mt-1">Customers served</div>
            </div>
            <div>
              <div className="text-3xl font-bold">25K+</div>
              <div className="text-xs text-white/80 mt-1">Repairs done</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-xs text-white/80 mt-1">Rated by users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2 hr</div>
              <div className="text-xs text-white/80 mt-1">Avg. repair time</div>
            </div>
          </div>
        </motion.div>

        {/* === Flash deal tile === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-rose-600 text-white p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/90">
                <Icon name="Zap" size={14} /> Flash deal
              </span>
              <div className="mt-3 text-4xl font-extrabold">Up to 60% off</div>
              <p className="text-sm text-white/90 mt-1">Top phones &amp; accessories</p>
            </div>
            <Icon name="Flame" size={36} className="opacity-40" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="font-mono text-2xl tracking-wider tabular-nums">{countdown}</div>
            <Link
              to="/products-catalog?sort=discount"
              className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Shop deals <Icon name="ArrowRight" size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoHero;
