import React from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'text-success';
      case 'low':
        return 'text-warning';
      case 'out':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low':
        return 'Low Stock';
      case 'out':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 bg-muted">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Package" size={48} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.isActive 
              ? 'bg-success/10 text-success' 
              : 'bg-error/10 text-error'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name and Brand */}
        <div className="mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.brand}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-success font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Category and Stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 bg-muted rounded-full">
            {product.category}
          </span>
          <span className={`text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
            {getStockStatusText(product.stockStatus)} ({product.stockCount || 0})
          </span>
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  className={i < Math.floor(product.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Specs */}
        {product.specs && product.specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.specs.slice(0, 3).map((spec, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-muted rounded"
              >
                {spec}
              </span>
            ))}
            {product.specs.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted rounded">
                +{product.specs.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Sections */}
        {product.sections && product.sections.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">In sections:</p>
            <div className="flex flex-wrap gap-1">
              {product.sections.map((section, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                >
                  {section.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(product._id)}
            className="flex-1"
          >
            <Icon 
              name={product.isActive ? 'EyeOff' : 'Eye'} 
              size={14} 
              className="mr-1" 
            />
            {product.isActive ? 'Hide' : 'Show'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Icon name="Edit" size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product._id)}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
