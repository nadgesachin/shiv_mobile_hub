import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
// import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';

const LoadMoreProducts = ({ section, products }) => {
  const [visibleProducts, setVisibleProducts] = useState(4);

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="mt-5 max-w-5xl mx-auto">
      <hr />
      <h2 className="text-xl font-semibold text-gray-800 my-4">{section.title}</h2>
      <div className="grid grid-cols-2 gap-1">
        {products.slice(0, visibleProducts).map((product) => (
          <Link to={`/products-catalog/${product.id}`} key={product.id}>
            <motion.div
              className="relative bg-white p-2 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image src={product.image} alt={product.title} className="w-full h-36 object-contain rounded" />
              {!product.inStock && (
                <span className="absolute top-14 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                  OUT OF STOCK
                </span>
              )}
              <button className="absolute top-2 right-2 text-red-500">
                <FaHeart />
              </button>
              <p className="text-sm font-medium mt-1">{product.title}</p>
              <div className="text-xs">
                <span className="font-bold text-black">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="line-through text-gray-500 ml-1">{formatPrice(product.originalPrice)}</span>
                )}
                {product.discount > 0 && (
                  <span className="text-green-600 ml-1">{product.discount}% off</span>
                )}
              </div>
              <div className="text-xs text-green-600">
                ₹{Math.floor(product.price * 0.86)} with {product.offers || 0} Offers
              </div>
              <div className="text-xs text-gray-600">Free Delivery</div>
              <div className="text-xs mt-1 flex items-center gap-1">
                <span className="bg-green-500 text-white px-1.5 rounded text-xs">{4.8}</span>
                <span className="text-gray-500">({product.reviewCount || 0})</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      {visibleProducts < products.length && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadMoreProducts;
