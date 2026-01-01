import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api';
import MobileHeader from '../../components/ui/MobileHeader';
import CompactCategoryNav from '../../components/ui/CompactCategoryNav';
import MobileProductGrid from '../../components/products/MobileProductGrid';
import SlimDealBanner from '../../components/ui/SlimDealBanner';
import Icon from '../../components/AppIcon';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

// Optimized section loading with scroll tracking
const PremiumMobileHomepage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [displaySections, setDisplaySections] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCartButton, setShowCartButton] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sections
        const sectionsResponse = await apiService.getSections();
        const activeSections = sectionsResponse.data?.sections?.filter(s => s.isActive) || [];
        setSections(activeSections);
        
        // Fetch products
        const productsResponse = await apiService.getProducts();
        setProducts(productsResponse.data?.products || []);
        
        // Initialize displayed sections
        setDisplaySections([
          { id: 'featured', title: 'Featured Products' },
          { id: 'new', title: 'New Launches' },
          { id: 'deals', title: 'Today\'s Deals' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          // Load more sections
          loadMoreSections();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current && loadingRef.current) {
        observerRef.current.unobserve(loadingRef.current);
      }
    };
  }, [loading, hasMore]);
  
  // Show/hide floating cart button based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowCartButton(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Load more sections as user scrolls
  const loadMoreSections = () => {
    setLoading(true);
    
    // Simulate loading more sections
    setTimeout(() => {
      const moreSections = [
        { id: `budget-${page}`, title: 'Under ₹15,000' },
        { id: `premium-${page}`, title: 'Premium Picks' }
      ];
      
      setDisplaySections(prev => [...prev, ...moreSections]);
      setPage(prev => prev + 1);
      
      // Stop after a reasonable number of sections
      if (page >= 3) {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 800);
  };
  
  // Filter products for each section
  const getProductsForSection = (sectionId) => {
    // Simple logic to randomize products per section (replace with actual logic)
    return products
      .sort(() => sectionId.includes('new') ? -1 : Math.random() - 0.5)
      .slice(0, 6);
  };
  
  return (
    <motion.div 
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Fixed header */}
      <motion.div variants={itemVariants}>
        <MobileHeader />
      </motion.div>
      
      {/* Category navigation */}
      <motion.div variants={itemVariants}>
        <CompactCategoryNav />
      </motion.div>
      
      {/* Featured banner */}
      <motion.div 
        variants={itemVariants}
        className="px-3 mb-5"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-36 rounded-2xl overflow-hidden relative bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <h1 className="text-white text-xl font-bold mb-1 drop-shadow-sm">iPhone 15 Series</h1>
            <p className="text-white text-sm mb-3 opacity-90">Now available with exciting offers</p>
            <button className="bg-white text-blue-600 text-xs font-bold py-2 px-4 rounded-full w-max flex items-center shadow-md">
              Shop Now
              <Icon name="ArrowRight" size={12} className="ml-1.5" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-36">
            <img
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=200&h=300"
              alt="iPhone"
              className="object-contain w-full h-full drop-shadow-lg"
            />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Product sections */}
      {displaySections.map((section, index) => (
        <motion.div 
          key={section.id}
          variants={itemVariants}
          className="mb-6"
        >
          {/* Insert deal banners between sections */}
          {index > 0 && index % 2 === 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <SlimDealBanner />
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100"
          >
            <MobileProductGrid
              title={section.title}
              products={getProductsForSection(section.id)}
              viewAllUrl={`/products-catalog?section=${section.id}`}
              loading={false}
            />
          </motion.div>
        </motion.div>
      ))}
      
      {/* Loading indicator */}
      {hasMore && (
        <div ref={loadingRef} className="py-6 flex justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full"
          ></motion.div>
        </div>
      )}
      
      {/* Floating cart button */}
      <AnimatePresence>
        {showCartButton && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-5 z-40"
          >
            <button className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg flex items-center justify-center">
              <Icon name="ShoppingCart" size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">3</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumMobileHomepage;
