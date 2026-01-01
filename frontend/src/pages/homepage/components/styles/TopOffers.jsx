import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const TopOffers = ({ section, products }) => {
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
              className="w-56 flex-shrink-0 bg-white rounded-xl shadow-sm p-3 relative 
               hover:shadow-lg transition-all duration-300 
               border border-gray-100 group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/products-catalog/${product.id}`} className="block flex-1">

                {/* DISCOUNT BADGE */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white 
                        text-[10px] px-2 py-0.5 rounded-full font-semibold">
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
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
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
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="line-through text-[10px] text-gray-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

              </Link>

              {/* CONTACT TO BUY */}
              <button
                className="mt-3 w-full text-xs font-semibold text-white 
                 bg-gradient-to-r from-primary to-secondary
                 py-2 rounded-lg hover:opacity-90 
                 active:scale-95 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // open contact modal / whatsapp / call
                }}
              >
                Contact to Buy
              </button>
            </motion.div>
          ))}

        </div>
      </MobileSwipe>
    </div>
  );
};

export default TopOffers;
