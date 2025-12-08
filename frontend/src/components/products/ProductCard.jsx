import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import ShareProduct from './ShareProduct';
import ProductEnquiryModal from './ProductEnquiryModal';
import { getDiscountPercentage, formatIndianRupee } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  if (!product) return null;

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <>
      <div className="group flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md">
        {/* Product Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {product.badge}
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link to={`/products/${product._id}`} className="relative overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount Tag */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-3">
          <Link to={`/products/${product._id}`} className="mb-1">
            <h3 className="font-medium text-sm line-clamp-2 hover:underline">{product.name}</h3>
          </Link>

          <div className="text-sm text-muted-foreground line-clamp-2 mb-2 flex-1">
            {product.description.substring(0, 60)}
            {product.description.length > 60 ? '...' : ''}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : i < product.rating
                        ? 'text-yellow-400/60'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs ml-1 text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="font-semibold">
                {formatIndianRupee(product.price)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatIndianRupee(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div
              className={`text-xs px-2 py-0.5 rounded-full ${
                product.stockStatus === 'in-stock'
                  ? 'bg-green-100 text-green-800'
                  : product.stockStatus === 'low-stock'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stockStatus === 'in-stock'
                ? 'In Stock'
                : product.stockStatus === 'low-stock'
                ? 'Low Stock'
                : 'Out of Stock'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-auto">
            <ShareProduct product={product} />
            
            <Button
              onClick={() => setShowEnquiryModal(true)}
              className="gap-1"
              disabled={product.stockStatus === 'out-of-stock'}
            >
              <Icon name="MessageCircle" size={16} />
              <span>Enquiry for Buy</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <ProductEnquiryModal
          product={product}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
