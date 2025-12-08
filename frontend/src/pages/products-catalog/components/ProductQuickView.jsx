import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductQuickView = ({ product, onClose, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = [
    { src: product?.image, alt: product?.imageAlt },
    { src: product?.image, alt: `${product?.name} side view showing sleek design and premium finish` },
    { src: product?.image, alt: `${product?.name} back view displaying camera setup and branding` },
    { src: product?.image, alt: `${product?.name} close-up of display screen showing vibrant colors` },
  ];

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-strong max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-headline font-bold text-foreground">Quick View</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
            aria-label="Close quick view"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={productImages?.[selectedImage]?.src}
                  alt={productImages?.[selectedImage]?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productImages?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-smooth ${
                      selectedImage === index
                        ? 'border-primary' :'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Image
                      src={img?.src}
                      alt={img?.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                    {product?.name}
                  </h3>
                  {product?.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={16}
                            color={i < Math.floor(product?.rating) ? "var(--color-warning)" : "var(--color-muted)"}
                            className={i < Math.floor(product?.rating) ? "fill-current" : ""}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                {product?.badge && (
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-md">
                    {product?.badge}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product?.description}</p>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ₹{product?.price?.toLocaleString('en-IN')}
                </span>
                {product?.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product?.originalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-1 bg-success text-success-foreground text-sm font-bold rounded-md">
                      {Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Key Specifications</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product?.specs?.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-md">
                        <Icon name="Check" size={14} color="var(--color-success)" />
                        <span className="text-sm text-foreground">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {product?.stockStatus !== 'out' && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Quantity</h4>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 flex items-center justify-center border border-border rounded-md hover:bg-muted transition-smooth"
                        aria-label="Decrease quantity"
                      >
                        <Icon name="Minus" size={16} />
                      </button>
                      <span className="text-lg font-semibold text-foreground w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 flex items-center justify-center border border-border rounded-md hover:bg-muted transition-smooth"
                        aria-label="Increase quantity"
                      >
                        <Icon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  iconName="ShoppingCart"
                  iconPosition="left"
                  onClick={handleAddToCart}
                  disabled={product?.stockStatus === 'out'}
                >
                  {product?.stockStatus === 'out' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  iconName="Heart"
                  iconPosition="left"
                >
                  Add to Wishlist
                </Button>
              </div>

              {product?.stockStatus === 'low' && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-md flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
                  <span className="text-sm text-warning">
                    Only {product?.stockCount} items left in stock
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;