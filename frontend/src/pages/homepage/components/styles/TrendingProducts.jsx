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

const TrendingProducts = ({ section, products }) => {
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
    <div className="bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50 p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-gradient-premium font-bold mr-2">🔥</span>
        <span>{section.title}</span>
      </h2>

      <MobileSwipe
        onSwipeLeft={() => setCurrentIndex(Math.min(currentIndex + 1, products.length - 1))}
        onSwipeRight={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
        className="touch-pan-y"
      >
        <motion.div
          className="flex gap-4 w-max overflow-x-auto pb-4 no-scrollbar -mx-1 px-1"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="card-premium w-[280px] sm:w-[320px] flex-shrink-0 p-4 relative bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all"
            >
              <div onClick={() => handleProductClick(product._id || product.id)} className="cursor-pointer">
                {/* TRENDING BADGE */}
                <div className="absolute left-3 top-3
                    bg-gradient-to-r from-orange-500 to-purple-500 text-white 
                    text-[10px] px-3 py-0.5 rounded-full 
                    font-bold shadow-md z-10 
                    flex items-center gap-1">
                🔥 Trending
              </div>

              {/* IMAGE */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain 
                   transition-transform duration-300 
                   group-hover:scale-110"
                />
              </div>

              {/* TITLE (ellipsis guaranteed) */}
              <p
                title={product.title}
                className="text-sm font-medium text-gray-800 
                 truncate group-hover:text-primary 
                 transition-colors"
              >
                {product.title}
              </p>

              {/* RATING */}
              <div className="flex items-center bg-yellow-50 
                    rounded-lg py-0.5 px-2 w-fit">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-xs font-bold text-gray-700 ml-1">4.8</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount || 0})
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-blue-600 font-bold text-sm">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="line-through text-[10px] text-gray-400">
                      {formatPrice(product.originalPrice)}
                    </span>

                    <span className="text-[10px] font-semibold text-red-600">
                      {calculateDiscount(product.originalPrice, product.price)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

              {/* CTA */}
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white 
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

        </motion.div>
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

export default TrendingProducts;
