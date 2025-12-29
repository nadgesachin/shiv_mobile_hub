import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import apiService from '../../../services/api';
import { HoverScale, Interactive, ScrollReveal, ShimmerLoader } from '../../../components/ui/animations';

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
      <section className="bg-gradient-to-b from-white to-muted py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ShimmerLoader className="h-12 w-1/3 mx-auto mb-4 rounded-xl" />
            <ShimmerLoader className="h-6 w-1/2 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                <ShimmerLoader className="h-52 w-full rounded-t-2xl" />
                <div className="p-6">
                  <ShimmerLoader className="h-7 w-3/4 rounded-lg mb-4" />
                  <ShimmerLoader className="h-4 w-full rounded mb-4" />
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[1, 2, 3, 4].map(j => (
                      <ShimmerLoader key={j} className="h-4 rounded" />
                    ))}
                  </div>
                  <ShimmerLoader className="h-12 w-full rounded-xl mt-6" />
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
      <section className="bg-gradient-to-b from-white to-muted py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Icon name="AlertCircle" size={56} className="text-error mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Services</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }


  return (
    <section className="bg-gradient-to-b from-white via-white to-muted py-16 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative elements */}
        <div className="absolute -top-12 left-1/4 w-64 h-64 bg-gradient-to-br from-secondary/5 to-accent/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-full blur-3xl opacity-60" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="inline-block text-4xl lg:text-5xl font-headline font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Comprehensive Digital Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for your mobile and digital requirements under one roof
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryCards.map((category, index) => (
            <ScrollReveal 
              key={category.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <Interactive>
                <div className="h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative group hover:-translate-y-1">
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-sm" />
                  
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                    
                    {/* Category icon */}
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-4 left-4"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                        <Icon name={category.icon} size={28} color="white" />
                      </div>
                    </motion.div>
                    
                    {/* Category name - on image overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl sm:text-2xl font-headline font-bold text-white mb-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category description */}
                    <p className="text-muted-foreground mb-5">
                      {category.description}
                    </p>

                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {category.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 group/feature"
                        >
                          <span className="w-2 h-2 rounded-full bg-secondary group-hover/feature:scale-125 transition-all duration-300"></span>
                          <span className="text-sm text-foreground line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={category.link}
                      className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-secondary to-accent p-[1px] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#0ea5e9_50%,#a855f7_100%)] opacity-40" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-between rounded-xl bg-white px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur-3xl hover:bg-white/90 transition-all duration-300">
                        <span>View all services</span>
                        <Icon name="ArrowRight" size={16} className="ml-2 text-secondary" />
                      </span>
                    </Link>
                  </div>
                </div>
              </Interactive>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>);

};

export default ServiceCategories;