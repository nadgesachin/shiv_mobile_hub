import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparisonModal = ({ products, onClose, onRemoveProduct, onEnquire }) => {
  const specCategories = [
    { key: 'display', label: 'Display', icon: 'Monitor' },
    { key: 'processor', label: 'Processor', icon: 'Cpu' },
    { key: 'ram', label: 'RAM', icon: 'MemoryStick' },
    { key: 'storage', label: 'Storage', icon: 'HardDrive' },
    { key: 'camera', label: 'Camera', icon: 'Camera' },
    { key: 'battery', label: 'Battery', icon: 'Battery' },
    { key: 'os', label: 'Operating System', icon: 'Smartphone' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-strong max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-headline font-bold text-foreground flex items-center space-x-2">
            <Icon name="GitCompare" size={24} color="var(--color-primary)" />
            <span>Product Comparison</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
            aria-label="Close comparison"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {products?.map((product) => (
              <div key={product?.id} className="bg-muted rounded-lg p-4">
                <div className="relative">
                  <button
                    onClick={() => onRemoveProduct(product?.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                    aria-label="Remove from comparison"
                  >
                    <Icon name="X" size={14} />
                  </button>
                  <div className="aspect-square bg-background rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product?.image}
                      alt={product?.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                  {product?.name}
                </h3>
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="text-xl font-bold text-primary">
                    ₹{product?.price?.toLocaleString('en-IN')}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product?.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product?.rating && (
                  <div className="flex items-center space-x-1 mb-3">
                    <Icon name="Star" size={14} color="var(--color-warning)" className="fill-current" />
                    <span className="text-sm font-medium text-foreground">{product?.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product?.reviewCount || 0})
                    </span>
                  </div>
                )}
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  iconName="ShoppingCart"
                  iconPosition="left"
                  onClick={() => onEnquire(product)}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {specCategories?.map((category) => (
              <div key={category?.key} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 flex items-center space-x-2">
                  <Icon name={category?.icon} size={18} color="var(--color-primary)" />
                  <h4 className="text-sm font-semibold text-foreground">{category?.label}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border">
                  {products?.map((product) => (
                    <div key={product?.id} className="px-4 py-3 bg-card">
                      <p className="text-sm text-foreground">
                        {product?.detailedSpecs?.[category?.key] || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;