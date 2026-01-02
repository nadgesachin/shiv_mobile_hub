import React from 'react';
import ProductEnquiryModal from '../../../components/products/ProductEnquiryModal';
const ProductCard = ({ product, viewMode = 'grid', enquiryProduct }) => {

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 bg-white border border-gray-100 
                      rounded-lg p-3 hover:shadow-md transition-all">

        <div className="w-24 h-24 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
          <img
            src={product?.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {product.name} || List View
          </h3>

          <p className="text-xs text-gray-500 truncate mt-0.5">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-600 font-bold text-sm">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{product.rating || 4.8}</span>
          </div>
        </div>

        <button
          className="px-4 py-2 text-xs font-semibold text-white 
                     bg-gradient-to-r from-primary to-secondary
                     rounded-md hover:opacity-90"
          onClick={() => enquiryProduct(product)}
        >
          Contact to Buy
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white rounded-xl border border-gray-100 
                    shadow-sm hover:shadow-lg transition-all 
                    flex flex-col overflow-hidden">

      <div className="h-36 bg-gray-50 flex items-center justify-center">
        <img
          src={product?.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-contain 
                     transition-transform duration-300 
                     hover:scale-105"
        />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-xs">
          <span className="text-amber-500">★</span>
          <span>{product.rating || 4.8}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-green-600 font-bold text-sm">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          className="mt-auto w-full text-xs font-semibold text-white 
                     bg-gradient-to-r from-primary to-secondary
                     py-2 rounded-lg hover:opacity-90"
          onClick={() => enquiryProduct(product)}
        >
          Contact to Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;