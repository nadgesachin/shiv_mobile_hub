import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../AppIcon';

// Base card component with touch-friendly ripple effect
const BaseCard = ({ children, className, onClick }) => {
  const [rippleStyle, setRippleStyle] = useState({ top: 0, left: 0, opacity: 0 });
  const [rippleVisible, setRippleVisible] = useState(false);
  
  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    setRippleStyle({
      top: y,
      left: x,
      opacity: 1
    });
    setRippleVisible(true);
    
    setTimeout(() => {
      setRippleVisible(false);
    }, 500);
  };
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white rounded-xl shadow-sm overflow-hidden ${className || ''}`}
      onClick={onClick}
      onTouchStart={handleTouch}
    >
      {children}
      
      {/* Touch ripple effect */}
      {rippleVisible && (
        <span
          className="absolute rounded-full bg-gray-200 animate-ripple pointer-events-none"
          style={{
            top: rippleStyle.top,
            left: rippleStyle.left,
            width: '150px',
            height: '150px',
            marginLeft: '-75px',
            marginTop: '-75px',
            opacity: rippleStyle.opacity,
          }}
        />
      )}
    </motion.div>
  );
};

// Category card (small, icon-focused)
export const CategoryCard = ({ category, size = "small" }) => {
  const sizes = {
    tiny: "w-16 h-16",
    small: "w-20 h-20",
    medium: "w-24 h-24"
  };

  return (
    <Link to={`/products-catalog?category=${category.id}`}>
      <BaseCard className={`flex flex-col items-center justify-center ${sizes[size]}`}>
        <div className={`flex items-center justify-center ${category.bgColor || 'bg-primary'} rounded-full mb-1`}
          style={{ width: size === 'tiny' ? '24px' : '32px', height: size === 'tiny' ? '24px' : '32px' }}
        >
          <Icon 
            name={category.icon} 
            size={size === 'tiny' ? 14 : 16} 
            color="#fff" 
          />
        </div>
        <span className={`text-center truncate w-full px-1 ${size === 'tiny' ? 'text-2xs' : 'text-xs'} font-medium`}>
          {category.name}
        </span>
      </BaseCard>
    </Link>
  );
};

// Product card (small, compact for grids)
export const ProductCardSmall = ({ product, onAddToCart }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Format price to Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Link to={`/product/${product._id}`}>
      <BaseCard className="h-full">
        {/* Image with aspect ratio */}
        <div className="relative pt-[100%]">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
          
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-1 left-1 bg-blue-500 text-white text-2xs px-1 py-0.5 rounded">
              {product.badge}
            </span>
          )}
          
          {/* Discount */}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-2xs px-1 py-0.5 rounded">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
          
          {/* Add to cart button */}
          <button
            className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            <Icon name="Plus" size={14} />
          </button>
        </div>
        
        {/* Info */}
        <div className="p-2">
          <h3 className="text-sm font-medium truncate">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
            
            <div className="flex items-center">
              <Icon name="Star" size={10} className="text-yellow-500 fill-yellow-500" />
              <span className="text-2xs ml-0.5">{product.rating || 4.5}</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </Link>
  );
};

// Product card (horizontal layout for lists)
export const ProductCardHorizontal = ({ product, onAddToCart }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Format price to Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Link to={`/product/${product._id}`}>
      <BaseCard className="flex h-28">
        {/* Image */}
        <div className="relative w-28 h-full flex-shrink-0">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
          
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-1 left-1 bg-blue-500 text-white text-2xs px-1 py-0.5 rounded">
              {product.badge}
            </span>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 p-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
            <div className="flex items-center mt-1">
              <Icon name="Star" size={10} className="text-yellow-500 fill-yellow-500" />
              <span className="text-2xs ml-0.5">{product.rating || 4.5}</span>
              <span className="text-2xs text-gray-500 ml-1">
                ({product.reviewCount || 43})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold block">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-2xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <button
              className="w-8 h-8 bg-primary text-white rounded-full shadow flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.(product);
              }}
            >
              <Icon name="ShoppingCart" size={14} />
            </button>
          </div>
        </div>
      </BaseCard>
    </Link>
  );
};

// Deal card (for promotions and offers)
export const DealCard = ({ deal }) => {
  return (
    <Link to={deal.link}>
      <BaseCard className={`p-3 h-24 bg-gradient-to-r ${deal.gradient || 'from-blue-500 to-purple-600'}`}>
        <div className="flex items-start h-full text-white">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase bg-white/20 px-1.5 py-0.5 rounded">
              {deal.tag || 'Limited Time'}
            </span>
            <h3 className="text-base font-bold mt-1">{deal.title}</h3>
            <p className="text-xs mt-0.5 opacity-90">{deal.description}</p>
          </div>
          
          <div className="ml-2 flex-shrink-0">
            <Icon name={deal.icon || 'Tag'} size={24} color="#fff" />
          </div>
        </div>
      </BaseCard>
    </Link>
  );
};

export default {
  BaseCard,
  CategoryCard,
  ProductCardSmall,
  ProductCardHorizontal,
  DealCard
};
