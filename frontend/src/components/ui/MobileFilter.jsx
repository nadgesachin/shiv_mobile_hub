import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

// Bottom sheet animation variants
const bottomSheetVariants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    } 
  },
  exit: { 
    y: '100%',
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  }
};

// Range slider component
const RangeSlider = ({ min, max, value, onChange, step = 1000, prefix = '₹' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative pt-6 pb-4">
      <div className="relative h-1 bg-gray-200 rounded">
        <div 
          className="absolute h-1 bg-primary rounded"
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="absolute w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center -mt-2 -ml-2.5"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
      </div>
      
      <div className="mt-1 flex justify-between text-xs text-gray-600">
        <span>{prefix}{min.toLocaleString()}</span>
        <span>{prefix}{value.toLocaleString()}</span>
        <span>{prefix}{max.toLocaleString()}</span>
      </div>
      
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        step={step}
        onChange={e => onChange(parseInt(e.target.value))}
        className="absolute top-6 left-0 w-full opacity-0 cursor-pointer h-1"
      />
    </div>
  );
};

const MobileFilter = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: initialFilters.priceRange || 50000,
    brands: initialFilters.brands || [],
    rating: initialFilters.rating || 0,
    sortBy: initialFilters.sortBy || 'popular',
    ...initialFilters
  });
  
  // Available filter options
  const brands = [
    { id: 'apple', name: 'Apple' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'oneplus', name: 'OnePlus' },
    { id: 'xiaomi', name: 'Xiaomi' },
    { id: 'vivo', name: 'Vivo' },
    { id: 'oppo', name: 'Oppo' },
    { id: 'realme', name: 'Realme' },
    { id: 'google', name: 'Google' },
    { id: 'motorola', name: 'Motorola' },
    { id: 'iqoo', name: 'iQOO' },
    { id: 'nothing', name: 'Nothing' },
    { id: 'poco', name: 'POCO' }
  ];
  
  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'priceAsc', name: 'Price: Low to High' },
    { id: 'priceDesc', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest First' },
    { id: 'discount', name: 'Biggest Discount' }
  ];
  
  const features = [
    { id: 'fastCharging', name: 'Fast Charging' },
    { id: '5g', name: '5G' },
    { id: 'dualSim', name: 'Dual SIM' },
    { id: 'nfc', name: 'NFC' },
    { id: 'wireless', name: 'Wireless Charging' },
    { id: 'expandable', name: 'Expandable Storage' }
  ];
  
  // Handle brand selection
  const toggleBrand = (brandId) => {
    setFilters(prev => {
      if (prev.brands.includes(brandId)) {
        return { ...prev, brands: prev.brands.filter(id => id !== brandId) };
      } else {
        return { ...prev, brands: [...prev.brands, brandId] };
      }
    });
  };
  
  // Handle rating selection
  const setRating = (rating) => {
    setFilters(prev => ({ ...prev, rating }));
  };
  
  // Handle sort selection
  const setSort = (sortId) => {
    setFilters(prev => ({ ...prev, sortBy: sortId }));
  };
  
  // Handle feature selection
  const toggleFeature = (featureId) => {
    setFilters(prev => {
      const prevFeatures = prev.features || [];
      if (prevFeatures.includes(featureId)) {
        return { ...prev, features: prevFeatures.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...prevFeatures, featureId] };
      }
    });
  };
  
  // Reset filters
  const handleReset = () => {
    setFilters({
      priceRange: 50000,
      brands: [],
      rating: 0,
      sortBy: 'popular',
      features: []
    });
  };
  
  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains('overlay')) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when filter is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange < 50000) count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.rating > 0) count++;
    if (filters.sortBy !== 'popular') count++;
    if (filters.features?.length > 0) count += filters.features.length;
    return count;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 overlay">
      <AnimatePresence>
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden"
          variants={bottomSheetVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 text-xs font-bold text-white bg-primary px-1.5 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="text-sm text-gray-500"
                onClick={handleReset}
              >
                Reset
              </button>
              <button onClick={onClose}>
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>
          
          {/* Filter content - scrollable area */}
          <div className="overflow-y-auto p-4 max-h-[calc(90vh-120px)]">
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Price Range</h3>
              <RangeSlider 
                min={0} 
                max={100000} 
                value={filters.priceRange} 
                onChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))} 
              />
            </div>
            
            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSort(option.id)}
                    className={`px-3 py-1.5 text-xs rounded-full ${
                      filters.sortBy === option.id 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Brand */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Brand</h3>
              <div className="grid grid-cols-3 gap-2">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => toggleBrand(brand.id)}
                    className={`px-3 py-2 text-xs rounded-lg flex items-center justify-center ${
                      filters.brands.includes(brand.id)
                        ? 'bg-primary/10 border border-primary text-primary'
                        : 'bg-gray-100 border border-transparent text-gray-800'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Rating */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Rating</h3>
              <div className="flex space-x-2">
                {[4, 3, 2, 0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setRating(rating)}
                    className={`px-3 py-2 text-xs rounded-lg flex items-center ${
                      filters.rating === rating 
                        ? 'bg-primary/10 border border-primary' 
                        : 'bg-gray-100 border border-transparent'
                    }`}
                  >
                    {rating > 0 ? (
                      <>
                        {rating}
                        <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500 ml-0.5" />
                        <span className="ml-0.5">&up</span>
                      </>
                    ) : (
                      'Any'
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`px-3 py-2 text-xs rounded-lg flex items-center ${
                      filters.features?.includes(feature.id)
                        ? 'bg-primary/10 border border-primary text-primary'
                        : 'bg-gray-100 border border-transparent text-gray-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mr-1.5 flex items-center justify-center ${
                      filters.features?.includes(feature.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-400'
                    }`}>
                      {filters.features?.includes(feature.id) && (
                        <Icon name="Check" size={10} color="#fff" />
                      )}
                    </div>
                    {feature.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Apply button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                onApplyFilters(filters);
                onClose();
              }}
              className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MobileFilter;
