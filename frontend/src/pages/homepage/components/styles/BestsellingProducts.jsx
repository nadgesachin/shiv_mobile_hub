import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const BestsellingProducts = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="w-56 flex-shrink-0 bg-white p-4 relative rounded-xl 
               shadow-sm border border-gray-100 
               hover:shadow-lg transition-all duration-300 group"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/products-catalog/${product.id}`} className="block">

                {/* IMAGE */}
                <div className="relative mb-3 flex items-center justify-center h-36 
                      bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain 
                     transition-transform duration-300 
                     group-hover:scale-110"
                  />
                </div>

                {/* TITLE */}
                <p className="text-sm font-medium text-gray-800 line-clamp-2 h-6 
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

              </Link>
              {/* CONTACT TO BUY BUTTON */}
              <button
                className="mt-3 w-full text-xs font-semibold text-white 
                 bg-gradient-to-r from-primary to-secondary
                 py-2 rounded-lg 
                 hover:opacity-90 active:scale-95
                 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault(); // stop Link navigation
                  e.stopPropagation();
                  // add contact action here (modal / whatsapp / call)
                }}
              >
                Contact to Buy
              </button>
            </motion.div>
          ))}

        </motion.div>
      </MobileSwipe>
    </div>
  );
};

export default BestsellingProducts;
