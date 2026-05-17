import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const HorizontalScrollSection = ({ 
  title, 
  subtitle,
  children, 
  showArrows = true,
  showDots = false,
  autoScroll = false,
  scrollInterval = 5000,
  gradient = 'from-purple-600 to-pink-600',
  viewAllLink = null
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll availability
  const checkScrollAvailability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current index for dots
      const cardWidth = scrollRef.current.firstChild?.offsetWidth || 300;
      setCurrentIndex(Math.round(scrollLeft / cardWidth));
    }
  };

  useEffect(() => {
    checkScrollAvailability();
    const scrollContainer = scrollRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollAvailability);
      window.addEventListener('resize', checkScrollAvailability);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollAvailability);
      }
      window.removeEventListener('resize', checkScrollAvailability);
    };
  }, []);

  // Auto scroll functionality
  useEffect(() => {
    if (autoScroll && !isDragging) {
      const interval = setInterval(() => {
        handleScroll('right', true);
      }, scrollInterval);

      return () => clearInterval(interval);
    }
  }, [autoScroll, isDragging, scrollInterval]);

  const handleScroll = (direction, auto = false) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild?.offsetWidth || 300;
      const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time
      const currentScroll = scrollRef.current.scrollLeft;
      
      if (direction === 'left') {
        scrollRef.current.scrollTo({
          left: Math.max(0, currentScroll - scrollAmount),
          behavior: 'smooth'
        });
      } else {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const nextScroll = currentScroll + scrollAmount;
        
        // If auto-scrolling and reached end, reset to beginning
        if (auto && nextScroll >= maxScroll) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({
            left: Math.min(maxScroll, nextScroll),
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch drag functionality
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const totalItems = React.Children.count(children);
  const dotsCount = Math.ceil(totalItems / 3); // Assuming 3 items visible at a time

  return (
    <div className="relative py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 px-4 lg:px-0">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mt-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        {viewAllLink && (
          <motion.a
            href={viewAllLink}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-full font-semibold hover:shadow-xl transition-all`}
          >
            View All
            <Icon name="ArrowRight" size={18} />
          </motion.a>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <AnimatePresence>
          {showArrows && canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Icon name="ChevronLeft" size={24} className="text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {showArrows && canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Icon name="ChevronRight" size={24} className="text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className={`
            flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            scroll-smooth px-4 lg:px-0
          `}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {children}
        </div>

        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 lg:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-4 w-8 lg:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

      {/* Dots Indicator */}
      {showDots && dotsCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {[...Array(dotsCount)].map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                const cardWidth = scrollRef.current?.firstChild?.offsetWidth || 300;
                scrollRef.current?.scrollTo({
                  left: index * cardWidth * 3,
                  behavior: 'smooth'
                });
              }}
              className={`
                h-2 rounded-full transition-all duration-300
                ${currentIndex === index 
                  ? `w-8 bg-gradient-to-r ${gradient}` 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                }
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Mobile View All Button */}
      {viewAllLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-6 px-4"
        >
          <a
            href={viewAllLink}
            className={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-2xl font-semibold`}
          >
            View All
            <Icon name="ArrowRight" size={18} />
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default HorizontalScrollSection;
