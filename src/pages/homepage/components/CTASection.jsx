import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const ctaCards = [
    {
      id: 1,
      title: "Need Urgent Mobile Repair?",
      description: "Get your phone fixed by experts with genuine parts and warranty",
      icon: "Wrench",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10",
      cta: { text: "Book Repair Now", link: "/services-hub" },
      features: ["Same Day Service", "Genuine Parts", "6 Month Warranty"]
    },
    {
      id: 2,
      title: "Government Services Made Easy",
      description: "Complete all your document work with expert guidance",
      icon: "FileText",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10",
      cta: { text: "Visit CSC Portal", link: "/csc-portal" },
      features: ["CSC Authorized", "Fast Processing", "Expert Help"]
    },
    {
      id: 3,
      title: "Explore Latest Mobiles",
      description: "Discover newest smartphones and accessories at best prices",
      icon: "ShoppingBag",
      color: "var(--color-success)",
      bgColor: "bg-success/10",
      cta: { text: "Browse Products", link: "/products-catalog" },
      features: ["Latest Models", "Best Prices", "Genuine Products"]
    }
  ];

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the service you need and experience hassle-free digital convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ctaCards?.map((card) => (
            <div
              key={card?.id}
              className="bg-card rounded-xl p-6 lg:p-8 shadow-soft hover:shadow-strong transition-smooth border border-border"
            >
              <div className={`w-16 h-16 ${card?.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <Icon name={card?.icon} size={32} color={card?.color} />
              </div>

              <h3 className="text-xl font-headline font-bold text-foreground mb-3">
                {card?.title}
              </h3>
              <p className="text-muted-foreground mb-6">{card?.description}</p>

              <div className="space-y-2 mb-6">
                {card?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} color={card?.color} />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={card?.cta?.link}>
                <Button variant="default" fullWidth iconName="ArrowRight" iconPosition="right">
                  {card?.cta?.text}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-card rounded-xl shadow-soft">
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={24} color="var(--color-primary)" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Need Help? Call Us</p>
                <p className="text-lg font-semibold text-foreground">+91 98765 43210</p>
              </div>
            </div>
            <span className="hidden sm:inline text-muted-foreground">or</span>
            <Link to="/contact">
              <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                Chat with Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;