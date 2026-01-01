import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';

const BrandDhamaka = ({ section, products }) => {
  return (
    <div className="w-full px-2 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
        <Link to="/products-catalog" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {products.map((product, index) => (
          <Link to={`/products-catalog/${product.id}`} key={product.id}>
            <motion.div
              className="flex flex-col items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Image
                src={product.image}
                alt={product.title}
                className="w-full h-28 object-contain"
              />
              <div className="p-2 text-center text-sm font-medium text-gray-700">
                {product.title}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandDhamaka;
