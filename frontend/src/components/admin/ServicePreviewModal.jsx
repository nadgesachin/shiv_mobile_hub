import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ServicePreviewModal = ({ service, onClose }) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!service) return null;

  const handleOpenFullPage = () => {
    navigate(`/services/${service._id}`);
    onClose();
  };

  // Get image URL from image object or string
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    return typeof img === 'string' ? img : (img.url || '/placeholder.png');
  };

  const serviceImages = service.images || [];
  const currentImage = serviceImages[selectedImageIndex];

  const formatPrice = (price, priceType) => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'variable') return 'Variable';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">Service Preview</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Icon & Basic Info */}
            <div className="space-y-4">
              {/* Service Icon */}
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Icon name={service.icon || 'Wrench'} size={64} className="text-primary" />
              </div>

              {/* Service Images */}
              {serviceImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Gallery ({serviceImages.length})</h4>
                  
                  {/* Main Selected Image */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted relative group">
                    <img 
                      src={getImageUrl(currentImage)} 
                      alt={service.name} 
                      className="w-full h-full object-cover" 
                    />
                    {serviceImages.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {selectedImageIndex + 1} / {serviceImages.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails - All Images */}
                  {serviceImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {serviceImages.map((img, idx) => (
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
                            alt={`${service.name} ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Requirements */}
              {service.requirements && service.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {service.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon name="FileText" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              {/* Name & Category */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                {service.category && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {typeof service.category === 'object' ? service.category.name : service.category}
                  </span>
                )}
              </div>

              {/* Price & Duration */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-muted-foreground block">Price</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(service.price, service.priceType)}
                  </span>
                </div>
                {service.duration && (
                  <div>
                    <span className="text-sm text-muted-foreground block">Duration</span>
                    <span className="text-lg font-semibold text-foreground">{service.duration}</span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {service.isActive ? (
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
                
                {service.isPopular && (
                  <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>

              {/* Description */}
              {service.description && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Features</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon name="Star" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Process */}
              {service.process && service.process.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Process</h4>
                  <div className="space-y-2">
                    {service.process.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{step.title}</p>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {service.terms && service.terms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Terms & Conditions</h4>
                  <ul className="space-y-1">
                    {service.terms.map((term, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Icon name="Info" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>{term}</span>
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

export default ServicePreviewModal;
