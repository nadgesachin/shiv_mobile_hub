import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceTimeline = ({ services }) => {
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-success/10 text-success border-success/20',
      'in-progress': 'bg-warning/10 text-warning border-warning/20',
      pending: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-error/10 text-error border-error/20',
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: 'CheckCircle',
      'in-progress': 'Clock',
      pending: 'AlertCircle',
      cancelled: 'XCircle',
    };
    return icons?.[status] || 'AlertCircle';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">
          Service History
        </h2>
        <Button variant="ghost" iconName="Filter" iconPosition="left" size="sm">
          Filter
        </Button>
      </div>
      <div className="space-y-4">
        {services?.map((service, index) => (
          <div
            key={service?.id}
            className="relative pl-8 pb-6 border-l-2 border-border last:border-l-0 last:pb-0"
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

            <div className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {service?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service?.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{service?.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Hash" size={14} />
                      <span>{service?.orderId}</span>
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border ${getStatusColor(
                    service?.status
                  )}`}
                >
                  <Icon name={getStatusIcon(service?.status)} size={14} />
                  <span className="text-xs font-medium capitalize">
                    {service?.status?.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {service?.status === 'in-progress' && service?.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{service?.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${service?.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  ₹{service?.amount?.toLocaleString('en-IN')}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Eye">
                    View Details
                  </Button>
                  {service?.status === 'completed' && (
                    <Button variant="ghost" size="sm" iconName="Download">
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTimeline;