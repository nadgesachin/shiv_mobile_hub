import React from 'react';
import Image from '../../../components/AppImage';

import Button from '../../../components/ui/Button';

const RecommendedServices = ({ services }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">
          Recommended for You
        </h2>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {services?.map((service) => (
          <div
            key={service?.id}
            className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background">
              <Image
                src={service?.image}
                alt={service?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 truncate">
                {service?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {service?.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-primary">
                    ₹{service?.price?.toLocaleString('en-IN')}
                  </span>
                  {service?.discount && (
                    <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
                      {service?.discount}% OFF
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" iconName="Plus">
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedServices;