import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const ServiceCard = ({ service, onLearnMore }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-medium transition-smooth group">
      <div className="flex items-start space-x-4">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${service?.bgColor}`}>
          <Icon name={service?.icon} size={28} color={service?.iconColor} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-headline font-semibold text-foreground group-hover:text-primary transition-smooth">
              {service?.title}
            </h3>
            {service?.isPopular && (
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-md flex-shrink-0 ml-2">
                Popular
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {service?.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {service?.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="CheckCircle2" size={14} color="var(--color-success)" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
              <span className="text-sm text-muted-foreground">{service?.processingTime}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={() => onLearnMore(service)}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;