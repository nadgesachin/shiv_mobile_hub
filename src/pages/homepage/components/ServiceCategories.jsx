import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import apiService from '../../../services/api';

const ServiceCategories = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Static category mapping for display
  const categoryInfo = {
    'mobile-services': {
      name: "Mobile Repair Services",
      description: "Expert repairs for all brands with genuine parts and warranty",
      icon: "Wrench",
      image: "https://images.unsplash.com/photo-1716113630815-67bc9c7f55bd",
      imageAlt: "Professional technician carefully repairing smartphone screen with precision tools on clean workbench under bright LED lighting",
      link: "/services-hub",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10"
    },
    'government-services': {
      name: "Government Services",
      description: "CSC authorized center for all digital India services",
      icon: "FileText",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_150b7a3b3-1764490678405.png",
      imageAlt: "Customer service representative assisting person with government document application on computer in professional office environment with organized workspace",
      link: "/csc-portal",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10"
    },
    'financial-services': {
      name: "Digital Services",
      description: "Instant recharges, bill payments, and money transfers",
      icon: "Smartphone",
      image: "https://images.unsplash.com/photo-1726066012801-14d892021339",
      imageAlt: "Person using smartphone for mobile recharge and digital payment transaction with modern payment interface displayed on screen in bright indoor setting",
      link: "/services-hub",
      color: "var(--color-accent)",
      bgColor: "bg-accent/10"
    },
    'digital-services': {
      name: "Mobile & Accessories",
      description: "Latest smartphones and genuine accessories at best prices",
      icon: "ShoppingBag",
      image: "https://images.unsplash.com/photo-1601204670778-c897b096f907",
      imageAlt: "Modern retail display showcasing latest smartphones and mobile accessories arranged neatly on glass shelves with bright LED backlighting and organized product presentation",
      link: "/products-catalog",
      color: "var(--color-success)",
      bgColor: "bg-success/10"
    }
  };

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.getServices();
        setServices(response.data.services);
        setError('');
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Group services by category and get top features
  const getCategoriesWithServices = () => {
    const groupedServices = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});

    return Object.keys(categoryInfo).map(categoryKey => {
      const categoryServices = groupedServices[categoryKey] || [];
      const popularServices = categoryServices
        .filter(service => service.isActive && service.isPopular)
        .slice(0, 4);

      // If no popular services, get first 4 active services
      const features = popularServices.length > 0 
        ? popularServices.map(service => service.name)
        : categoryServices
            .filter(service => service.isActive)
            .slice(0, 4)
            .map(service => service.name);

      // Fallback features if no services
      if (features.length === 0) {
        const fallbackFeatures = {
          'mobile-services': ["Screen Replacement", "Battery Change", "Water Damage", "Software Issues"],
          'government-services': ["Aadhaar Services", "PAN Card", "Passport", "Certificates"],
          'financial-services': ["Mobile Recharge", "DTH Recharge", "Bill Payment", "Money Transfer"],
          'digital-services': ["New Mobiles", "Accessories", "Spare Parts", "Bulk Orders"]
        };
        features.push(...(fallbackFeatures[categoryKey] || []));
      }

      return {
        ...categoryInfo[categoryKey],
        id: categoryKey,
        features: features.slice(0, 4)
      };
    });
  };

  const categories = getCategoriesWithServices();

  if (loading) {
    return (
      <section className="bg-muted py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="p-6 bg-white rounded-b-xl">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-muted py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Services</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }


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