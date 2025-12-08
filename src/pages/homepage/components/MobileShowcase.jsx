import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import apiService from '../../../services/api';

// Swipeable component to support mobile touch gestures
const SwipeableContainer = ({ children, onSwipeLeft, onSwipeRight }) => {
  const containerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft?.();
    }
    if (isRightSwipe) {
      onSwipeRight?.();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

const MobileShowcase = () => {
  // Current active category
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State for sections and products
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for carousel indices - dynamic based on sections
  const [slideIndices, setSlideIndices] = useState({});

  async function getSections() {
    try {
      const response = await apiService.getSections();
      setSections(response.data?.sections);
      console.log("sections: ",response.data?.sections);
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
      console.log("products: ",response.data.products);
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
    getSections()
    getProducts()
  }, []);
  
  // Reference to scroll containers - dynamic based on sections
  const sectionRefs = useRef({});
  
  // Get products for a specific section, filtered by section ID
  const getSectionProducts = (sectionId) => {
    // if (products.length === 0) return [];
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
        badgeColor: product.badge === 'New Arrival' ? 'bg-primary text-primary-foreground' : 
                    product.badge === 'Bestseller' ? 'bg-accent text-accent-foreground' :
                    'bg-success text-success-foreground',
        link: `/products-catalog`
      }));
  };

  // Quick access category cards
  const quickCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      icon: 'Smartphone',
      color: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      link: '/products-catalog'
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: 'Headphones',
      color: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
      link: '/products-catalog'
    },
    {
      id: 'wearables',
      name: 'Wearables',
      icon: 'Watch',
      color: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      link: '/products-catalog'
    },
    {
      id: 'tablets',
      name: 'Tablets',
      icon: 'Tablet',
      color: 'var(--color-success)',
      bgColor: 'bg-success/10',
      link: '/products-catalog'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: 'Cable',
      color: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      link: '/products-catalog'
    },
    {
      id: 'cases',
      name: 'Cases',
      icon: 'Package',
      color: 'var(--color-destructive)',
      bgColor: 'bg-destructive/10',
      link: '/products-catalog'
    }
  ];

  // Handling scrolling for carousels
  const scrollCarousel = (direction, sectionId, productsLength) => {
    const currentIndex = slideIndices[sectionId] || 0;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, productsLength - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    setSlideIndices(prev => ({
      ...prev,
      [sectionId]: newIndex
    }));
    
    // Scroll the container
    const container = sectionRefs.current[sectionId];
    if (container) {
      const scrollAmount = 320; // Width of one card + gap
      container.scrollTo({
        left: newIndex * scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Format price with Indian currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Mobile Showcase
          </h2>
          <p className="text-muted-foreground">
            Discover the latest in mobile technology
          </p>
        </div>

        {/* Dynamic Sections */}
        {sections.length > 0 && sections.map((section) => {
          const sectionProducts = getSectionProducts(section._id);
          if (sectionProducts.length === 0) return null;  // Hide sections with no products
          const currentIndex = slideIndices[section._id] || 0;
          return (
            <div key={section._id} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-lg font-bold text-foreground mr-2 flex items-center">
                    <Icon name={section.icon || 'Grid3x3'} size={20} className="mr-1" />
                    {section.title}
                  </div>
                  {section.name === 'Flash Deals' && (  // Use section.name for badge check if needed
                    <div className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded">
                      Ending Soon
                    </div>
                  )}
                </div>
                {sectionProducts.length > 1 && (
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => scrollCarousel('prev', section._id, sectionProducts.length)}
                      disabled={currentIndex === 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentIndex === 0 
                          ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                          : 'text-foreground bg-card hover:bg-muted'
                      }`}
                    >
                      <Icon name="ChevronLeft" size={16} />
                    </button>
                    <button 
                      onClick={() => scrollCarousel('next', section._id, sectionProducts.length)}
                      disabled={currentIndex === sectionProducts.length - 1}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentIndex === sectionProducts.length - 1 
                          ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                          : 'text-foreground bg-card hover:bg-muted'
                      }`}
                    >
                      <Icon name="ChevronRight" size={16} />
                    </button>
                  </div>
                )}
              </div>
              <SwipeableContainer
                onSwipeLeft={() => scrollCarousel('next', section._id, sectionProducts.length)}
                onSwipeRight={() => scrollCarousel('prev', section._id, sectionProducts.length)}
              >
                <div 
                  className="flex space-x-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4" 
                  ref={el => sectionRefs.current[section._id] = el}
                >
                  {sectionProducts.map((product) => (
                    <Link 
                      to={product.link} 
                      key={product.id} 
                      className="snap-start flex-none w-[280px] sm:w-[320px] group"
                    >
                      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-medium transition-smooth h-full">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                          />
                          {product.discount && (
                            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 whitespace-nowrap shadow-md backdrop-blur-sm bg-background/70">
                              <Icon name="Fire" size={14} color="var(--color-destructive)" />
                              <span className="text-destructive">{product.discount}</span>
                            </div>
                          )}
                          {product.badgeText && (
                            <div className={`absolute top-3 right-3 px-3 py-1 ${product.badgeColor} text-xs font-semibold rounded-md`}>
                              {product.badgeText}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">{product.title}</h3>
                          <div className="flex items-baseline space-x-2 mb-1">
                            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-success font-medium flex items-center">
                              <Icon name="Check" size={12} className="mr-1" />
                              In Stock
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </SwipeableContainer>
              
              {sectionProducts.length > 1 && (
                <div className="flex justify-center mt-4">
                  {sectionProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSlideIndices(prev => ({ ...prev, [section._id]: index }));
                        const container = sectionRefs.current[section._id];
                        if (container) {
                          const scrollAmount = 320;
                          container.scrollTo({
                            left: index * scrollAmount,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                        index === currentIndex 
                          ? 'bg-primary' 
                          : 'bg-muted hover:bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Quick access category cards */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Browse By Category
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickCategories.map((category) => (
              <Link to={category.link} key={category.id} className="block">
                <div className="flex flex-col items-center bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
                  <div className={`${category.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                    <Icon name={category.icon} size={24} color={category.color} />
                  </div>
                  <span className="text-xs text-center text-foreground font-medium">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <Link to="/products-catalog">
            <Button variant="outline" size="lg">
              View All Products
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;