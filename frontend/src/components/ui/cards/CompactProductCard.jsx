import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../AppIcon';

/**
 * Dense product tile used in grid-heavy section styles (MultiColumnGrid,
 * CompactGrid, HeroBannerGrid). Trades hover flourishes for compactness so
 * many products fit in a viewport.
 */
const CompactProductCard = ({ product, index = 0, size = 'md' }) => {
  const id = product?._id || product?.id;
  const image =
    product?.image ||
    product?.images?.[0]?.url ||
    'https://via.placeholder.com/300x300?text=Product';
  const price = Number(product?.price || 0);
  const original = Number(product?.originalPrice || 0);
  const discount =
    original > price ? Math.round(((original - price) / original) * 100) : 0;

  const sizes = {
    sm: { img: 'aspect-[4/5]', title: 'text-xs', price: 'text-sm', pad: 'p-2' },
    md: { img: 'aspect-square', title: 'text-sm', price: 'text-base', pad: 'p-3' },
    lg: { img: 'aspect-square', title: 'text-sm sm:text-base', price: 'text-lg', pad: 'p-3 sm:p-4' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to={`/products/${id}`}
        className="block bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-medium transition-all overflow-hidden h-full"
      >
        <div className={`relative ${s.img} bg-slate-50 overflow-hidden`}>
          <img
            src={image}
            alt={product?.name || 'Product'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/300x300?text=No+image';
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
          {product?.badge && (
            <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5 rounded-full text-foreground/80 shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
        <div className={s.pad}>
          {product?.brand && (
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground line-clamp-1">
              {product.brand}
            </div>
          )}
          <div className={`font-medium text-foreground line-clamp-2 mt-0.5 ${s.title}`}>
            {product?.name || 'Product'}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className={`font-bold text-foreground ${s.price}`}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            {original > price && (
              <span className="text-xs line-through text-muted-foreground">
                ₹{original.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {(product?.rating || product?.reviewCount) && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                <Icon name="Star" size={10} className="fill-current" />
                {product?.rating?.toFixed?.(1) || 4.3}
              </span>
              {product?.reviewCount ? (
                <span>({product.reviewCount})</span>
              ) : null}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default CompactProductCard;
