import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const [counters, setCounters] = useState({
    customers: 0,
    repairs: 0,
    services: 0,
    rating: 0
  });

  const finalValues = {
    customers: 10000,
    repairs: 25000,
    services: 50000,
    rating: 4.8
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        customers: Math.min(prev?.customers + Math.ceil(finalValues?.customers / steps), finalValues?.customers),
        repairs: Math.min(prev?.repairs + Math.ceil(finalValues?.repairs / steps), finalValues?.repairs),
        services: Math.min(prev?.services + Math.ceil(finalValues?.services / steps), finalValues?.services),
        rating: Math.min(prev?.rating + (finalValues?.rating / steps), finalValues?.rating)
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const indicators = [
    {
      id: 1,
      icon: "Users",
      value: `${counters?.customers?.toLocaleString()}+`,
      label: "Happy Customers",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10"
    },
    {
      id: 2,
      icon: "Wrench",
      value: `${counters?.repairs?.toLocaleString()}+`,
      label: "Repairs Completed",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10"
    },
    {
      id: 3,
      icon: "FileCheck",
      value: `${counters?.services?.toLocaleString()}+`,
      label: "Services Delivered",
      color: "var(--color-success)",
      bgColor: "bg-success/10"
    },
    {
      id: 4,
      icon: "Star",
      value: counters?.rating?.toFixed(1),
      label: "Customer Rating",
      color: "var(--color-conversion-accent)",
      bgColor: "bg-conversion-accent/10"
    }
  ];

  const certifications = [
    {
      id: 1,
      icon: "Shield",
      label: "CSC Certified",
      description: "Authorized Common Service Center"
    },
    {
      id: 2,
      icon: "Award",
      label: "ISO Certified",
      description: "Quality Management System"
    },
    {
      id: 3,
      icon: "CheckCircle",
      label: "Verified Business",
      description: "Government Registered"
    }
  ];

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Trusted by Thousands in Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building digital confidence through reliable services and transparent operations
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {indicators?.map((indicator) => (
            <div
              key={indicator?.id}
              className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-smooth"
            >
              <div className={`w-16 h-16 ${indicator?.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon name={indicator?.icon} size={32} color={indicator?.color} />
              </div>
              <p className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
                {indicator?.value}
              </p>
              <p className="text-sm text-muted-foreground">{indicator?.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications?.map((cert) => (
            <div
              key={cert?.id}
              className="flex items-center space-x-4 p-6 bg-card rounded-xl border border-border hover:border-primary transition-smooth"
            >
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={cert?.icon} size={24} color="var(--color-success)" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{cert?.label}</p>
                <p className="text-sm text-muted-foreground">{cert?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;