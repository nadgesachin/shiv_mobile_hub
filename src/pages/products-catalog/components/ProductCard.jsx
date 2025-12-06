import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onAddToCart, onQuickView, onAddToWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(product?.id);
  };

  const discountPercentage = product?.originalPrice
    ? Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden transition-smooth hover:shadow-medium">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.imageAlt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        
        {product?.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-md">
            {product?.badge}
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-success text-success-foreground text-xs font-bold rounded-md">
            {discountPercentage}% OFF
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-background"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icon
            name={isWishlisted ? "Heart" : "Heart"}
            size={18}
            color={isWishlisted ? "var(--color-accent)" : "var(--color-foreground)"}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>

        {product?.stockStatus === 'low' && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-warning/90 text-warning-foreground text-xs font-semibold rounded-md">
            Only {product?.stockCount} left
          </div>
        )}

        {product?.stockStatus === 'out' && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-lg font-bold text-destructive">Out of Stock</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Eye"
            iconPosition="left"
            onClick={() => onQuickView(product)}
          >
            Quick View
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1">
            {product?.name}
          </h3>
          {product?.rating && (
            <div className="flex items-center space-x-1 ml-2">
              <Icon name="Star" size={14} color="var(--color-warning)" className="fill-current" />
              <span className="text-sm font-medium text-foreground">{product?.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product?.description}
        </p>

        <div className="flex items-center space-x-2 mb-3">
          {product?.specs?.map((spec, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-primary">₹{product?.price?.toLocaleString('en-IN')}</span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="default"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={() => onAddToCart(product)}
          disabled={product?.stockStatus === 'out'}
        >
          {product?.stockStatus === 'out' ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;