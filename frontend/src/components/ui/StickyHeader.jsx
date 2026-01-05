import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickyHeader = ({ children, className = '' }) => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if at top
      setIsAtTop(currentScrollY < 10);
      
      // Check scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsScrollingDown(true);
      } else {
        // Scrolling up
        setIsScrollingDown(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ 
        y: isScrollingDown ? -100 : 0,
      }}
      transition={{ 
        duration: 0.3,
        ease: 'easeInOut'
      }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${!isAtTop ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}
        ${className}
      `}
    >
      {children}
    </motion.header>
  );
};

export default StickyHeader;
