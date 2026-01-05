import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="Clock" size={24} className="text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {recentlyViewed.length} {recentlyViewed.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
        {recentlyViewed.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Link
              to={`/products-catalog/${product._id}`}
              className="flex-shrink-0 w-[200px] bg-white rounded-xl border border-gray-100 p-3 hover:shadow-lg transition-all duration-300 group block"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;
