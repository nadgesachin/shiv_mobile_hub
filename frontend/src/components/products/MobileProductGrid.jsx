import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';

// Reusable compact product card
const CompactProductCard = ({ product, onAddToCart }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Format price to Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && (
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  );
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="relative h-full"
    >
      <Link to={`/product/${product._id}`} className="block h-full">
        <div className="rounded-lg overflow-hidden bg-white shadow-sm h-full flex flex-col">
          {/* Product image with loading state */}
          <div className="relative pt-[100%]"> {/* 1:1 aspect ratio */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
            )}
            
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                  {discountPercentage}% OFF
                </span>
              )}
              
              {product.badge && (
                <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                  {product.badge}
                </span>
              )}
            </div>
            
            {/* Quick add button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product._id);
              }}
            >
              <Icon name="Plus" size={16} className="text-primary" />
            </motion.button>
          </div>
          
          {/* Product info */}
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="text-sm font-medium mb-0.5 truncate">{product.name}</h3>
            
            {/* Price */}
            <div className="flex items-baseline mb-1">
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-1 text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center mt-auto">
              <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                <span className="text-xs font-bold text-green-700 mr-0.5">{product.rating || 4.3}</span>
                <Icon name="Star" size={10} className="text-green-700 fill-green-700" />
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount || 43})
              </span>
              
              {/* Availability tag */}
              {product.stockStatus === 'low' ? (
                <span className="ml-auto text-2xs text-orange-600 font-medium">
                  Few left
                </span>
              ) : product.stockStatus === 'out' ? (
                <span className="ml-auto text-2xs text-red-600 font-medium">
                  Out of stock
                </span>
              ) : (
                <span className="ml-auto text-2xs text-green-600 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-0.5"></span>
                  In stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Main product grid component
const MobileProductGrid = ({ products, title, viewAllUrl, loading = false }) => {
  // Mock function for adding to cart
  const handleAddToCart = (productId) => {
    console.log(`Added product ${productId} to cart`);
    // Implement actual cart functionality here
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="mb-6">
        <div className="px-3 mb-2 flex justify-between items-center">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="px-3 grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="pt-[100%] relative bg-gray-200 animate-pulse"></div>
              <div className="p-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <Link to={viewAllUrl} className="text-xs font-medium text-primary flex items-center">
          View all
          <Icon name="ChevronRight" size={14} className="ml-0.5" />
        </Link>
      </div>
      
      <div className="px-3 grid grid-cols-2 gap-2">
        {products.map(product => (
          <CompactProductCard 
            key={product._id} 
            product={product} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </div>
    </div>
  );
};

export default MobileProductGrid;
