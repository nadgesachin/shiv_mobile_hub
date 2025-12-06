import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SupportTickets = ({ tickets }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-error/10 text-error border-error/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20',
    };
    return colors?.[priority] || colors?.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-primary/10 text-primary border-primary/20',
      'in-progress': 'bg-warning/10 text-warning border-warning/20',
      resolved: 'bg-success/10 text-success border-success/20',
      closed: 'bg-muted text-muted-foreground border-border',
    };
    return colors?.[status] || colors?.open;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">
          Support Tickets
        </h2>
        <Button variant="default" iconName="Plus" iconPosition="left" size="sm">
          New Ticket
        </Button>
      </div>
      <div className="space-y-4">
        {tickets?.map((ticket) => (
          <div
            key={ticket?.id}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {ticket?.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                      ticket?.priority
                    )}`}
                  >
                    {ticket?.priority?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {ticket?.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Hash" size={12} />
                    <span>{ticket?.ticketId}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{ticket?.createdDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{ticket?.replies} replies</span>
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border ${getStatusColor(
                  ticket?.status
                )}`}
              >
                <span className="text-xs font-medium capitalize">
                  {ticket?.status?.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="User" size={14} color="var(--color-primary)" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Assigned to {ticket?.assignedTo}
                </span>
              </div>
              <Button variant="ghost" size="sm" iconName="MessageSquare">
                View Thread
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTickets;