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
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.imageAlt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        
        {product?.badge && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-md">
            {product?.badge}
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-success text-success-foreground text-xs font-bold rounded-md">
            {discountPercentage}% OFF
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-background"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icon
            name={isWishlisted ? "Heart" : "Heart"}
            size={16}
            color={isWishlisted ? "var(--color-accent)" : "var(--color-foreground)"}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>

        {product?.stockStatus === 'low' && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-warning/90 text-warning-foreground text-xs font-semibold rounded-md">
            Only {product?.stockCount} left
          </div>
        )}

        {product?.stockStatus === 'out' && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-lg font-bold text-destructive">Out of Stock</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
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
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 flex-1">
            {product?.name}
          </h3>
          {product?.rating && (
            <div className="flex items-center space-x-1 ml-2">
              <Icon name="Star" size={12} color="var(--color-warning)" className="fill-current" />
              <span className="text-xs font-medium text-foreground">{product?.rating}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {product?.description}
        </p>

        <div className="flex items-center space-x-1 mb-2">
          {product?.specs?.slice(0, 2).map((spec, index) => (
            <span key={index} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-primary">₹{product?.price?.toLocaleString('en-IN')}</span>
            {product?.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
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