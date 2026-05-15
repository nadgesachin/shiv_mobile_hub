import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import CompactProductCard from '../../../../components/ui/cards/CompactProductCard';
import ModernProductCard from '../../../../components/ui/cards/ModernProductCard';
import HorizontalScrollSection from '../../../../components/ui/HorizontalScrollSection';
import SectionHeader from './SectionHeader';

/* ──────────────────────────────────────────────────────────────────────
   STYLE METADATA — exported for admin form (label, description, preview).
   The order here is the order shown in the admin dropdown.
   ──────────────────────────────────────────────────────────────────── */
export const STYLE_CATALOG = [
  {
    value: 'MultiColumnGrid',
    label: 'Multi-Column Grid (dense)',
    description: 'Up to 12 products visible in a 2–6 column grid. Best for trending & deals.',
    accent: 'from-fuchsia-500 to-pink-500',
    icon: 'TrendingUp',
    minProducts: 4,
    suggestedMax: 12,
  },
  {
    value: 'CompactGrid',
    label: 'Compact Grid (ultra-dense)',
    description: 'Up to 16 products in a tight grid. Great for "More to explore".',
    accent: 'from-slate-600 to-slate-800',
    icon: 'Grid',
    minProducts: 6,
    suggestedMax: 16,
  },
  {
    value: 'DualRowCarousel',
    label: 'Dual-Row Carousel',
    description: 'Two horizontal rows of products. Fits 10+ items without scrolling far.',
    accent: 'from-cyan-500 to-blue-500',
    icon: 'Layers',
    minProducts: 8,
    suggestedMax: 16,
  },
  {
    value: 'HeroBannerGrid',
    label: 'Hero Banner + Grid',
    description: 'Big promotional banner on left + 4–6 product tiles on right.',
    accent: 'from-purple-500 to-indigo-600',
    icon: 'Megaphone',
    minProducts: 4,
    suggestedMax: 8,
  },
  {
    value: 'DealOfTheDay',
    label: 'Deal of the Day',
    description: 'Featured big product with countdown + side rail of related deals.',
    accent: 'from-orange-500 to-rose-600',
    icon: 'Zap',
    minProducts: 5,
    suggestedMax: 8,
  },
  {
    value: 'TopPicks',
    label: 'Top Picks (numbered)',
    description: 'Numbered 1–6 ranking of products. Use for "Top 6 phones".',
    accent: 'from-amber-500 to-orange-500',
    icon: 'Crown',
    minProducts: 3,
    suggestedMax: 6,
  },
  {
    value: 'BrandShowcase',
    label: 'Brand Showcase',
    description: 'Groups products by brand into columns. Best when products span many brands.',
    accent: 'from-indigo-500 to-blue-600',
    icon: 'Sparkles',
    minProducts: 6,
    suggestedMax: 12,
  },
  {
    value: 'FlashSale',
    label: 'Flash Sale (countdown + grid)',
    description: 'Countdown banner + dense grid with "Hurry, few left" progress bars.',
    accent: 'from-red-500 to-pink-600',
    icon: 'Flame',
    minProducts: 6,
    suggestedMax: 12,
  },
  {
    value: 'HorizontalScroll',
    label: 'Horizontal Scroll (default)',
    description: 'Classic single-row carousel. Safe default for any category.',
    accent: 'from-violet-500 to-purple-500',
    icon: 'ArrowRight',
    minProducts: 4,
    suggestedMax: 16,
  },
  {
    value: 'MegaBanner',
    label: 'Mega Banner Header + Grid',
    description: 'Full-width gradient banner as title, then product grid below.',
    accent: 'from-emerald-500 to-teal-600',
    icon: 'Award',
    minProducts: 4,
    suggestedMax: 12,
  },
];

// Legacy enum values map onto the closest new style so old sections keep working.
const LEGACY_TO_NEW = {
  DailyDeals: 'DealOfTheDay',
  TrendingProducts: 'MultiColumnGrid',
  BestsellingProducts: 'TopPicks',
  LowPriceProducts: 'CompactGrid',
  LiveShopBanner: 'HeroBannerGrid',
  TopOffers: 'FlashSale',
  BrandDhamaka: 'BrandShowcase',
  ForYouProductSection: 'DualRowCarousel',
  CategoryGrid: 'MultiColumnGrid',
};

export const resolveStyle = (raw) => LEGACY_TO_NEW[raw] || raw || 'HorizontalScroll';
export const themeFor = (raw) => {
  const v = resolveStyle(raw);
  return STYLE_CATALOG.find((s) => s.value === v) || STYLE_CATALOG[0];
};

/* ──────────────────────────────────────────────────────────────────────
   Shared utilities
   ──────────────────────────────────────────────────────────────────── */
const useCountdown = (msUntil) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, msUntil - now);
  const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const nextMidnight = () => {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
};

const viewAllHref = (section) =>
  `/products-catalog?section=${encodeURIComponent(section?.name || '')}`;

/* ──────────────────────────────────────────────────────────────────────
   STYLE RENDERERS
   ──────────────────────────────────────────────────────────────────── */

// 1. Multi-column grid — dense, up to 12 products visible
const MultiColumnGrid = ({ section, products, theme }) => (
  <section className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title={section.title}
        subtitle={section.subtitle}
        icon={section.icon || theme.icon}
        accent={theme.accent}
        viewAllHref={viewAllHref(section)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((p, i) => (
          <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="md" />
        ))}
      </div>
    </div>
  </section>
);

// 2. Compact grid — ultra dense, up to 16 products
const CompactGrid = ({ section, products, theme }) => (
  <section className="px-4 sm:px-6 lg:px-8 py-6 bg-slate-50/50">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title={section.title}
        subtitle={section.subtitle || 'More to explore'}
        icon={section.icon || theme.icon}
        accent={theme.accent}
        viewAllHref={viewAllHref(section)}
        compact
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
        {products.slice(0, 16).map((p, i) => (
          <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="sm" />
        ))}
      </div>
    </div>
  </section>
);

// 3. Dual-row carousel — two stacked horizontal rows
const DualRowCarousel = ({ section, products, theme }) => {
  const half = Math.ceil(products.length / 2);
  const row1 = products.slice(0, half);
  const row2 = products.slice(half);
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon || theme.icon}
          accent={theme.accent}
          viewAllHref={viewAllHref(section)}
        />
        <div className="space-y-3">
          {[row1, row2].map((row, ri) =>
            row.length ? (
              <div key={ri} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {row.map((p, i) => (
                  <div
                    key={p._id || p.id || i}
                    className="flex-shrink-0 w-44 sm:w-56 snap-start"
                  >
                    <CompactProductCard product={p} index={i} size="md" />
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

// 4. Hero banner + grid
const HeroBannerGrid = ({ section, products, theme }) => {
  const [hero, ...rest] = products;
  if (!hero) return null;
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon || theme.icon}
          accent={theme.accent}
          viewAllHref={viewAllHref(section)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Hero card */}
          <Link
            to={`/products/${hero._id || hero.id}`}
            className={`relative lg:col-span-5 rounded-3xl overflow-hidden bg-gradient-to-br ${theme.accent} text-white min-h-[360px] group`}
          >
            <img
              src={hero.images?.[0]?.url || hero.image}
              alt={hero.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-widest opacity-90">Featured</span>
              <h3 className="text-3xl sm:text-4xl font-bold mt-2 max-w-md">{hero.name}</h3>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-bold">₹{Number(hero.price || 0).toLocaleString('en-IN')}</span>
                {hero.originalPrice > hero.price && (
                  <span className="line-through opacity-70">
                    ₹{Number(hero.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold w-fit group-hover:gap-3 transition-all">
                Shop now <Icon name="ArrowRight" size={16} />
              </span>
            </div>
          </Link>
          {/* Product tiles */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rest.slice(0, 6).map((p, i) => (
              <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="md" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. Deal of the Day — featured product + side rail
const DealOfTheDay = ({ section, products, theme }) => {
  const countdown = useCountdown(nextMidnight());
  const [feature, ...rest] = products;
  if (!feature) return null;
  const discount =
    feature.originalPrice > feature.price
      ? Math.round(((feature.originalPrice - feature.price) / feature.originalPrice) * 100)
      : 0;
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={section.title || 'Deal of the Day'}
          subtitle={section.subtitle || 'Best price guaranteed — ends at midnight'}
          icon={section.icon || theme.icon}
          accent={theme.accent}
          viewAllHref={viewAllHref(section)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Featured deal card */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 border border-orange-200">
            <div className="absolute top-4 right-4 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              ⚡ {discount}% OFF
            </div>
            <Link to={`/products/${feature._id || feature.id}`} className="block">
              <div className="aspect-[4/3] sm:aspect-[5/3] overflow-hidden bg-white">
                <img
                  src={feature.images?.[0]?.url || feature.image}
                  alt={feature.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {feature.brand}
                </div>
                <h3 className="text-xl font-bold text-foreground line-clamp-2 mt-1">
                  {feature.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{Number(feature.price || 0).toLocaleString('en-IN')}
                  </span>
                  {feature.originalPrice > feature.price && (
                    <span className="text-sm line-through text-muted-foreground">
                      ₹{Number(feature.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={14} className="text-orange-500" />
                  Ends in
                  <span className="font-mono font-bold text-orange-600 tabular-nums">
                    {countdown}
                  </span>
                </div>
              </div>
            </Link>
          </div>
          {/* Side rail */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rest.slice(0, 8).map((p, i) => (
              <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 6. Top Picks — numbered ranking
const TopPicks = ({ section, products, theme }) => (
  <section className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title={section.title}
        subtitle={section.subtitle || 'Our editor’s top picks'}
        icon={section.icon || theme.icon}
        accent={theme.accent}
        viewAllHref={viewAllHref(section)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 6).map((p, i) => (
          <motion.div
            key={p._id || p.id || i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              to={`/products/${p._id || p.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-3 border border-gray-100 hover:border-gray-300 hover:shadow-medium transition-all"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${theme.accent} text-white text-2xl font-black flex items-center justify-center shadow-md`}
              >
                {i + 1}
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 overflow-hidden">
                <img
                  src={p.images?.[0]?.url || p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.brand}
                </div>
                <div className="font-semibold text-foreground line-clamp-2 text-sm">
                  {p.name}
                </div>
                <div className="font-bold text-foreground mt-1">
                  ₹{Number(p.price || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// 7. Brand showcase — grouped by brand
const BrandShowcase = ({ section, products, theme }) => {
  // Group products by brand, keep up to 3 brands, 4 products each
  const groups = {};
  products.forEach((p) => {
    const b = p.brand || 'Other';
    if (!groups[b]) groups[b] = [];
    if (groups[b].length < 4) groups[b].push(p);
  });
  const brands = Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);
  if (!brands.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle || 'Top brands you love'}
          icon={section.icon || theme.icon}
          accent={theme.accent}
          viewAllHref={viewAllHref(section)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map(([brand, items]) => (
            <div
              key={brand}
              className="rounded-3xl bg-white border border-gray-100 p-5 hover:shadow-medium transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline text-xl font-bold text-foreground">
                  {brand}
                </h3>
                <Link
                  to={`/products-catalog?brand=${encodeURIComponent(brand)}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Shop all →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {items.map((p, i) => (
                  <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8. Flash Sale — countdown banner + grid with progress
const FlashSale = ({ section, products, theme }) => {
  const countdown = useCountdown(nextMidnight());
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white p-5 sm:p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Icon name="Flame" size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {section.title || 'Flash Sale Live'}
                </h2>
                <p className="text-sm text-white/85">
                  {section.subtitle || 'Limited stock at the lowest prices'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ends in</span>
              <span className="px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-lg font-mono text-lg font-bold tabular-nums">
                {countdown}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {products.slice(0, 12).map((p, i) => {
            const sold = 40 + ((i * 7) % 50); // pseudo stock bar
            return (
              <div key={p._id || p.id || i} className="flex flex-col">
                <CompactProductCard product={p} index={i} size="md" />
                <div className="mt-1 px-1">
                  <div className="h-1 rounded-full bg-rose-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                      style={{ width: `${sold}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {sold}% sold · Hurry!
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 9. Horizontal Scroll — default carousel using ModernProductCard
const HorizontalScroll = ({ section, products, theme }) => (
  <section className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title={section.title}
        subtitle={section.subtitle}
        icon={section.icon || theme.icon}
        accent={theme.accent}
        viewAllHref={viewAllHref(section)}
      />
      <HorizontalScrollSection title="" showArrows gradient={theme.accent}>
        {products.slice(0, section.maxProducts || 12).map((p, i) => (
          <div key={p._id || p.id || i} className="flex-shrink-0 w-60 sm:w-64 snap-start">
            <ModernProductCard
              product={{
                ...p,
                image: p.images?.[0]?.url || p.image,
              }}
              index={i}
            />
          </div>
        ))}
      </HorizontalScrollSection>
    </div>
  </section>
);

// 10. Mega banner — gradient title bar + product grid
const MegaBanner = ({ section, products, theme }) => (
  <section className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.accent} text-white p-6 sm:p-10 mb-5`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest opacity-90">
              {section.subtitle || 'Featured collection'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-2 max-w-2xl">
              {section.title}
            </h2>
          </div>
          <Link
            to={viewAllHref(section)}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:gap-3 transition-all"
          >
            Explore all <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {products.slice(0, 12).map((p, i) => (
          <CompactProductCard key={p._id || p.id || i} product={p} index={i} size="md" />
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────
   Registry — dispatches a `section + products` into the right renderer.
   ──────────────────────────────────────────────────────────────────── */
const RENDERERS = {
  MultiColumnGrid,
  CompactGrid,
  DualRowCarousel,
  HeroBannerGrid,
  DealOfTheDay,
  TopPicks,
  BrandShowcase,
  FlashSale,
  HorizontalScroll,
  MegaBanner,
};

export const renderSection = (section, products) => {
  const styleKey = resolveStyle(section?.style);
  const Cmp = RENDERERS[styleKey] || HorizontalScroll;
  const theme = themeFor(section?.style);
  return <Cmp section={section} products={products} theme={theme} />;
};

export default renderSection;
