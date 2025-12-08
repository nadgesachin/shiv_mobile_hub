import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCard = ({ service, onBookNow }) => {
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

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-medium transition-smooth group relative overflow-hidden">
      {popular && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110`} style={{ backgroundColor: `${iconColor}15` }}>
          <Icon name={icon} size={28} color={iconColor} />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          availability === 'Available' ?'bg-success/10 text-success' 
            : availability === 'Limited' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
        }`}>
          {availability}
        </div>
      </div>
      <h3 className="text-lg font-headline font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <Icon name="IndianRupee" size={16} />
          <span>{price}</span>
        </div>
      </div>
      {features && features?.length > 0 && (
        <ul className="space-y-2 mb-4">
          {features?.slice(0, 3)?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Icon name="CheckCircle" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="Calendar"
          iconPosition="left"
          onClick={() => onBookNow(service)}
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
  );
};

export default ServiceCard;