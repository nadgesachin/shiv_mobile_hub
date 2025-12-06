import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
  {
    id: 1,
    title: "Your Digital Neighborhood Partner",
    subtitle: "Mobile Services • Government Solutions • Digital Convenience",
    description: "Experience seamless mobile repairs, instant recharges, and trusted CSC services - all under one roof",
    image: "https://images.unsplash.com/photo-1727893160805-5594ae240044",
    imageAlt: "Modern mobile phone repair shop interior with bright lighting, organized workstations, and professional technicians working on smartphone repairs",
    cta: { text: "Explore Services", link: "/services-hub" },
    badge: "Trusted by 10,000+ Customers"
  },
  {
    id: 2,
    title: "Government Services Made Simple",
    subtitle: "CSC Authorized Center • Document Services • Digital India",
    description: "Get Aadhaar, PAN, passport services and more with expert guidance and hassle-free processing",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12e261fe6-1764490677232.png",
    imageAlt: "Professional customer service representative helping elderly person with government document application on computer in bright modern office setting",
    cta: { text: "Visit CSC Portal", link: "/csc-portal" },
    badge: "ISO Certified Services"
  },
  {
    id: 3,
    title: "Latest Mobiles & Accessories",
    subtitle: "Genuine Products • Best Prices • Expert Advice",
    description: "Discover the newest smartphones, accessories, and gadgets with warranty and after-sales support",
    image: "https://images.unsplash.com/photo-1601204670778-c897b096f907",
    imageAlt: "Display of latest smartphones and mobile accessories arranged on modern retail counter with bright LED lighting and organized product presentation",
    cta: { text: "Browse Products", link: "/products-catalog" },
    badge: "Authorized Dealer"
  }];


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [heroSlides?.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 z-10">
            {/* <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full">
              <Icon name="Shield" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">
                {heroSlides?.[currentSlide]?.badge}
              </span>
            </div> */}

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-foreground leading-tight">
                {heroSlides?.[currentSlide]?.title}
              </h1>
              <p className="text-lg sm:text-xl text-primary font-medium">
                {heroSlides?.[currentSlide]?.subtitle}
              </p>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                {heroSlides?.[currentSlide]?.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={heroSlides?.[currentSlide]?.cta?.link}>
                <Button variant="default" size="lg" iconName="ArrowRight" iconPosition="right" fullWidth>
                  {heroSlides?.[currentSlide]?.cta?.text}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" iconName="Phone" iconPosition="left" fullWidth>
                  Contact Us
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              {heroSlides?.map((_, index) =>
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-12 bg-primary' : 'w-2 bg-muted'}`
                }
                aria-label={`Go to slide ${index + 1}`} />

              )}
            </div>
          </div>

          {/* <div className="relative lg:h-[500px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
            <div className="relative h-full rounded-2xl overflow-hidden shadow-strong">
              <Image
                src={heroSlides?.[currentSlide]?.image}
                alt={heroSlides?.[currentSlide]?.imageAlt}
                className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>);

};

export default HeroSection;