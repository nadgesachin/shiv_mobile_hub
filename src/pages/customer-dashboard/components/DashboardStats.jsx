import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg p-6 border border-border hover:shadow-medium transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat?.bgColor}`}
            >
              <Icon name={stat?.icon} size={24} color={stat?.iconColor} />
            </div>
            {stat?.trend && (
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  stat?.trendDirection === 'up' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}
              >
                <Icon
                  name={stat?.trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'}
                  size={14}
                />
                <span className="text-xs font-medium">{stat?.trend}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-headline font-bold text-foreground">
              {stat?.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;