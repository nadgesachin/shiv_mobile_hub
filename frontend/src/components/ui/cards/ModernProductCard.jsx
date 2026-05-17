import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../AppIcon';

const ModernProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
        
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <motion.img
            src={product.image || product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                {discount}% OFF
              </motion.div>
            )}
            {product.badge && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                {product.badge}
              </motion.div>
            )}
            {product.isNew && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                NEW
              </motion.div>
            )}
          </div>
          
          {/* Quick Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-700 hover:bg-red-50'
                  }`}
                >
                  <Icon name="Heart" size={20} className={isLiked ? 'fill-white' : ''} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowQuickView(true);
                  }}
                  className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 hover:bg-purple-50 transition-all"
                >
                  <Icon name="Eye" size={20} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Icon name="ShoppingBag" size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-2">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </p>
          )}
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name || product.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={14}
                  className={i < Math.floor(product.rating || 4.5) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount || 128})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            </div>
          </div>
          
          {/* Hover Effect - View Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="mt-4"
          >
            <Link
              to={`/products/${product._id || product.id}`}
              className="block w-full text-center py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernProductCard;
