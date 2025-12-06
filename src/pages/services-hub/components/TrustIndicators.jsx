import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const indicators = [
    {
      id: 1,
      icon: 'Shield',
      title: 'CSC Certified',
      description: 'Government authorized service center',
      color: 'var(--color-success)'
    },
    {
      id: 2,
      icon: 'Award',
      title: '5000+ Services',
      description: 'Successfully completed with 4.8★ rating',
      color: 'var(--color-primary)'
    },
    {
      id: 3,
      icon: 'Lock',
      title: 'Secure Payments',
      description: 'SSL encrypted transactions',
      color: 'var(--color-secondary)'
    },
    {
      id: 4,
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Always available for assistance',
      color: 'var(--color-accent)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {indicators?.map((indicator) => (
        <div
          key={indicator?.id}
          className="bg-card rounded-lg border border-border p-4 flex items-start gap-3 hover:shadow-medium transition-smooth"
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${indicator?.color}15` }}
          >
            <Icon name={indicator?.icon} size={20} color={indicator?.color} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {indicator?.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {indicator?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;