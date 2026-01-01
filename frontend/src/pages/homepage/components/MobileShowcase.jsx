import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import apiService from '../../../services/api';
import { HoverScale, ScaleIn, ShimmerLoader, Interactive } from '../../../components/ui/animations';
import MobileSwipe from '../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../hooks/useViewport';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
};

// Animation variants for carousel items
const carouselVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
};

const MobileShowcase = () => {
  // Get viewport details for responsive behavior
  const viewport = useViewport();

  // Current active category
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State for sections and products
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swipeDirection, setSwipeDirection] = useState(0); // For animations
  
  // State for carousel indices - dynamic based on sections
  const [slideIndices, setSlideIndices] = useState({});

  // Track loading states for lazy loading
  const [loadedImages, setLoadedImages] = useState({});

  // Track if component is mounted for animation purposes
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  async function getSections() {
    try {
      const response = await apiService.getSections();
      setSections(response.data?.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  }

  async function getProducts() {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  // Fetch sections and products from backend
  useEffect(() => {
    getSections();
    getProducts();
  }, []);
  
  // Reference to scroll containers - dynamic based on sections
  const sectionRefs = useRef({});
  
  // Get products for a specific section, filtered by section ID
  const getSectionProducts = (sectionId) => {
    return products
      .filter(product => 
        product.isActive && 
        product.sections && 
        product.sections.some(sectionObj => sectionObj._id.toString() === sectionId.toString())
      )
      .slice(0, 8)
      .map(product => ({
        id: product._id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.originalPrice > product.price 
          ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF` 
          : null,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1707410420102-faff6eb0e033',
        badgeText: product.badge,
        badgeColor: product.badge === 'New Arrival' ? 'from-secondary to-accent text-white' : 
                   product.badge === 'Bestseller' ? 'from-accent to-secondary text-white' :
                   'from-primary to-secondary text-white',
        link: `/products-catalog`
      }));
  };

  // Enhanced quick access category cards
  const quickCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      icon: 'Smartphone',
      gradient: 'from-primary to-secondary',
      link: '/products-catalog'
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: 'Headphones',
      gradient: 'from-secondary to-accent',
      link: '/products-catalog'
    },
    {
      id: 'wearables',
      name: 'Watch',
      icon: 'Watch',
      gradient: 'from-accent to-secondary',
      link: '/products-catalog'
    },
    {
      id: 'tablets',
      name: 'Tablets',
      icon: 'Tablet',
      gradient: 'from-secondary-dark to-secondary',
      link: '/products-catalog'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: 'Cable',
      gradient: 'from-accent to-accent-dark',
      link: '/products-catalog'
    },
    {
      id: 'cases',
      name: 'Cases',
      icon: 'Package',
      gradient: 'from-primary-dark to-primary',
      link: '/products-catalog'
    }
  ];

  // Handling carousel navigation with animation
  const handleCarouselNavigation = (direction, sectionId, productsLength) => {
    const currentIndex = slideIndices[sectionId] || 0;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, productsLength - 1);
      setSwipeDirection(1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
      setSwipeDirection(-1);
    }
    
    setSlideIndices(prev => ({
      ...prev,
      [sectionId]: newIndex
    }));
    
    // Scroll the container for larger screens
    if (!viewport.isMobile) {
      const container = sectionRefs.current[sectionId];
      if (container) {
        const cardWidth = viewport.isTablet ? 280 : 320;
        container.scrollTo({
          left: newIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // Format price with Indian currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Handle image loading
  const handleImageLoaded = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Loading state with shimmer effects
  if (loading) {
    return (
      <section className="py-8 lg:py-16 overflow-hidden bg-gradient-to-b from-white via-white to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading shimmer */}
          <div className="mb-8 flex flex-col items-center">
            <ShimmerLoader width="240px" height="32px" className="mb-4 rounded-xl" />
            <ShimmerLoader width="160px" height="20px" className="rounded-lg" />
          </div>
          
          {/* Category cards shimmer */}
          <div className="mb-10">
            <ShimmerLoader width="200px" height="26px" className="mb-4 rounded-lg" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <ShimmerLoader width="100%" height="80px" className="rounded-xl" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Products shimmer */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <ShimmerLoader width="180px" height="26px" className="rounded-lg" />
              <div className="flex space-x-2">
                <ShimmerLoader width="32px" height="32px" className="rounded-full" />
                <ShimmerLoader width="32px" height="32px" className="rounded-full" />
              </div>
            </div>
            <div className="flex space-x-4 overflow-hidden pb-4">
              {[...Array(3)].map((_, i) => (
                <ShimmerLoader 
                  key={i} 
                  width="280px" 
                  height="360px" 
                  className="rounded-xl flex-shrink-0" 
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state with animation
  if (error) {
    return (
      <section className="py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-white via-white to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              <Icon name="AlertTriangle" size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Products</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Interactive>
              <button
                onClick={() => {
                  setLoading(true);
                  setError('');
                  getSections();
                  getProducts();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="RefreshCw" size={16} />
                  Try Again
                </span>
              </button>
            </Interactive>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-white via-white to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-full blur-3xl" />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-headline font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Mobile Showcase
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Discover the latest in mobile technology with premium selections
          </p>
        </motion.div>

        {/* Quick access category cards - Redesigned */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Icon name="Grid" size={20} className="mr-2 text-secondary" />
            Browse By Category
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {quickCategories.map((category, idx) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
              >
                <Interactive>
                  <Link to={category.link} className="block">
                    <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                        <Icon name={category.icon} size={24} color="white" />
                      </div>
                      <span className="text-sm text-center text-foreground font-medium">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                </Interactive>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Sections with enhanced UI */}
        {sections.length > 0 && sections.map((section, sectionIdx) => {
          const sectionProducts = getSectionProducts(section._id);
          if (sectionProducts.length === 0) return null; // Hide sections with no products
          const currentIndex = slideIndices[section._id] || 0;
          
          return (
            <motion.div 
              key={section._id} 
              className="mb-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * sectionIdx }}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-foreground flex items-center">
                    <Icon 
                      name={section.icon || 'ShoppingBag'} 
                      size={22} 
                      className="mr-2 text-secondary" 
                    />
                    {section.title}
                  </h3>
                  {section.name === 'Flash Deals' && (
                    <div className="ml-3 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-accent to-secondary text-white shadow-sm flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      Ending Soon
                    </div>
                  )}
                </div>
                
                {/* Carousel Navigation Controls - Desktop */}
                {sectionProducts.length > 1 && !viewport.isMobile && (
                  <div className="flex space-x-2">
                    <Interactive>
                      <button 
                        onClick={() => handleCarouselNavigation('prev', section._id, sectionProducts.length)}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm transition-all duration-300 ${
                          currentIndex === 0 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-md hover:-translate-y-1'
                        }`}
                        aria-label="Previous"
                      >
                        <Icon name="ChevronLeft" size={20} className="text-primary" />
                      </button>
                    </Interactive>
                    <Interactive>
                      <button 
                        onClick={() => handleCarouselNavigation('next', section._id, sectionProducts.length)}
                        disabled={currentIndex === sectionProducts.length - 1}
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm transition-all duration-300 ${
                          currentIndex === sectionProducts.length - 1 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-md hover:-translate-y-1'
                        }`}
                        aria-label="Next"
                      >
                        <Icon name="ChevronRight" size={20} className="text-primary" />
                      </button>
                    </Interactive>
                  </div>
                )}
              </div>
              
              {/* Mobile-friendly carousel with swipe gestures */}
              <MobileSwipe
                onSwipeLeft={() => handleCarouselNavigation('next', section._id, sectionProducts.length)}
                onSwipeRight={() => handleCarouselNavigation('prev', section._id, sectionProducts.length)}
                className="touch-pan-y"
              >
                <div 
                  className="flex space-x-5 overflow-x-auto hide-scrollbar pb-6 pt-2 px-1" 
                  ref={el => sectionRefs.current[section._id] = el}
                >
                  {sectionProducts.map((product, idx) => (
                    <motion.div
                      key={product.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                      className="flex-none w-[280px] sm:w-[320px]"
                    >
                      <Interactive>
                        <Link to={product.link} className="block h-full">
                          <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col relative">
                            {/* Image container with loading state */}
                            <div className="relative aspect-square overflow-hidden">
                              {!loadedImages[product.id] && (
                                <div className="absolute inset-0 bg-gray-50">
                                  <ShimmerLoader className="w-full h-full" />
                                </div>
                              )}
                              <motion.img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onLoad={() => handleImageLoaded(product.id)}
                                style={{ opacity: loadedImages[product.id] ? 1 : 0 }}
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                              />
                              
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Badges */}
                              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
                                {product.discount && (
                                  <motion.div 
                                    className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-accent to-accent-light text-white shadow-md flex items-center gap-1"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <Icon name="Zap" size={12} />
                                    {product.discount}
                                  </motion.div>
                                )}
                                
                                {product.badgeText && (
                                  <motion.div 
                                    className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${product.badgeColor} shadow-md`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    {product.badgeText}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            {/* Product details */}
                            <div className="p-5 flex flex-col flex-1">
                              <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
                                {product.title}
                              </h3>
                              
                              {/* Price section */}
                              <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-lg font-bold text-secondary">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Stock and rating info */}
                              <div className="mt-auto pt-3 flex items-center justify-between">
                                <div className="text-xs text-emerald-600 font-medium flex items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                  In Stock
                                </div>
                                
                                <div className="flex items-center">
                                  <Icon name="Star" size={12} className="text-amber-400 fill-amber-400" />
                                  <span className="text-xs font-medium ml-1">4.8</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Interactive>
                    </motion.div>
                  ))}
                </div>
              </MobileSwipe>
              
              {/* Pagination dots for mobile */}
              {sectionProducts.length > 1 && viewport.isMobile && (
                <div className="flex justify-center mt-3">
                  {sectionProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCarouselNavigation(index > currentIndex ? 'next' : 'prev', section._id, sectionProducts.length)}
                      className="focus:outline-none px-1"
                      aria-label={`Go to product ${index + 1}`}
                    >
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index 
                          ? 'bg-gradient-to-r from-secondary to-accent w-8' 
                          : 'bg-gray-200 w-2'}`} 
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* View All Products Button */}
        <div className="text-center mt-8">
          <Interactive>
            <Link to="/products-catalog">
              <Button 
                variant="default" 
                size="lg"
                className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg px-8 py-3"
              >
                View All Products
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Link>
          </Interactive>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;