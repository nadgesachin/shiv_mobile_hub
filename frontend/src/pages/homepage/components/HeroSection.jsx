import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { SlideUp, SlideRight, Float, FadeIn, GradientText } from '../../../components/ui/animations';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Your Digital Neighborhood Partner",
      subtitle: "Mobile Services • Government Solutions • Digital Convenience",
      description: "Experience seamless mobile repairs, instant recharges, and trusted CSC services - all under one roof",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      imageAlt: "Latest iPhone with vibrant screen floating against minimal background",
      cta: { text: "Explore Services", link: "/services-hub" },
      badge: "Trusted by 10,000+ Customers"
    },
    {
      id: 2,
      title: "Government Services Made Simple",
      subtitle: "CSC Authorized Center • Document Services • Digital India",
      description: "Get Aadhaar, PAN, passport services and more with expert guidance and hassle-free processing",
      image: "https://images.unsplash.com/photo-1581993192008-63e896f4f744?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      imageAlt: "Professional document and government services",
      cta: { text: "Visit CSC Portal", link: "/csc-portal" },
      badge: "ISO Certified Services"
    },
    {
      id: 3,
      title: "Latest Mobiles & Accessories",
      subtitle: "Genuine Products • Best Prices • Expert Advice",
      description: "Discover the newest smartphones, accessories, and gadgets with warranty and after-sales support",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=836&q=80",
      imageAlt: "Modern smartphone with premium accessories",
      cta: { text: "Browse Products", link: "/products-catalog" },
      badge: "Authorized Dealer"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Background blob positions
  const blobs = [
    { top: '10%', left: '10%', size: '300px', color: 'from-secondary/20 to-accent/5' },
    { top: '60%', right: '5%', size: '350px', color: 'from-accent/10 to-primary/5' },
    { top: '30%', left: '60%', size: '250px', color: 'from-primary/15 to-secondary/10' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50 py-12 lg:py-24">
      {/* Background blobs/gradients */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-orange-purple-yellow opacity-60 blur-3xl`}
          style={{ 
            width: blob.size, 
            height: blob.size,
            top: blob.top, 
            left: blob.left,
            right: blob.right
          }}
          animate={{
            scale: [0.8, 1.1, 0.9],
            opacity: [0.5, 0.6, 0.5],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 10 + i * 2,
          }}
        />
      ))}

      {/* Background grid pattern for depth */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] pointer-events-none"
        style={{ backgroundSize: '30px 30px' }}
      />
      
      {/* Main hero content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column with text content */}
          <div className="space-y-8">
            {/* Trust badge */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`badge-${currentSlide}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="badge-premium inline-flex items-center space-x-2 px-4 py-2 backdrop-blur-sm rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {heroSlides[currentSlide].badge}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Hero title & content - animated slide transition */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-headline font-bold leading-tight">
                    <GradientText from="from-primary-dark" via="via-secondary" to="to-accent">
                      {heroSlides[currentSlide].title}
                    </GradientText>
                  </h1>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`subtitle-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-lg sm:text-xl font-medium text-secondary">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`desc-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                    {heroSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to={heroSlides[currentSlide].cta.link}>
                  <Button 
                    variant="default" 
                    size="lg" 
                    iconName="ArrowRight" 
                    iconPosition="right" 
                    fullWidth
                    className="button-premium rounded-xl transition-all duration-300 px-8 py-3 text-base"
                  >
                    {heroSlides[currentSlide].cta.text}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    iconName="Phone" 
                    iconPosition="left" 
                    fullWidth
                    className="rounded-xl border-2 border-gray-200 hover:border-gray-300 px-8 py-3 text-base bg-white/70 backdrop-blur-sm transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            <div className="flex items-center space-x-3 pt-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className="group focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === index 
                    ? 'w-10 bg-gradient-to-r from-primary to-secondary' 
                    : 'w-6 bg-gray-200 group-hover:bg-gray-300 group-hover:w-8'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right column with phone image */}
          <div className="relative hidden lg:block h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`phone-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.5 }}
                className="relative h-full"
              >
                {/* Background decorative elements */}
                <div className="absolute w-64 h-64 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-xl -z-10 top-1/3 -right-10" />
                <div className="absolute w-40 h-40 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-lg -z-10 bottom-20 left-10" />
                
                {/* Main phone image with floating animation */}
                <Float duration={4} distance={15} className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Decorative circles */}
                    <svg width="500" height="500" viewBox="0 0 500 500" fill="none" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20">
                      <motion.circle 
                        cx="250" 
                        cy="250" 
                        r="180" 
                        stroke="url(#gradient1)" 
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.circle 
                        cx="250" 
                        cy="250" 
                        r="220" 
                        stroke="url(#gradient2)" 
                        strokeWidth="1"
                        strokeDasharray="6 6"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      />
                      <defs>
                        <linearGradient id="gradient1" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#7e22ce" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="500" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#7e22ce" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Phone image with shadow */}
                    <div className="relative z-10">
                      <div className="absolute inset-0 blur-2xl bg-black/20 opacity-30 -z-10 scale-75 translate-y-12 rounded-full" />
                      <img 
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].imageAlt}
                        className="h-[480px] w-auto object-contain rounded-3xl shadow-2xl"
                      />
                    </div>

                    {/* Highlight effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent rounded-3xl pointer-events-none" />
                  </div>
                </Float>

                {/* Floating features indicators */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute top-1/4 left-0"
                >
                  <Float duration={5} distance={8} delay={0.3}>
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white">
                          <Icon name="Check" size={12} />
                        </div>
                        <span className="font-medium text-sm">{currentSlide === 0 ? 'Expert Support' : currentSlide === 1 ? 'Quick Processing' : 'Premium Quality'}</span>
                      </div>
                    </div>
                  </Float>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-1/4 right-0"
                >
                  <Float duration={4} distance={8} delay={0.6}>
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white">
                          <Icon name="Star" size={12} />
                        </div>
                        <span className="font-medium text-sm">{currentSlide === 0 ? '5-Star Service' : currentSlide === 1 ? 'Trusted Partner' : 'Warranty Assured'}</span>
                      </div>
                    </div>
                  </Float>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;