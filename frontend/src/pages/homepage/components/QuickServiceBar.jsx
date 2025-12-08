import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickServiceBar = () => {
  const quickServices = [
    {
      id: 1,
      name: "Mobile Recharge",
      icon: "Smartphone",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10",
      link: "/services-hub",
      description: "Instant recharge"
    },
    {
      id: 2,
      name: "Bill Payment",
      icon: "Receipt",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10",
      link: "/services-hub",
      description: "Pay all bills"
    },
    {
      id: 3,
      name: "Mobile Repair",
      icon: "Wrench",
      color: "var(--color-accent)",
      bgColor: "bg-accent/10",
      link: "/services-hub",
      description: "Expert repairs"
    },
    {
      id: 4,
      name: "CSC Services",
      icon: "FileText",
      color: "var(--color-success)",
      bgColor: "bg-success/10",
      link: "/csc-portal",
      description: "Govt. services"
    },
    {
      id: 5,
      name: "Buy Products",
      icon: "ShoppingBag",
      color: "var(--color-trust-builder)",
      bgColor: "bg-trust-builder/10",
      link: "/products-catalog",
      description: "Latest mobiles"
    }
  ];

  return (
    <section className="bg-card border-y border-border sticky top-20 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-2 lg:space-x-6 min-w-max">
            {quickServices?.map((service) => (
              <Link
                key={service?.id}
                to={service?.link}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted transition-smooth group min-w-[80px] touch-target"
              >
                <div className={`w-12 h-12 ${service?.bgColor} rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110`}>
                  <Icon name={service?.icon} size={24} color={service?.color} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">{service?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{service?.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickServiceBar;