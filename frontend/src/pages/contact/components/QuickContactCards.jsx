import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickContactCards = () => {
  const contactMethods = [
    {
      id: 1,
      icon: "Phone",
      title: "Call Us",
      description: "Speak directly with our support team for immediate assistance",
      action: "+91 98765 43210",
      actionLabel: "Call Now",
      color: "primary",
      available: true
    },
    {
      id: 2,
      icon: "Mail",
      title: "Email Support",
      description: "Send us your queries and we\'ll respond within 24 hours",
      action: "support@shivmobilehub.com",
      actionLabel: "Send Email",
      color: "secondary",
      available: true
    },
    {
      id: 3,
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Chat with our AI assistant or connect with a human agent",
      action: "Start Chat",
      actionLabel: "Chat Now",
      color: "success",
      available: true
    },
    {
      id: 4,
      icon: "MapPin",
      title: "Visit Store",
      description: "Come to our physical location for in-person assistance",
      action: "Shop No. 12, Main Market, Sector 15, Noida",
      actionLabel: "Get Directions",
      color: "accent",
      available: true
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: "bg-primary/10 text-primary hover:bg-primary/20",
      secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
      success: "bg-success/10 text-success hover:bg-success/20",
      accent: "bg-accent/10 text-accent hover:bg-accent/20"
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Choose Your Preferred Contact Method
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multiple ways to reach us - pick what works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods?.map((method) => (
            <div
              key={method?.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-medium transition-smooth group"
            >
              <div className={`w-14 h-14 rounded-lg ${getColorClasses(method?.color)} flex items-center justify-center mb-4 transition-smooth group-hover:scale-110`}>
                <Icon name={method?.icon} size={24} />
              </div>
              
              <h3 className="text-xl font-headline font-semibold text-foreground mb-2">
                {method?.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {method?.description}
              </p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground break-words">
                  {method?.action}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                fullWidth
                iconName="ArrowRight"
                iconPosition="right"
              >
                {method?.actionLabel}
              </Button>
              
              {method?.available && (
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-success font-medium">Available Now</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickContactCards;