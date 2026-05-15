import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';
import { renderSection, resolveStyle } from './sectionStyles';

const SectionSkeleton = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <div className="h-8 w-48 bg-slate-200 rounded-lg animate-shimmer mb-4" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-100 animate-shimmer" />
      ))}
    </div>
  </div>
);

/**
 * Fetches all active sections + products, matches products to each section,
 * filters out sections with too few products, then dispatches each one to its
 * dedicated style renderer in sectionStyles/index.jsx.
 *
 * The backend respects each section's `maxProducts`, and each renderer further
 * trims to a sensible visual cap (12 for grids, 6 for top-picks, etc.).
 */
const DynamicSections = () => {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([apiService.getSections(), apiService.getProducts({ limit: 200 })])
      .then(([secRes, prodRes]) => {
        if (!mounted) return;
        setSections(secRes?.data?.sections || []);
        setProducts(prodRes?.data?.products || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <>
        <SectionSkeleton />
        <SectionSkeleton />
      </>
    );
  }

  const MIN_PRODUCTS = 4;
  const MAX_SECTIONS = 8;

  // For each backend section: prefer products already attached server-side
  // (populated `products[]`); fall back to filtering the global product list.
  const sectionList = sections
    .filter((s) => s.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map((section) => {
      const populated = Array.isArray(section.products) ? section.products : [];
      const usable = populated.length
        ? populated
        : products.filter(
            (p) =>
              Array.isArray(p.sections) &&
              p.sections.some(
                (s) =>
                  (s?._id?.toString?.() || s?.toString?.()) === section._id?.toString()
              )
          );
      return { section, products: usable };
    })
    .filter(({ products: ps }) => ps.length >= MIN_PRODUCTS)
    .slice(0, MAX_SECTIONS);

  if (!sectionList.length) return null;

  // Visual variety: if two consecutive sections happen to use the same style,
  // shift the second one to a complementary fallback so the page never has
  // two identical layouts back-to-back.
  const VARIETY_FALLBACK = {
    MultiColumnGrid: 'DualRowCarousel',
    DualRowCarousel: 'MultiColumnGrid',
    HorizontalScroll: 'MultiColumnGrid',
    CompactGrid: 'MultiColumnGrid',
  };
  const adjusted = sectionList.map((entry, idx, arr) => {
    if (idx === 0) return entry;
    const prevStyle = resolveStyle(arr[idx - 1].section.style);
    const curStyle = resolveStyle(entry.section.style);
    if (prevStyle === curStyle && VARIETY_FALLBACK[curStyle]) {
      return {
        ...entry,
        section: { ...entry.section, style: VARIETY_FALLBACK[curStyle] },
      };
    }
    return entry;
  });

  return (
    <div className="space-y-1">
      {adjusted.map(({ section, products: items }) => (
        <motion.div
          key={section._id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          {renderSection(section, items)}
        </motion.div>
      ))}
    </div>
  );
};

export default DynamicSections;
