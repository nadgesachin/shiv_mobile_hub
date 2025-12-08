import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ actions, onActionClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions?.map((action) => (
        <button
          key={action?.id}
          onClick={() => onActionClick(action)}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-medium transition-smooth group touch-target"
        >
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto transition-smooth group-hover:scale-110"
            style={{ backgroundColor: `${action?.color}15` }}
          >
            <Icon name={action?.icon} size={24} color={action?.color} />
          </div>
          <h4 className="text-sm font-semibold text-foreground text-center mb-1">
            {action?.title}
          </h4>
          <p className="text-xs text-muted-foreground text-center">
            {action?.subtitle}
          </p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;