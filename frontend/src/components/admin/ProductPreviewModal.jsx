import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ProductPreviewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!product) return null;

  const handleOpenFullPage = () => {
    navigate(`/products/${product._id}`);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get image URL from image object or string
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    return typeof img === 'string' ? img : (img.url || '/placeholder.png');
  };

  const productImages = product.images || [];
  const currentImage = productImages[selectedImageIndex];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">Product Preview</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
                <img
                  src={getImageUrl(currentImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {productImages.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery - All Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`${product.name} ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              {/* Name & Brand */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-semibold text-success">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                </div>
              )}

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.inStock 
                    ? 'bg-success/10 text-success' 
                    : 'bg-error/10 text-error'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
                
                {product.isActive ? (
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Specifications</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground min-w-[120px]">{key}:</span>
                        <span className="text-foreground font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleOpenFullPage}>
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Open Full Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
