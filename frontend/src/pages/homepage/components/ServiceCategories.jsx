import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import apiService from '../../../services/api';

const ServiceCategories = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const type = "service";
        const query = { type };
        const response = await apiService.getCategories(query);
        setCategories(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Group services by categoryId and build category cards dynamically
  const getCategoriesWithServices = () => {
    const groupedServices = services.reduce((acc, service) => {
      const catId =
        service.category && typeof service.category === 'object'
          ? service.category._id
          : service.category; // string id

      if (!catId) return acc;

      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(service);
      return acc;
    }, {});
    const temp = categories?.length > 0
      ? categories
        .filter(cat => cat.type === 'service' && cat.isActive)
        .map(cat => {
          const key = cat.slug;                  // use slug
          const catServices = groupedServices[key] || [];

          const popular = catServices
            .filter(s => s.isActive && s.isPopular)
            .slice(0, 4);

          const features =
            (popular.length > 0 ? popular : catServices.filter(s => s.isActive).slice(0, 4))
              .map(s => s.name);

          return {
            id: cat._id,
            name: cat.name,
            description: cat.description || 'Explore our services',
            icon: cat.icon || 'Smartphone',
            image: cat.image || 'https://images.unsplash.com/photo-1716113630815-67bc9c7f55bd',
            imageAlt: cat.name,
            link: '/services-hub',
            color: 'var(--color-primary)',
            bgColor: 'bg-primary/10',
            features,
          };
        })
        .filter(card => card.features.length > 0)
      : [];
    return temp;
  };
  const categoryCards = getCategoriesWithServices();

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
          {categoryCards.map((category) => (
            <div
              key={category.id}
              className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-smooth group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon name={category.icon} size={24} color={category.color} />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    {category.name}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {category.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={category.link}
                  className="inline-flex items-center justify-between w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth"
                >
                  View all services
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>);

};

export default ServiceCategories;