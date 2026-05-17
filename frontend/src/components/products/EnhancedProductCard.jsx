import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import LazyImage from '../ui/LazyImage';
import { ProductBadges } from './ProductBadge';

const EnhancedProductCard = ({ 
  product, 
  onEnquire,
  onQuickView,
  layout = 'grid' // 'grid' or 'list'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate discount percentage
  const getDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  // Generate smart badges
  const getBadges = () => {
    const badges = [];
    const discount = getDiscount();
    
    if (discount > 0) {
      badges.push({ type: 'discount', text: `${discount}% OFF` });
    }
    
    if (product.isNew) {
      badges.push({ type: 'new' });
    }
    
    if (product.isBestseller) {
      badges.push({ type: 'bestseller' });
    }
    
    if (product.stock && product.stock < 10 && product.stock > 0) {
      badges.push({ type: 'limited', text: `Only ${product.stock} left` });
    }
    
    return badges.slice(0, 2);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Grid Layout Card
  if (layout === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Link to={`/products-catalog/${product._id || product.id}`}>
            <LazyImage
              src={product.image || product.images?.[0]?.url}
              alt={product.name || product.title}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          </Link>

          {/* Badges */}
          <ProductBadges badges={getBadges()} position="top-left" />

          {/* Quick Actions - Show on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity"
          >
            <button
              onClick={() => onQuickView?.(product)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110"
              aria-label="Quick View"
            >
              <Icon name="Eye" size={18} />
            </button>
            <button
              onClick={() => onEnquire?.(product)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110"
              aria-label="Enquire"
            >
              <Icon name="MessageSquare" size={18} />
            </button>
            <Link
              to={`/products-catalog/${product._id || product.id}`}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110"
              aria-label="View Details"
            >
              <Icon name="ArrowRight" size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {product.category.name || product.category}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
            <Link 
              to={`/products-catalog/${product._id || product.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.name || product.title}
            </Link>
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Enquiry Button */}
          <button
            onClick={() => onEnquire?.(product)}
            className="w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Icon name="MessageSquare" size={16} className="inline mr-2" />
            Enquire Now
          </button>
        </div>
      </motion.div>
    );
  }

  // List Layout Card
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-48 h-48 bg-gray-50 flex-shrink-0">
          <Link to={`/products-catalog/${product._id || product.id}`}>
            <LazyImage
              src={product.image || product.images?.[0]?.url}
              alt={product.name || product.title}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          <ProductBadges badges={getBadges()} position="top-left" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {product.category.name || product.category}
              </p>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <Link 
                to={`/products-catalog/${product._id || product.id}`}
                className="hover:text-primary transition-colors"
              >
                {product.name || product.title}
              </Link>
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onQuickView?.(product)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-primary hover:text-white transition-all"
                aria-label="Quick View"
              >
                <Icon name="Eye" size={18} />
              </button>
              <button
                onClick={() => onEnquire?.(product)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-md transition-all"
              >
                Enquire
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedProductCard;
