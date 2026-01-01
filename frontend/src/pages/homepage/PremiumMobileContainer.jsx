import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PremiumMobileHomepage from './PremiumMobileHomepage';
import Homepage from './index';

// This container component decides which homepage to show based on device
const PremiumMobileContainer = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device on component mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      const mobileMaxWidth = 768; // Consider devices below this width as mobile
      setIsMobile(window.innerWidth < mobileMaxWidth);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Shiv Mobile Hub - Premium Mobile Experience</title>
        <meta
          name="description"
          content="Explore our premium selection of smartphones, accessories and digital services with an enhanced shopping experience."
        />
        <meta
          name="keywords"
          content="mobile shop, premium phones, smartphone accessories, mobile cases, headphones, tech gadgets"
        />
        <meta property="og:title" content="Shiv Mobile Hub - Premium Mobile Experience" />
        <meta
          property="og:description"
          content="Discover premium mobile products with our enhanced shopping experience"
        />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0067DE" />
      </Helmet>
      
      {isMobile ? <PremiumMobileHomepage /> : <Homepage />}
    </>
  );
};

export default PremiumMobileContainer;
