import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';
import ProductEnquiryModal from '../../../../components/products/ProductEnquiryModal';
import ProductPreviewModal from '../../../../components/admin/ProductPreviewModal';
import apiService from '../../../../services/api';
import Toast from '../../../../components/ui/Toast';

const TopOffers = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🎯 {section.title}
      </h2>
      <MobileSwipe
        onSwipeLeft={() => setCurrentIndex(Math.min(currentIndex + 1, products.length - 1))}
        onSwipeRight={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
        className="touch-pan-y"
      >
        <div className="flex gap-4 w-max overflow-x-auto pb-4 no-scrollbar">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="w-[280px] sm:w-[320px] flex-shrink-0 bg-white rounded-xl shadow-sm p-4 relative 
               hover:shadow-lg transition-all duration-300 
               border border-gray-100 group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="cursor-pointer" onClick={() => handleProductClick(product._id || product.id)}>
                {/* DISCOUNT BADGE */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                  </div>
                )}

                {/* TIMER (optional static) */}
                <div className="absolute top-2 right-2 text-[10px] 
                      bg-yellow-400 text-black px-2 py-0.5 
                      rounded font-semibold">
                  ⏳ 02h 30m
                </div>

                {/* IMAGE */}
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain 
                     group-hover:scale-110 
                     transition-transform duration-300"
                  />
                </div>

                {/* TITLE (ellipsis guaranteed) */}
                <p
                  title={product.title}
                  className="mt-2 text-sm font-medium text-gray-800 
                   truncate group-hover:text-primary 
                   transition-colors"
                >
                  {product.title}
                </p>

                {/* RATING */}
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-400">
                    ({product.reviewCount || 0})
                  </span>
                </p>

                {/* PRICE */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="line-through text-[10px] text-gray-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* CONTACT TO BUY */}
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white 
                  py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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

      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopOffers;
