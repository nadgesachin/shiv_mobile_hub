import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const SlimDealBanner = ({ deals = [] }) => {
  const [currentDeal, setCurrentDeal] = useState(0);
  const bannerRef = useRef(null);
  
  // Default deals if none provided
  const defaultDeals = [
    {
      id: 1,
      title: 'iPhone 15 Pro - ₹5,000 Off with HDFC Cards',
      gradient: 'from-blue-500 to-purple-600',
      icon: 'Zap',
      link: '/products-catalog?category=premium'
    },
    {
      id: 2,
      title: 'Weekend Sale! Up to 40% Off on Accessories',
      gradient: 'from-orange-500 to-red-500',
      icon: 'Tag',
      link: '/products-catalog?category=accessories'
    },
    {
      id: 3,
      title: 'Free Screen Guard with Every Phone Case',
      gradient: 'from-green-500 to-teal-500',
      icon: 'Gift',
      link: '/products-catalog?category=cases'
    }
  ];
  
  const dealsToShow = deals.length > 0 ? deals : defaultDeals;
  
  // Handle swipe
  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setCurrentDeal((prev) => (prev + 1) % dealsToShow.length);
    } else {
      setCurrentDeal((prev) => (prev - 1 + dealsToShow.length) % dealsToShow.length);
    }
  };
  
  // Track touch for swipe
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    
    if (Math.abs(diff) > 30) { // Minimum swipe distance
      handleSwipe(diff > 0 ? 'left' : 'right');
    }
    
    touchStart.current = null;
  };
  
  return (
    <div className="px-3 mb-4">
      <div 
        ref={bannerRef}
        className="relative overflow-hidden rounded-lg h-14"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {dealsToShow.map((deal, index) => (
          <Link to={deal.link} key={deal.id}>
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${deal.gradient} p-3 flex items-center justify-between`}
              initial={{ x: index === currentDeal ? 0 : (index < currentDeal ? '-100%' : '100%'), opacity: index === currentDeal ? 1 : 0 }}
              animate={{ x: index === currentDeal ? 0 : (index < currentDeal ? '-100%' : '100%'), opacity: index === currentDeal ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center mr-3">
                  <Icon name={deal.icon} size={18} color="#fff" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{deal.title}</p>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} color="#fff" />
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Pagination indicators */}
      <div className="flex justify-center mt-2 space-x-1.5">
        {dealsToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentDeal(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentDeal === index ? 'bg-primary w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlimDealBanner;
