import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

// Predefined category data with optimized structure
const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone', color: 'bg-blue-500' },
  { id: 'budget', name: 'Budget', icon: 'Wallet', color: 'bg-green-500' },
  { id: 'premium', name: 'Premium', icon: 'Award', color: 'bg-purple-500' },
  { id: 'accessories', name: 'Accessories', icon: 'Cable', color: 'bg-orange-500' },
  { id: 'cases', name: 'Cases', icon: 'Package', color: 'bg-pink-500' },
  { id: 'headphones', name: 'Audio', icon: 'Headphones', color: 'bg-red-500' },
  { id: 'chargers', name: 'Chargers', icon: 'Battery', color: 'bg-yellow-500' },
  { id: 'wearables', name: 'Wearables', icon: 'Watch', color: 'bg-teal-500' },
  { id: 'tablets', name: 'Tablets', icon: 'Tablet', color: 'bg-indigo-500' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad', color: 'bg-rose-500' },
  { id: 'camera', name: 'Camera', icon: 'Camera', color: 'bg-cyan-500' },
  { id: 'new', name: 'New', icon: 'Zap', color: 'bg-amber-500' },
];

const CompactCategoryNav = () => {
  const scrollRef = useRef(null);

  // Set up snap scrolling behavior
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel);
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="mb-3 mt-[70px] pt-2"> {/* Account for fixed header height */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar pb-2 px-3 gap-3 snap-x snap-mandatory"
      >
        {categories.map((category) => (
          <Link 
            to={`/products-catalog?category=${category.id}`} 
            key={category.id}
            className="snap-start"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center shadow-sm mb-1`}>
                <Icon name={category.icon} size={22} color="#fff" />
              </div>
              <span className="text-xs font-medium truncate w-14 text-center">
                {category.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-1.5">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full ${i === 0 ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactCategoryNav;
