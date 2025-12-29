import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import ShareProduct from './ShareProduct';
import ProductEnquiryModal from './ProductEnquiryModal';
import { getDiscountPercentage, formatIndianRupee } from '../../utils/helpers';
import { HoverScale, Interactive, ScaleIn, ShimmerLoader } from '../ui/animations';

const ProductCard = ({ product }) => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  if (!product) return null;

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';

  // Loading state for image
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle cart action with animation
  const handleCartAction = (e) => {
    e.preventDefault();
    setShowEnquiryModal(true);
  };
  
  return (
    <>
      <HoverScale scale={1.02}>
        <motion.div 
          className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Product Image Container */}
          <Link to={`/products/${product._id}`} className="relative overflow-hidden aspect-square bg-gray-50">
            {!imageLoaded && (
              <div className="absolute inset-0">
                <ShimmerLoader className="w-full h-full" />
              </div>
            )}
            <motion.img
              src={imageUrl}
              alt={product.images?.[0]?.alt || product.name}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            />

            {/* Quick actions overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 px-4 opacity-0"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-xl w-full py-3 flex justify-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Interactive>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }} 
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center"
                    aria-label="Add to wishlist"
                  >
                    <Icon name="Heart" size={18} className="text-accent" />
                  </button>
                </Interactive>
                <Interactive>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowEnquiryModal(true);
                    }} 
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center"
                    aria-label="Quick view"
                  >
                    <Icon name="Eye" size={18} className="text-secondary" />
                  </button>
                </Interactive>
                <Interactive>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }} 
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center"
                    aria-label="Compare"
                  >
                    <Icon name="BarChart2" size={18} className="text-primary" />
                  </button>
                </Interactive>
              </motion.div>
            </motion.div>

            {/* Badges Container */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {/* Premium Badge */}
                {product.badge && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-md">
                      {product.badge}
                    </span>
                  </motion.div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <div className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-accent to-accent-light text-white shadow-md">
                      {discount}% OFF
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex flex-col flex-1 p-5 relative">
            {/* Product Category - Small tag */}
            <div className="mb-2">
              <span className="text-xs font-medium text-secondary">
                {product.category?.name || 'Mobile'}
              </span>
            </div>
            
            {/* Product Title */}
            <Link to={`/products/${product._id}`}>
              <h3 className="font-headline font-semibold text-base sm:text-lg line-clamp-2 text-foreground hover:text-secondary transition-colors duration-300">
                {product.name}
              </h3>
            </Link>

            {/* Rating Section */}
            {product.rating && (
              <div className="flex items-center gap-2 my-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : i < product.rating
                          ? 'text-amber-400 fill-amber-400 opacity-60'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Product Description - Hidden on small screens */}
            <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {product.description.substring(0, 80)}
              {product.description.length > 80 ? '...' : ''}
            </p>

            <div className="mt-auto pt-4">
              {/* Price Section */}
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-lg sm:text-xl font-headline font-bold text-foreground">
                    {formatIndianRupee(product.price)}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-xs text-muted-foreground line-through">
                      {formatIndianRupee(product.originalPrice)}
                    </div>
                  )}
                </div>
                
                {/* Stock Status - Simplified */}
                <div>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs ${product.stockStatus === 'in-stock' ? 'text-emerald-600' : product.stockStatus === 'low-stock' ? 'text-amber-600' : 'text-red-600'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${product.stockStatus === 'in-stock' ? 'bg-emerald-500' : product.stockStatus === 'low-stock' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span>
                      {product.stockStatus === 'in-stock'
                        ? 'In Stock'
                        : product.stockStatus === 'low-stock'
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Interactive>
                  <ShareProduct product={product} />
                </Interactive>
                
                <Interactive>
                  <button
                    onClick={handleCartAction}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>Enquire Now</span>
                  </button>
                </Interactive>
              </div>
            </div>
          </div>
        </motion.div>
      </HoverScale>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiryModal && (
          <ProductEnquiryModal
            product={product}
            onClose={() => setShowEnquiryModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
