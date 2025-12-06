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
  
  // State for different carousels
  const [dealSlideIndex, setDealSlideIndex] = useState(0);
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [accessoriesIndex, setAccessoriesIndex] = useState(0);
  
  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts({ limit: 50 });
        setProducts(response.data.products);
        setError('');
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Reference to scroll containers
  const dealsRef = useRef(null);
  const newArrivalsRef = useRef(null);
  const accessoriesRef = useRef(null);
  
  // Category list for filters
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'tablets', name: 'Tablets' },
    { id: 'audio', name: 'Audio' },
    { id: 'wearables', name: 'Wearables' }
  ];
  
  // Get dynamic product data from backend
  const getDealsData = () => {
    if (products.length === 0) return [];
    
    return products
      .filter(product => product.isActive && product.originalPrice > product.price)
      .slice(0, 4)
      .map(product => ({
        id: product._id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1707410420102-faff6eb0e033',
        badgeText: product.badge || 'Hot Deal',
        badgeColor: product.badge === 'New Arrival' ? 'bg-primary text-primary-foreground' : 
                    product.badge === 'Bestseller' ? 'bg-accent text-accent-foreground' :
                    'bg-success text-success-foreground',
        link: `/products-catalog`
      }));
  };

  const getNewArrivals = () => {
    if (products.length === 0) return [];
    
    return products
      .filter(product => product.isActive && (product.badge === 'New Arrival' || product.badge === 'New Release'))
      .slice(0, 4)
      .map(product => ({
        id: product._id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1707410420102-faff6eb0e033',
        specs: product.specs?.slice(0, 3) || [],
        link: `/products-catalog`
      }));
  };

  const getAccessories = () => {
    if (products.length === 0) return [];
    
    return products
      .filter(product => product.isActive && product.category === 'accessories')
      .slice(0, 6)
      .map(product => ({
        id: product._id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1707410420102-faff6eb0e033',
        link: `/products-catalog`
      }));
  };

  const dealData = getDealsData();
  const newArrivals = getNewArrivals();
  const accessories = getAccessories();

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
  const scrollCarousel = (direction, ref, setIndex, maxIndex) => {
    if (ref.current) {
      const container = ref.current;
      const scrollAmount = container.clientWidth;
      
      if (direction === 'next' && scrollAmount) {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setIndex(prev => Math.min(prev + 1, maxIndex));
      } else if (direction === 'prev' && scrollAmount) {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };
  
  // Format price with Indian currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl p-4">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to Load Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold text-foreground">
                Mobile & Accessories
              </h2>
              <Link to="/products-catalog" className="flex items-center text-primary font-medium hover:underline">
                View All
                <Icon name="ArrowRight" size={16} className="ml-1" />
              </Link>
            </div>
        
        {/* Mobile-friendly categories bar */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-smooth ${
                  activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Flash deals carousel */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-lg font-bold text-destructive mr-2 flex items-center">
                <Icon name="Zap" size={20} className="mr-1" />
                Flash Deals
              </div>
              <div className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded">
                Ending Soon
              </div>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => scrollCarousel('prev', dealsRef, setDealSlideIndex, dealData.length - 1)}
                disabled={dealSlideIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dealSlideIndex === 0 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button 
                onClick={() => scrollCarousel('next', dealsRef, setDealSlideIndex, dealData.length - 1)}
                disabled={dealSlideIndex === dealData.length - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dealSlideIndex === dealData.length - 1 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
          <SwipeableContainer
            onSwipeLeft={() => scrollCarousel('next', dealsRef, setDealSlideIndex, dealData.length - 1)}
            onSwipeRight={() => scrollCarousel('prev', dealsRef, setDealSlideIndex, dealData.length - 1)}
          >
            <div 
              className="flex space-x-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4" 
              ref={dealsRef}
            >
              {dealData.map((deal) => (
                <Link 
                  to={deal.link} 
                  key={deal.id} 
                  className="snap-start flex-none w-[280px] sm:w-[320px] group"
                >
                  <div className="bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-medium transition-smooth h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 whitespace-nowrap shadow-md backdrop-blur-sm bg-background/70">
                        <Icon name="Fire" size={14} color="var(--color-destructive)" />
                        <span className="text-destructive">{deal.discount}</span>
                      </div>
                      {deal.badgeText && (
                        <div className={`absolute top-3 right-3 px-3 py-1 ${deal.badgeColor} text-xs font-semibold rounded-md`}>
                          {deal.badgeText}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">{deal.title}</h3>
                      <div className="flex items-baseline space-x-2 mb-1">
                        <span className="text-lg font-bold text-primary">{formatPrice(deal.price)}</span>
                        {deal.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(deal.originalPrice)}
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
          
          <div className="flex justify-center mt-4">
            {dealData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (dealsRef.current) {
                    const container = dealsRef.current;
                    const scrollAmount = container.clientWidth;
                    container.scrollTo({ left: scrollAmount * index, behavior: 'smooth' });
                    setDealSlideIndex(index);
                  }
                }}
                className={`w-2 h-2 rounded-full mx-1 ${
                  dealSlideIndex === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        
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
        
        {/* New Arrivals Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <Icon name="Star" size={18} className="mr-2 text-warning" />
              New Arrivals
            </h3>
            <div className="flex space-x-1">
              <button 
                onClick={() => scrollCarousel('prev', newArrivalsRef, setNewArrivalsIndex, newArrivals.length - 1)}
                disabled={newArrivalsIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  newArrivalsIndex === 0 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button 
                onClick={() => scrollCarousel('next', newArrivalsRef, setNewArrivalsIndex, newArrivals.length - 1)}
                disabled={newArrivalsIndex === newArrivals.length - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  newArrivalsIndex === newArrivals.length - 1 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
          <SwipeableContainer
            onSwipeLeft={() => scrollCarousel('next', newArrivalsRef, setNewArrivalsIndex, newArrivals.length - 1)}
            onSwipeRight={() => scrollCarousel('prev', newArrivalsRef, setNewArrivalsIndex, newArrivals.length - 1)}
          >
            <div 
              className="flex space-x-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4" 
              ref={newArrivalsRef}
            >
              {newArrivals.map((item) => (
                <Link 
                  to={item.link} 
                  key={item.id} 
                  className="snap-start flex-none w-[280px] sm:w-[320px] group"
                >
                  <div className="bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-medium transition-smooth h-full">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute top-3 left-3 px-3 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded-md">
                        New Arrival
                      </div>
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">{item.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.specs.map((spec, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SwipeableContainer>
        </div>
        
        {/* Accessories Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <Icon name="Cable" size={18} className="mr-2 text-accent" />
              Top Accessories
            </h3>
            <div className="flex space-x-1">
              <button 
                onClick={() => scrollCarousel('prev', accessoriesRef, setAccessoriesIndex, Math.ceil(accessories.length/2) - 1)}
                disabled={accessoriesIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  accessoriesIndex === 0 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button 
                onClick={() => scrollCarousel('next', accessoriesRef, setAccessoriesIndex, Math.ceil(accessories.length/2) - 1)}
                disabled={accessoriesIndex === Math.ceil(accessories.length/2) - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  accessoriesIndex === Math.ceil(accessories.length/2) - 1 
                    ? 'text-muted-foreground bg-muted cursor-not-allowed' 
                    : 'text-foreground bg-card hover:bg-muted'
                }`}
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
          <SwipeableContainer
            onSwipeLeft={() => scrollCarousel('next', accessoriesRef, setAccessoriesIndex, Math.ceil(accessories.length/2) - 1)}
            onSwipeRight={() => scrollCarousel('prev', accessoriesRef, setAccessoriesIndex, Math.ceil(accessories.length/2) - 1)}
          >
            <div 
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4" 
              ref={accessoriesRef}
            >
              {accessories.map((item) => (
                <Link 
                  to={item.link} 
                  key={item.id} 
                  className="snap-start"
                >
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-soft hover:shadow-medium transition-smooth h-full">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-background/80 backdrop-blur-sm">
                        <span className="text-xs font-medium text-foreground">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">{item.title}</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-bold text-primary">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SwipeableContainer>
        </div>
        
        {/* View all products CTA */}
        <div className="flex justify-center mt-8">
          <Link to="/products-catalog">
            <Button 
              variant="outline" 
              size="lg" 
              iconName="ShoppingBag" 
              iconPosition="left"
              className="shadow-soft hover:shadow-medium"
            >
              View All Products
            </Button>
          </Link>
        </div>
        </>
        )}
      </div>
    </section>
  );
};

export default MobileShowcase;