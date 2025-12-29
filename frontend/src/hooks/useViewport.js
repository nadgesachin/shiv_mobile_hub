import { useState, useEffect } from 'react';

/**
 * A hook to detect viewport size and device type
 * @returns {Object} Viewport information and device type booleans
 */
const useViewport = () => {
  // Initialize with server-safe defaults
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait',
    isLandscape: false,
    isPortrait: true
  });

  // Set up listener for viewport changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Initialize with real values
      updateViewport();
      
      // Set up listener
      const handleResize = () => {
        updateViewport();
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);
  
  // Helper to update all viewport values
  const updateViewport = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Determine device type based on width
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    
    // Determine orientation
    const isLandscape = width > height;
    const isPortrait = !isLandscape;
    const orientation = isPortrait ? 'portrait' : 'landscape';
    
    setViewport({
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      orientation,
      isLandscape,
      isPortrait
    });
  };
  
  return viewport;
};

export default useViewport;
