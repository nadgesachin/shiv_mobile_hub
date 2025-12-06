import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationTracker = ({ applications, onViewDetails }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-secondary/10 text-secondary',
      'Under Review': 'bg-warning/10 text-warning',
      'Processing': 'bg-primary/10 text-primary',
      'Approved': 'bg-success/10 text-success',
      'Completed': 'bg-success/10 text-success',
      'Rejected': 'bg-error/10 text-error',
      'Pending Documents': 'bg-warning/10 text-warning'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Submitted': 'FileCheck',
      'Under Review': 'Search',
      'Processing': 'RefreshCw',
      'Approved': 'CheckCircle2',
      'Completed': 'CheckCircle',
      'Rejected': 'XCircle',
      'Pending Documents': 'AlertCircle'
    };
    return icons?.[status] || 'FileText';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-headline font-semibold text-foreground mb-1">
            Track Your Applications
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor the status of your government service applications
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {applications?.map((app) => (
          <div key={app?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-foreground">{app?.serviceName}</h4>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(app?.status)}`}>
                    {app?.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Application ID: <span className="font-mono font-medium text-foreground">{app?.applicationId}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted on {app?.submittedDate}
                </p>
              </div>
              
              <Icon name={getStatusIcon(app?.status)} size={24} color="var(--color-primary)" />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{app?.progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${app?.progress}%` }}
                />
              </div>
            </div>

            {app?.nextAction && (
              <div className="flex items-start space-x-2 p-3 bg-warning/10 rounded-md mb-3">
                <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning mb-1">Action Required</p>
                  <p className="text-xs text-muted-foreground">{app?.nextAction}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>Est. completion: {app?.estimatedCompletion}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(app)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;