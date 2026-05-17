import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Premium Mobile Phones & Accessories",
      subtitle: "Genuine products with warranty",
      description: "Your trusted local mobile shop with 10+ years of service",
      image: "/api/placeholder/1200/600",
      cta: { label: "Browse Products", href: "/products-catalog" },
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Expert Repair Services",
      subtitle: "Quick & reliable solutions",
      description: "Professional technicians for all mobile repair needs",
      image: "/api/placeholder/1200/600",
      cta: { label: "View Services", href: "/services-hub" },
      gradient: "from-green-600 to-teal-600"
    },
    {
      title: "Exclusive Deals & Offers",
      subtitle: "Save on top brands",
      description: "Latest phones at best prices with exchange offers",
      image: "/api/placeholder/1200/600",
      cta: { label: "View Offers", href: "/products-catalog?filter=offers" },
      gradient: "from-orange-600 to-red-600"
    }
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const trustBadges = [
    { icon: "Shield", text: "100% Genuine" },
    { icon: "Clock", text: "10+ Years" },
    { icon: "Award", text: "Trusted Shop" },
    { icon: "Headphones", text: "24/7 Support" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 items-center w-full"
            >
              {/* Text Content */}
              <div className="space-y-6">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`mt-4 text-2xl font-semibold bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-lg text-gray-600"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </div>

                {/* CTAs */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to={slides[currentSlide].cta.href}>
                    <Button 
                      size="lg" 
                      className={`bg-gradient-to-r ${slides[currentSlide].gradient} text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                    >
                      {slides[currentSlide].cta.label}
                      <Icon name="ArrowRight" size={20} className="ml-2" />
                    </Button>
                  </Link>
                  
                  <Link to="/contact">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="px-8 py-3 text-lg font-semibold"
                    >
                      <Icon name="MessageCircle" size={20} className="mr-2" />
                      Enquire Now
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
                >
                  {trustBadges.map((badge, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center space-x-2 bg-white/80 backdrop-blur rounded-lg p-3 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                        <Icon name={badge.icon} size={20} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Image/Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Background decoration */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-20 blur-3xl`} />
                  
                  {/* Main image */}
                  <img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title}
                    className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                  />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Star" size={24} className="text-yellow-500 fill-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">4.9</p>
                        <p className="text-xs text-gray-600">10K+ Reviews</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={24} className="text-primary" />
                      <div>
                        <p className="text-2xl font-bold">50K+</p>
                        <p className="text-xs text-gray-600">Happy Customers</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'w-8 bg-primary' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-gray-600">Products Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
