import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import { Interactive } from '../../../../components/ui/animations';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';
import ProductEnquiryModal from '../../../../components/products/ProductEnquiryModal';
import ProductPreviewModal from '../../../../components/admin/ProductPreviewModal';
import apiService from '../../../../services/api';
import Toast from '../../../../components/ui/Toast';
import { ProductBadges } from '../../../../components/products/ProductBadge';

const ProductCarousel = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  // Get badges for a product
  const getProductBadges = (product) => {
    const badges = [];
    
    // Discount badge
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = calculateDiscount(product.originalPrice, product.price);
      badges.push({ type: 'discount', text: `${discount}% OFF` });
    }
    
    // Check if product is new (created in last 7 days)
    if (product.createdAt) {
      const daysSinceCreation = Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCreation <= 7) {
        badges.push({ type: 'new' });
      }
    }
    
    // Bestseller badge based on sales
    if (product.salesCount && product.salesCount > 100) {
      badges.push({ type: 'bestseller' });
    }
    
    // Limited stock badge
    if (product.stock && product.stock < 10 && product.stock > 0) {
      badges.push({ type: 'limited', text: `Only ${product.stock} left` });
    }
    
    // Custom badge from product
    if (product.badgeText) {
      badges.push({ type: 'featured', text: product.badgeText });
    }
    
    return badges.slice(0, 2); // Show max 2 badges
  };

  // Fetch product details for preview
  const handleProductClick = async (productId) => {
    try {
      setLoading(true);
      const response = await apiService.request(`/products/${productId}`);
      
      if (response.success && response.data) {
        setPreviewProduct(response.data.product || response.data);
        setShowPreviewModal(true);
      } else {
        Toast.error('Failed to load product details');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      Toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleCarouselNavigation = (directionOrIndex) => {
    let newIndex;
    if (typeof directionOrIndex === 'string') {
      if (directionOrIndex === 'next') {
        newIndex = Math.min(currentIndex + 1, products.length - 1);
      } else {
        newIndex = Math.max(currentIndex - 1, 0);
      }
    } else {
      newIndex = directionOrIndex;
    }

    setCurrentIndex(newIndex);

    const container = sectionRef.current;
    if (container) {
      const card = container.children[newIndex];
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculateDiscount = (originalPrice, sellingPrice) => {
    if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) {
      return 0;
    }

    return Math.round(
      ((originalPrice - sellingPrice) / originalPrice) * 100
    );
  };

  return (
    <motion.div
      key={section._id}
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <Icon
              name={section.icon || 'ShoppingBag'}
              size={22}
              className="mr-2 text-secondary"
            />
            {section.title}
          </h3>
        </div>
        {products.length > 1 && (
          <div className="flex space-x-2">
            <Interactive>
              <button
                onClick={() => handleCarouselNavigation('prev')}
                disabled={currentIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm transition-all duration-300 ${currentIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md hover:-translate-y-1'
                  }`}
                aria-label="Previous"
              >
                <Icon name="ChevronLeft" size={20} className="text-primary" />
              </button>
            </Interactive>
            <Interactive>
              <button
                onClick={() => handleCarouselNavigation('next')}
                disabled={currentIndex === products.length - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm transition-all duration-300 ${currentIndex === products.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md hover:-translate-y-1'
                  }`}
                aria-label="Next"
              >
                <Icon name="ChevronRight" size={20} className="text-primary" />
              </button>
            </Interactive>
          </div>
        )}
      </div>
      <MobileSwipe
        onSwipeLeft={() => handleCarouselNavigation('next')}
        onSwipeRight={() => handleCarouselNavigation('prev')}
        onSwipeEnd={(index) => setCurrentIndex(index)}
        className="touch-pan-y"
      >
        <div
          className="flex space-x-5 overflow-x-auto hide-scrollbar pb-6 pt-2 px-1"
          ref={sectionRef}
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
              className="flex-none w-[280px] sm:w-[320px] group"
            >
              <Interactive>
                <div 
                  onClick={() => handleProductClick(product._id || product.id)}
                  className="card-premium h-full flex flex-col relative overflow-hidden rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain 
                         group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Soft overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Dynamic Product Badges */}
                      <ProductBadges badges={getProductBadges(product)} position="top-left" />
                    </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1">

                    {/* TITLE (ellipsis guaranteed) */}
                    <h3
                      title={product.title}
                      className="text-sm font-semibold text-gray-800 
                       truncate mb-2 group-hover:text-primary transition-colors"
                    >
                      {product.title}
                    </h3>

                    {/* PRICE */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* STOCK + RATING */}
                    <div className="mt-auto flex items-center justify-between text-xs">
                      <div className="flex items-center text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        In Stock
                      </div>

                      <div className="flex items-center">
                        <Icon name="Star" size={12} className="text-amber-400 fill-amber-400" />
                        <span className="ml-1 font-medium">4.8</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className="mt-4 w-full text-xs font-semibold text-white 
                       bg-gradient-to-r from-primary to-secondary 
                       py-2 rounded-xl hover:opacity-90 
                       active:scale-95 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Transform product data to match modal expectations
                        const productData = {
                          _id: product._id || product.id,
                          name: product.title || product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          description: product.description,
                          images: product.images || []
                        };
                        setSelectedProduct(productData);
                        setShowEnquiryModal(true);
                      }}
                    >
                      Contact to Buy
                    </button>

                  </div>
                </div>
              </Interactive>
            </motion.div>
          ))}

        </div>
      </MobileSwipe>
      
      {/* Preview Modal */}
      {showPreviewModal && previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewProduct(null);
          }}
        />
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && selectedProduct && (
        <ProductEnquiryModal
          product={selectedProduct}
          onClose={() => {
            setShowEnquiryModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading product...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCarousel;
