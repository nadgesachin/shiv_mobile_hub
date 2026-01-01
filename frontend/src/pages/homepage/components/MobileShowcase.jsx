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
import ProductSection from './ProductSection';

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
  const [quickCategories, setQuickCategories] = useState([]);

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
    getQuickCategories();
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
  // const quickCategories = [
  //   {
  //     id: 'smartphones',
  //     name: 'Smartphones',
  //     icon: 'Smartphone',
  //     gradient: 'from-primary to-secondary',
  //     link: '/products-catalog'
  //   },
  //   {
  //     id: 'audio',
  //     name: 'Audio',
  //     icon: 'Headphones',
  //     gradient: 'from-secondary to-accent',
  //     link: '/products-catalog'
  //   },
  //   {
  //     id: 'wearables',
  //     name: 'Watch',
  //     icon: 'Watch',
  //     gradient: 'from-accent to-secondary',
  //     link: '/products-catalog'
  //   },
  //   {
  //     id: 'tablets',
  //     name: 'Tablets',
  //     icon: 'Tablet',
  //     gradient: 'from-secondary-dark to-secondary',
  //     link: '/products-catalog'
  //   },
  //   {
  //     id: 'accessories',
  //     name: 'Accessories',
  //     icon: 'Cable',
  //     gradient: 'from-accent to-accent-dark',
  //     link: '/products-catalog'
  //   },
  //   {
  //     id: 'cases',
  //     name: 'Cases',
  //     icon: 'Package',
  //     gradient: 'from-primary-dark to-primary',
  //     link: '/products-catalog'
  //   }
  // ];

  async function getQuickCategories() {
    try {
      const res = await apiService.getCategories(); // same API jaha se ye data aa raha hai

      const formatted = res.data
        .filter(cat => cat.isActive)
        .sort((a, b) => a.order - b.order)
        .map(cat => ({
          id: cat._id,
          name: cat.name,
          icon: cat.icon || 'Grid',
          image: cat.image,
          link:
            cat.type === 'service'
              ? `/services-hub/${cat.slug}`
              : `/products-catalog?category=${cat.slug}`
        }));

      setQuickCategories(formatted);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }

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
    <section className="overflow-hidden bg-gradient-to-b from-white via-white to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-full blur-3xl" />

        {/* Header */}
        {/* <motion.div 
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
        </motion.div> */}

        {/* Quick access category cards - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto no-scrollbar pb-2">
            {quickCategories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex-shrink-0"
              >
                <Interactive>
                  <Link to={category.link} className="block">
                    <div className="flex flex-col items-center p-4 w-[110px] hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-sm overflow-hidden
    ${category.image ? 'bg-white' : 'bg-gradient-to-br from-primary to-secondary'}
  `}
                      >
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-9 h-9 object-contain scale-110"
                          />

                        ) : (
                          <Icon name={category.icon} size={24} color="white" />
                        )}
                      </div>

                      <span className="text-[10px] text-center text-foreground font-medium truncate w-full">
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

          return (
            <ProductSection key={section._id} section={section} products={sectionProducts} />
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