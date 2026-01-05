import React, { useEffect } from 'react';
import SEO from '../../components/SEO';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import QuickServiceBar from './components/QuickServiceBar';
import TrustIndicators from './components/TrustIndicators';
import ServiceCategories from './components/ServiceCategories';
import TestimonialCarousel from './components/TestimonialCarousel';
import LiveActivityFeed from './components/LiveActivityFeed';
import CTASection from './components/CTASection';
import MobileShowcase from './components/MobileShowcase';
import RecentlyViewed from '../../components/products/RecentlyViewed';

const Homepage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Shiv Mobile Hub - Your Digital Neighborhood Partner"
        description="Trusted mobile repair, recharge, bill payment, and CSC government services. Serving 10,000+ customers with expert care and digital convenience."
        keywords="mobile repair, mobile recharge, bill payment, CSC services, government services, Aadhaar, PAN card, mobile shop, digital services"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          <MobileShowcase />
          <HeroSection />
          {/* <QuickServiceBar /> */}
          {/* <TrustIndicators /> */}
          
          {/* Recently Viewed Products */}
          <div className="container mx-auto px-4 py-8">
            <RecentlyViewed />
          </div>
          
          <ServiceCategories />
          <TestimonialCarousel />
          {/* <LiveActivityFeed /> */}
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;