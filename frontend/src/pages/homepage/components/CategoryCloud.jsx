import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';
import FloatingCategoryCard from '../../../components/ui/cards/FloatingCategoryCard';
import Icon from '../../../components/AppIcon';

const CategoryCloud = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiService
      .getCategories()
      .then((res) => {
        if (!mounted) return;
        const list = (res?.data || [])
          .filter((c) => c.isActive)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((c) => ({
            id: c._id,
            name: c.name,
            icon: c.icon || 'Grid',
            image: c.image,
            link:
              c.type === 'service'
                ? `/services-hub/${c.slug}`
                : `/products-catalog?category=${c.slug}`,
          }));
        setCategories(list);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && !categories.length) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Icon name="Grid" size={12} /> Browse
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Find it by category
            </h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
            {categories.slice(0, 12).map((cat, i) => (
              <FloatingCategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryCloud;
