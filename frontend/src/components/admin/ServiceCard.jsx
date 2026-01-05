import React from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ServiceCard = ({ service, onEdit, onDelete, onToggleStatus, onTogglePopular, onShow }) => {
  const formatPrice = (price, priceType) => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'variable') return 'Variable';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mobile-services':
        return 'bg-blue-100 text-blue-800';
      case 'government-services':
        return 'bg-green-100 text-green-800';
      case 'financial-services':
        return 'bg-purple-100 text-purple-800';
      case 'digital-services':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Service Header */}
      <div className="p-4 bg-muted/50 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={service.icon} size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground line-clamp-2 mb-1 min-h-[3rem]" title={service.name}>
                {service.name}
              </h3>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(typeof service.category === 'object' ? service.category?.name : service.category)}`}>
                {typeof service.category === 'object' ? service.category?.name : service.category?.replace('-', ' ')}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex flex-col gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              service.isActive 
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
              {service.isActive ? 'Active' : 'Inactive'}
            </span>
            
            {service.isPopular && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
                Popular
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4" title={service.description}>
          {service.description}
        </p>

        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(service.price, service.priceType)}
            </span>
            {service.duration && (
              <span className="text-sm text-muted-foreground ml-2">
                • {service.duration}
              </span>
            )}
          </div>
          
          {service.displayOrder > 0 && (
            <span className="text-xs text-muted-foreground">
              Order: {service.displayOrder}
            </span>
          )}
        </div>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Features:</p>
            <div className="space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon name="Check" size={12} className="text-success" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
              {service.features.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{service.features.length - 3} more features
                </p>
              )}
            </div>
          </div>
        )}

        {/* Requirements */}
        {service.requirements && service.requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Requirements:</p>
            <div className="space-y-1">
              {service.requirements.slice(0, 2).map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={12} className="text-warning" />
                  <span className="text-xs text-muted-foreground">{requirement}</span>
                </div>
              ))}
              {service.requirements.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{service.requirements.length - 2} more requirements
                </p>
              )}
            </div>
          </div>
        )}

        {/* Process Steps */}
        {service.process && service.process.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-foreground mb-2">Process:</p>
            <div className="space-y-1">
              {service.process.slice(0, 2).map((step, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  <span className="font-medium">{step.step}:</span> {step.description}
                </div>
              ))}
              {service.process.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{service.process.length - 2} more steps
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShow}
              className="flex-1"
            >
              <Icon name="Eye" size={14} className="mr-1" />
              Show
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(service)}
              className="flex-1"
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(service._id)}
              className="text-error hover:text-error hover:bg-error/10"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={service.isActive ? 'outline' : 'default'}
              size="sm"
              onClick={() => onToggleStatus(service._id)}
              className="flex-1"
            >
              <Icon 
                name={service.isActive ? 'EyeOff' : 'Eye'} 
                size={14} 
                className="mr-1" 
              />
              {service.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            
            <Button
              variant={service.isPopular ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTogglePopular(service._id)}
              className="flex-1"
            >
              <Icon 
                name={service.isPopular ? 'Star' : 'StarOff'} 
                size={14} 
                className="mr-1" 
              />
              {service.isPopular ? 'Popular' : 'Mark Popular'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
