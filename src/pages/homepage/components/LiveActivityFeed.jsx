import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  const activityTemplates = [
    { icon: "Smartphone", text: "Mobile recharge completed", location: "Sector 15", color: "var(--color-primary)" },
    { icon: "Wrench", text: "Screen repair service booked", location: "Sector 22", color: "var(--color-secondary)" },
    { icon: "FileText", text: "Aadhaar service completed", location: "Sector 8", color: "var(--color-success)" },
    { icon: "ShoppingBag", text: "New mobile purchased", location: "Sector 12", color: "var(--color-accent)" },
    { icon: "Receipt", text: "Bill payment successful", location: "Sector 19", color: "var(--color-trust-builder)" },
    { icon: "CreditCard", text: "PAN card application submitted", location: "Sector 5", color: "var(--color-conversion-accent)" }
  ];

  useEffect(() => {
    const generateActivity = () => {
      const template = activityTemplates?.[Math.floor(Math.random() * activityTemplates?.length)];
      const newActivity = {
        id: Date.now(),
        ...template,
        time: "Just now"
      };

      setActivities(prev => [newActivity, ...prev?.slice(0, 4)]);
    };

    generateActivity();
    const interval = setInterval(generateActivity, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-card border-y border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <h3 className="text-xl font-headline font-bold text-foreground">Live Activity</h3>
          </div>
          <span className="text-sm text-muted-foreground">Real-time updates</span>
        </div>

        <div className="space-y-3">
          {activities?.map((activity, index) => (
            <div
              key={activity?.id}
              className="flex items-center space-x-4 p-4 bg-background rounded-lg border border-border animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={activity?.icon} size={20} color={activity?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity?.text}</p>
                <p className="text-xs text-muted-foreground">{activity?.location}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity?.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveActivityFeed;