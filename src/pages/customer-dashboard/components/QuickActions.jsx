import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ actions }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-primary/10 hover:border-primary border border-transparent transition-smooth touch-target group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-smooth">
              <Icon name={action?.icon} size={24} color="var(--color-primary)" />
            </div>
            <span className="text-sm font-medium text-foreground text-center">
              {action?.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;