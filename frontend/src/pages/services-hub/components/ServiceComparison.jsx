import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceComparison = ({ services, onSelectService }) => {
  const features = [
    'Service Duration',
    'Price Range',
    'Warranty Period',
    'Home Service',
    'Emergency Support',
    'Parts Included'
  ];

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-primary/5 px-6 py-4 border-b border-border">
        <h3 className="text-lg font-headline font-semibold text-foreground flex items-center gap-2">
          <Icon name="GitCompare" size={20} color="var(--color-primary)" />
          Compare Services
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Features
              </th>
              {services?.map((service) => (
                <th key={service?.id} className="px-6 py-4 text-center min-w-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${service?.iconColor}15` }}
                    >
                      <Icon name={service?.icon} size={24} color={service?.iconColor} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {service?.title}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features?.map((feature, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                  {feature}
                </td>
                {services?.map((service) => (
                  <td key={service?.id} className="px-6 py-4 text-center">
                    <span className="text-sm text-foreground">
                      {service?.comparisonData?.[feature] || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-6 py-4"></td>
              {services?.map((service) => (
                <td key={service?.id} className="px-6 py-4">
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    iconName="Calendar"
                    iconPosition="left"
                    onClick={() => onSelectService(service)}
                  >
                    Book Now
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceComparison;