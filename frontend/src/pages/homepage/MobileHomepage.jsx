import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api';
import MobileHeader from '../../components/ui/MobileHeader';
import CompactCategoryNav from '../../components/ui/CompactCategoryNav';
import MobileProductGrid from '../../components/products/MobileProductGrid';
import SlimDealBanner from '../../components/ui/SlimDealBanner';
import ShopLocationMap from '../../components/ui/ShopLocationMap';
import Icon from '../../components/AppIcon';

// Optimized section loading with scroll tracking
const MobileHomepage = () => {
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
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Fixed header */}
      <MobileHeader />
      
      {/* Category navigation */}
      <CompactCategoryNav />
      
      {/* Featured banner (simplified hero) */}
      <div className="px-3 mb-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-36 rounded-lg overflow-hidden relative bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="absolute inset-0 flex flex-col justify-center px-4">
            <h1 className="text-white text-lg font-bold mb-1">iPhone 15 Series</h1>
            <p className="text-white text-sm mb-3 opacity-90">Now available with exciting offers</p>
            <button className="bg-white text-blue-600 text-xs font-bold py-1.5 px-3 rounded-full w-max flex items-center">
              Shop Now
              <Icon name="ArrowRight" size={12} className="ml-1" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-32">
            <img
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=200&h=300"
              alt="iPhone"
              className="object-contain w-full h-full"
            />
          </div>
        </motion.div>
      </div>
      
      {/* First product grid */}
      {displaySections.map((section, index) => (
        <React.Fragment key={section.id}>
          {/* Insert deal banners between sections */}
          {index > 0 && index % 2 === 0 && (
            <SlimDealBanner />
          )}
          
          <MobileProductGrid
            title={section.title}
            products={getProductsForSection(section.id)}
            viewAllUrl={`/products-catalog?section=${section.id}`}
            loading={false}
            layout="horizontal"
          />
        </React.Fragment>
      ))}
      
      {/* Loading indicator */}
      {hasMore && (
        <div ref={loadingRef} className="py-6 flex justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Shop Location Map */}
      <div className="px-3 mt-4">
        <ShopLocationMap />
      </div>
      
      {/* Floating cart button */}
      <AnimatePresence>
        {showCartButton && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <button className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
              <Icon name="ShoppingCart" size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHomepage;
