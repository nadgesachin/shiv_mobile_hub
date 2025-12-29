import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MobileHomepage from './MobileHomepage';
import Homepage from './index';

// This container component decides which homepage to show based on device
const MobileHomepageContainer = () => {
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      
      {isMobile ? <MobileHomepage /> : <Homepage />}
    </>
  );
};

export default MobileHomepageContainer;
