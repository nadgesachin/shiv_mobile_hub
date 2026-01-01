import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import { Interactive } from '../../../../components/ui/animations';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const ProductCarousel = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

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
                <div className="card-premium h-full flex flex-col relative overflow-hidden rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300">

                  {/* IMAGE */}
                  <Link to={`/products-catalog/${product.id}`}>
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

                      {/* BADGES */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between">
                        {product.originalPrice > product.price && (
                          <span className="px-3 py-1 text-[11px] font-bold rounded-full 
                                 bg-emerald-100 text-emerald-700">
                            {calculateDiscount(product.originalPrice, product.price)}% OFF
                          </span>
                        )}

                        {product.badgeText && (
                          <span className="px-3 py-1 text-[11px] font-bold rounded-full 
                                 bg-gradient-to-r from-primary to-secondary text-white">
                            {product.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

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
                        // contact logic (modal / whatsapp / call)
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
    </motion.div>
  );
};

export default ProductCarousel;
