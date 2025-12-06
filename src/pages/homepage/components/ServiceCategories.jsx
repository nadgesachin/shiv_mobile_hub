import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ServiceCategories = () => {
  const categories = [
  {
    id: 1,
    name: "Mobile Repair Services",
    description: "Expert repairs for all brands with genuine parts and warranty",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1716113630815-67bc9c7f55bd",
    imageAlt: "Professional technician carefully repairing smartphone screen with precision tools on clean workbench under bright LED lighting",
    features: ["Screen Replacement", "Battery Change", "Water Damage", "Software Issues"],
    link: "/services-hub",
    color: "var(--color-primary)",
    bgColor: "bg-primary/10"
  },
  {
    id: 2,
    name: "Government Services",
    description: "CSC authorized center for all digital India services",
    icon: "FileText",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_150b7a3b3-1764490678405.png",
    imageAlt: "Customer service representative assisting person with government document application on computer in professional office environment with organized workspace",
    features: ["Aadhaar Services", "PAN Card", "Passport", "Certificates"],
    link: "/csc-portal",
    color: "var(--color-secondary)",
    bgColor: "bg-secondary/10"
  },
  {
    id: 3,
    name: "Digital Services",
    description: "Instant recharges, bill payments, and money transfers",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1726066012801-14d892021339",
    imageAlt: "Person using smartphone for mobile recharge and digital payment transaction with modern payment interface displayed on screen in bright indoor setting",
    features: ["Mobile Recharge", "DTH Recharge", "Bill Payment", "Money Transfer"],
    link: "/services-hub",
    color: "var(--color-accent)",
    bgColor: "bg-accent/10"
  },
  {
    id: 4,
    name: "Mobile & Accessories",
    description: "Latest smartphones and genuine accessories at best prices",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1601204670778-c897b096f907",
    imageAlt: "Modern retail display showcasing latest smartphones and mobile accessories arranged neatly on glass shelves with bright LED backlighting and organized product presentation",
    features: ["New Mobiles", "Accessories", "Spare Parts", "Bulk Orders"],
    link: "/products-catalog",
    color: "var(--color-success)",
    bgColor: "bg-success/10"
  }];


  return (
    <section className="bg-muted py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Comprehensive Digital Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for your mobile and digital requirements under one roof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories?.map((category) =>
          <div
            key={category?.id}
            className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-smooth group">

              <div className="relative h-48 overflow-hidden">
                <Image
                src={category?.image}
                alt={category?.imageAlt}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-12 h-12 ${category?.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon name={category?.icon} size={24} color={category?.color} />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-headline font-bold text-foreground mb-2">
                  {category?.name}
                </h3>
                <p className="text-muted-foreground mb-4">{category?.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {category?.features?.map((feature, index) =>
                <div key={index} className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} color={category?.color} />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                )}
                </div>

                <Link to={category?.link}>
                  <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center space-x-2 touch-target">
                    <span>Explore Services</span>
                    <Icon name="ArrowRight" size={18} />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ServiceCategories;