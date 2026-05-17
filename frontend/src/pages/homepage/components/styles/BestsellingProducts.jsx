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

const BestsellingProducts = ({ section, products }) => {
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

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-orange-500 mr-2">🔥</span>
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
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-md overflow-hidden 
                hover:shadow-xl transition-all"
            >
              <div onClick={() => handleProductClick(product._id || product.id)} className="cursor-pointer p-4">
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

                {/* TITLE */}
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 
                    group-hover:text-primary transition-colors">
                  {product.title}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 text-sm">★</span>
                  <span className="text-xs font-semibold text-gray-700">4.8</span>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* SOLD */}
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">📦</span>
                  <span>{product.stockCount || 0}+ sold</span>
                </p>

                {/* PRICE + DISCOUNT */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-green-600 font-bold text-sm">
                    {formatPrice(product.price)}
                  </span>

                  {product.originalPrice > product.price && (
                    <>
                      <span className="line-through text-[10px] text-gray-400">
                        {formatPrice(product.originalPrice)}
                      </span>

                      <span className="text-[10px] font-semibold text-green-700 
                             bg-green-100 px-2 py-0.5 rounded-full">
                        {calculateDiscount(product.originalPrice, product.price)}% OFF
                      </span>
                    </>
                  )}
                </div>

              </div>
              {/* CONTACT TO BUY BUTTON */}
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white 
                  py-2 rounded-lg font-medium hover:shadow-lg transition-all"
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

export default BestsellingProducts;
