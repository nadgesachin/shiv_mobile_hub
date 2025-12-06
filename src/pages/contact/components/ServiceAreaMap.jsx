import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ServiceAreaMap = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  const serviceZones = [
    {
      id: 1,
      name: "Sector 15-18",
      area: "Noida Central",
      coverage: "Full Coverage",
      deliveryTime: "30-45 mins",
      services: ["Mobile Repair", "CSC Services", "Home Delivery"],
      color: "success"
    },
    {
      id: 2,
      name: "Sector 19-22",
      area: "Noida East",
      coverage: "Full Coverage",
      deliveryTime: "45-60 mins",
      services: ["Mobile Repair", "CSC Services", "Home Delivery"],
      color: "primary"
    },
    {
      id: 3,
      name: "Sector 50-62",
      area: "Noida West",
      coverage: "Partial Coverage",
      deliveryTime: "60-90 mins",
      services: ["Mobile Repair", "Home Delivery"],
      color: "warning"
    },
    {
      id: 4,
      name: "Greater Noida",
      area: "Extended Area",
      coverage: "On Request",
      deliveryTime: "90-120 mins",
      services: ["Mobile Repair"],
      color: "secondary"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: "bg-success/10 text-success border-success/20",
      primary: "bg-primary/10 text-primary border-primary/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      secondary: "bg-secondary/10 text-secondary border-secondary/20"
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Our Service Coverage Area
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We serve multiple zones across Noida and Greater Noida with varying service levels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft h-[500px]">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Shiv Mobile Hub Service Area Map"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=28.5355,77.3910&z=13&output=embed"
                className="w-full h-full"
              />
            </div>
            
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                <Icon name="MapPin" size={24} color="var(--color-success)" className="mx-auto mb-2" />
                <p className="text-2xl font-bold text-success">4+</p>
                <p className="text-xs text-muted-foreground">Service Zones</p>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <Icon name="Users" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">50K+</p>
                <p className="text-xs text-muted-foreground">Customers Served</p>
              </div>
              
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
                <Icon name="Truck" size={24} color="var(--color-secondary)" className="mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary">30 min</p>
                <p className="text-xs text-muted-foreground">Avg Delivery</p>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
                <Icon name="Star" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent">4.8/5</p>
                <p className="text-xs text-muted-foreground">Customer Rating</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-headline font-semibold text-foreground mb-4">
              Service Zones
            </h3>
            
            {serviceZones?.map((zone) => (
              <div
                key={zone?.id}
                onClick={() => setSelectedZone(zone?.id === selectedZone ? null : zone?.id)}
                className={`bg-card border rounded-lg p-4 cursor-pointer transition-smooth hover:shadow-medium ${
                  selectedZone === zone?.id ? 'border-primary shadow-medium' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{zone?.name}</h4>
                    <p className="text-sm text-muted-foreground">{zone?.area}</p>
                  </div>
                  <Icon 
                    name={selectedZone === zone?.id ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-muted-foreground"
                  />
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses(zone?.color)}`}>
                    {zone?.coverage}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>{zone?.deliveryTime}</span>
                  </div>
                </div>

                {selectedZone === zone?.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    <p className="text-xs font-medium text-foreground mb-2">Available Services:</p>
                    {zone?.services?.map((service, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                        <span className="text-xs text-muted-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;