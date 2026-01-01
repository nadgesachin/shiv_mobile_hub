import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useViewport from '../../../../hooks/useViewport';

const LowPriceProducts = ({ section, products }) => {
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-2">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-green-600 mr-2">🔥</span>
        <span>{section.title}</span>
      </h2>

      {/* Horizontal Scroll Container */}
      <motion.div
        className="flex gap-4 overflow-x-auto pb-3 no-scrollbar 
                   scroll-smooth snap-x snap-mandatory"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.97 }}
            className="min-w-[150px] snap-start 
                       flex flex-col items-center p-3 
                       cursor-pointer transition-all duration-300 
                       relative group"
          >
            <Link to={`/products-catalog/${product.id}`} className="block w-full">
              
              {/* Price Badge */}
              <div className="absolute top-2 right-2 bg-green-100 
                              text-green-700 text-xs px-2 py-0.5 
                              rounded-full font-bold border border-green-200 z-10">
                {formatPrice(product.price)}
              </div>

              {/* Centered Image */}
              <div className="w-full flex justify-center mt-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br 
                                from-gray-50 to-green-50 
                                grid place-items-center overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* Product Title */}
              <p className="text-sm text-center mt-2 font-medium 
                            truncate text-gray-800 
                            group-hover:text-primary transition-colors">
                {product.title}
              </p>

              {/* Under Price */}
              <p className="text-xs text-green-600 font-bold mt-1 
                            bg-green-50 px-2 py-0.5 rounded-full text-center">
                Under {formatPrice(product.price)}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LowPriceProducts;
