import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const TrendingProducts = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

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
              className="card-premium w-56 flex-shrink-0 p-4 relative 
               transition-all duration-300 
               hover:shadow-lg border border-gray-100 
               rounded-xl group flex flex-col"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/products-catalog/${product.id}`} className="block flex-1">

                {/* TRENDING BADGE */}
                <div className="absolute left-3 
                      bg-gradient-orange-purple text-white 
                      text-[10px] px-3 py-0.5 rounded-full 
                      font-bold shadow-colored z-10 
                      flex items-center gap-1">
                  🔥 Trending
                </div>

                {/* IMAGE */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 
                      flex items-center justify-center 
                      h-36 overflow-hidden">
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

                {/* PRICE + DISCOUNT */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-green-600 font-bold text-base">
                    {formatPrice(product.price)}
                  </span>

                  {product.originalPrice > product.price && (
                    <>
                      <span className="line-through text-xs text-gray-400">
                        {formatPrice(product.originalPrice)}
                      </span>

                      <span className="text-[10px] font-semibold text-red-600">
                        {calculateDiscount(product.originalPrice, product.price)}% OFF
                      </span>
                    </>
                  )}
                </div>

              </Link>

              {/* CTA */}
              <button
                className="mt-3 w-full text-xs font-semibold text-white 
                 bg-gradient-to-r from-primary to-secondary
                 py-2 rounded-lg hover:opacity-90 
                 active:scale-95 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // contact modal / whatsapp / call
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

export default TrendingProducts;
