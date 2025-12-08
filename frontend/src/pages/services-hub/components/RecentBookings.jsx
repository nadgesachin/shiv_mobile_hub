import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentBookings = ({ bookings }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success';
      case 'In Progress':
        return 'bg-warning/10 text-warning';
      case 'Scheduled':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-headline font-semibold text-foreground flex items-center gap-2">
          <Icon name="History" size={20} color="var(--color-primary)" />
          Recent Bookings
        </h3>
      </div>
      <div className="divide-y divide-border">
        {bookings?.map((booking) => (
          <div key={booking?.id} className="px-6 py-4 hover:bg-muted/50 transition-smooth">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${booking?.iconColor}15` }}
                >
                  <Icon name={booking?.icon} size={20} color={booking?.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {booking?.service}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {booking?.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {booking?.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {booking?.customer}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                  {booking?.status}
                </span>
                <span className="text-sm font-semibold text-primary">
                  ₹{booking?.amount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;