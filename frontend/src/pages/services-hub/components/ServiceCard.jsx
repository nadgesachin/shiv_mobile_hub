import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ServiceEnquiryModal from '../../../components/services/ServiceEnquiryModal';

const ServiceCard = ({ service, viewMode = 'grid' }) => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const {
    id,
    name,
    description,
    icon,
    iconColor,
    category,
    price,
    duration,
    availability,
    popular,
    features,
    path
  } = service;

  if (viewMode === 'list') {
    return (
      <>
        <div className="flex flex-col sm:flex-row items-stretch bg-card rounded-xl border border-border p-4 gap-4 shadow-sm hover:shadow-md transition-smooth group relative overflow-hidden">
        {popular && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Popular
          </div>
        )}
        <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 rounded-lg bg-muted">
          <Icon name={icon} size={32} color={iconColor} />
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-smooth">
                {name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                availability === 'Available' ? 'bg-success/10 text-success' : availability === 'Limited' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
              }`}>{availability}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{description}</p>
            <div className="flex items-center gap-4 text-xs mb-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1 text-primary font-semibold">
                <Icon name="IndianRupee" size={14} />
                <span>{price}</span>
              </div>
            </div>
            {features && features?.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-2">
                {features.slice(0, 2).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    <Icon name="CheckCircle" size={12} color="var(--color-success)" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="default"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
              onClick={() => setShowEnquiryModal(true)}
            >
              Book Now
            </Button>
            {path && (
              <Link to={path} className="flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
        </div>
        
        {showEnquiryModal && (
          <ServiceEnquiryModal 
            service={service} 
            onClose={() => setShowEnquiryModal(false)} 
          />
        )}
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-smooth group relative overflow-hidden flex flex-col">
      {popular && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      <div className="flex items-center justify-center mb-3">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110`} style={{ backgroundColor: `${iconColor}15` }}>
          <Icon name={icon} size={28} color={iconColor} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth text-center truncate">
        {name}
      </h3>
      <span className={`self-center mb-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        availability === 'Available' ? 'bg-success/10 text-success' : availability === 'Limited' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
      }`}>{availability}</span>
      <p className="text-xs text-muted-foreground mb-2 text-center line-clamp-2">{description}</p>
      <div className="flex items-center justify-center gap-4 text-xs mb-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <Icon name="IndianRupee" size={14} />
          <span>{price}</span>
        </div>
      </div>
      {features && features?.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-3 justify-center">
          {features.slice(0, 2).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Icon name="CheckCircle" size={12} color="var(--color-success)" />
              {feature}
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="Calendar"
          iconPosition="left"
          onClick={() => setShowEnquiryModal(true)}
        >
          Book Now
        </Button>
        {path && (
          <Link to={path} className="flex-shrink-0">
            <Button variant="outline" size="sm">
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        )}
      </div>
    </div>

    {showEnquiryModal && (
      <ServiceEnquiryModal 
        service={service} 
        onClose={() => setShowEnquiryModal(false)} 
      />
    )}
    </>
  );
};

export default ServiceCard;