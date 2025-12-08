import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
const Homepage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shiv Mobile Hub - Your Digital Neighborhood Partner | Mobile Services & Government Solutions</title>
        <meta
          name="description"
          content="Trusted mobile repair, recharge, bill payment, and CSC government services. Serving 10,000+ customers with expert care and digital convenience."
        />
        <meta
          name="keywords"
          content="mobile repair, mobile recharge, bill payment, CSC services, government services, Aadhaar, PAN card, mobile shop, digital services"
        />
        <meta property="og:title" content="Shiv Mobile Hub - Your Digital Neighborhood Partner" />
        <meta
          property="og:description"
          content="Comprehensive mobile and digital services with trusted CSC government solutions"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          <MobileShowcase />
          <HeroSection />
          {/* <QuickServiceBar /> */}
          {/* <TrustIndicators /> */}
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