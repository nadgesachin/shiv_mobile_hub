import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ProductCard from './components/ProductCard';
import ProductQuickView from './components/ProductQuickView';
import ComparisonModal from './components/ComparisonModal';
import BulkOrderSection from './components/BulkOrderSection';

const ProductsCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }];

  // Updated categories for better organization
  const categoryOptions = [
    { id: 'all', name: 'All Products', icon: 'Grid' },
    { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
    { id: 'tablets', name: 'Tablets', icon: 'Tablet' },
    { id: 'audio', name: 'Audio', icon: 'Headphones' },
    { id: 'wearables', name: 'Wearables', icon: 'Watch' },
    { id: 'accessories', name: 'Accessories', icon: 'Cable' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getProductCategories();

        const rawCategories = response?.data?.categories || [];

        // 🔥 Filter only valid string categories (ignore ObjectId)
        const validCategories = rawCategories.filter(
          cat => typeof cat === 'string' && !cat.match(/^[a-f0-9]{24}$/i)
        );

        const formattedCategories = [
          { id: 'all', label: 'All Products', value: 'all', icon: 'Grid' },
          ...validCategories.map(cat => ({
            id: cat,
            value: cat,                 // 🔥 filter key
            label: formatCategoryName(cat),
            icon: getCategoryIcon(cat)
          }))
        ];

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const formatCategoryName = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'smartphones': return 'Smartphone';
      case 'tablets': return 'Tablet';
      case 'audio': return 'Headphones';
      case 'wearables': return 'Watch';
      case 'accessories': return 'Cable';
      default: return 'Grid';
    }
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setEnquiryProduct(product);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToWishlist = (productId) => {
    console.log('Added to wishlist:', productId);
  };

  const handleAddToComparison = (product) => {
    if (comparisonProducts?.length < 3 && !comparisonProducts?.find((p) => p?.id === product?.id)) {
      setComparisonProducts((prev) => [...prev, product]);
    }
  };

  const handleRemoveFromComparison = (productId) => {
    setComparisonProducts((prev) => prev?.filter((p) => p?.id !== productId));
  };

  const handleSearch = () => {
    setIsSearching(true);
    let results = [...products];
    if (currentCategory !== 'all') {
      results = results.filter(product => {
        if (product.category?.slug) {
          return product.category.slug === currentCategory;
        }
        return false;
      });
    }

    // Text search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.specs?.some(spec => spec.toLowerCase().includes(query)) ||
        product.category?.toLowerCase?.().includes(query)
      );
    }

    // Sort results
    if (sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      // Assuming newer products have higher IDs
      results.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(results);
    setIsSearching(false);
  };

  // The single, definitive useEffect for all filtering logic.
  useEffect(() => {
    // The initial fetch populates `products`, which triggers this effect.
    // We debounce the search to prevent excessive re-renders during rapid state changes.
    const handler = setTimeout(() => {
      handleSearch();
    }, 100); // A small debounce is sufficient here.

    return () => {
      clearTimeout(handler);
    };
    // This effect re-runs ONLY when a filter or the master product list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentCategory, sortBy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts({ limit: 200 }); // or whatever limit you want
        const productData = response.data.products || [];
        setProducts(productData);
        setFilteredProducts(productData); // Initialize filtered products
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-br from-white via-primary/5 to-white border-b border-gray-100 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fadeInDown">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-foreground mb-3">
              Mobile & Accessories Catalog
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest smartphones, tablets, audio devices, wearables, and accessories
            </p>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-4xl mx-auto mb-6">
            <div className="flex-1 w-full">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products, brands, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-11 pr-10"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  {searchQuery && <Icon name="X" size={18} />}
                </button>
              </div>
            </div>
            <Button
              variant="default"
              size="lg"
              iconName="Search"
              iconPosition="left"
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full sm:w-auto"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Mobile-friendly category selector */}
          <div className="py-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCurrentCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full 
          whitespace-nowrap font-medium text-sm transition-all
          ${currentCategory === category.value
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-white border border-gray-200 text-foreground hover:border-primary hover:bg-gray-50'
                    }`}
                >
                  <Icon name={category.icon} size={16} />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-6 py-6 lg:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold text-lg">{filteredProducts.length}</span>
              <span className="text-muted-foreground ml-2">products found</span>
            </p>
            {currentCategory !== 'all' && (
              <p className="text-xs text-primary mt-2 font-medium">
                📁 {categories.find(c => c.value === currentCategory)?.label}
              </p>
            )}

          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              className="w-full sm:min-w-[200px]"
            />
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-md transition-all duration-200 touch-target ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'}`}
                aria-label="Grid view"
                title="Grid view">
                <Icon name="Grid" size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-md transition-all duration-200 touch-target ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'}`}
                aria-label="List view"
                title="List view">
                <Icon name="List" size={18} />
              </button>
            </div>

            {comparisonProducts?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                iconName="GitCompare"
                iconPosition="left"
                onClick={() => setShowComparison(true)}
                className="w-full sm:w-auto">
                Compare ({comparisonProducts?.length})
              </Button>
            )}
          </div>
        </div>

        <div className="gap-8">
          <div className="col-span-1">
            <div className={`grid gap-4 sm:gap-5 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}
            >
              {filteredProducts.map((product) => (
                <div key={product?.id} className="relative group animate-fadeInUp">
                  <ProductCard
                    product={product}
                    viewMode={viewMode}   // ✅ THIS IS THE FIX
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToWishlist={handleAddToWishlist}
                    enquiryProduct={enquiryProduct}
                  />

                  <button
                    onClick={() => handleAddToComparison(product)}
                    className="absolute top-4 left-4 w-10 h-10 bg-white shadow-soft rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-medium touch-target"
                    aria-label="Add to comparison"
                    disabled={comparisonProducts?.length >= 3}
                    title={comparisonProducts?.length >= 3 ? "Maximum 3 products for comparison" : "Add to comparison"}
                  >
                    <Icon name="GitCompare" size={18} className="text-primary" />
                  </button>
                </div>
              ))}
            </div>

            {/* Show message when no products match the search */}
            {filteredProducts.length === 0 && (searchQuery.trim() !== '' || currentCategory !== 'all') && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchQuery.trim() !== ''
                    ? `We couldn't find any products matching "${searchQuery}" in this category.`
                    : 'No products found in this category.'}
                  Try different keywords or select another category.
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  {searchQuery.trim() !== '' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        handleSearch();
                      }}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Clear Search
                    </Button>
                  )}
                  {currentCategory !== 'all' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentCategory('all');
                      }}
                      iconName="Grid"
                      iconPosition="left"
                    >
                      All Categories
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 mt-12">
              <Button variant="outline" iconName="ChevronLeft" disabled>
                Previous
              </Button>
              {[1, 2, 3, 4, 5]?.map((page) =>
                <button
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-smooth ${page === 1 ?
                    'bg-primary text-primary-foreground' :
                    'bg-card border border-border text-foreground hover:bg-muted'}`
                  }>
                  {page}
                </button>
              )}
              <Button variant="outline" iconName="ChevronRight">
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold text-foreground">
              Business Solutions
            </h2>
            <Button
              variant={showBulkOrder ? 'default' : 'outline'}
              iconName={showBulkOrder ? 'ChevronUp' : 'ChevronDown'}
              iconPosition="right"
              onClick={() => setShowBulkOrder(!showBulkOrder)}>

              {showBulkOrder ? 'Hide' : 'Show'} Bulk Order Form
            </Button>
          </div>
          {showBulkOrder && <BulkOrderSection />}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} color="var(--color-success)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Genuine Products</h3>
            <p className="text-sm text-muted-foreground">
              100% authentic products with manufacturer warranty
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Truck" size={32} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Same-day delivery available in select areas
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Headphones" size={32} color="var(--color-secondary)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Dedicated customer service and technical assistance
            </p>
          </div>
        </div>
      </div>
      {selectedProduct &&
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart} />

      }
      {showComparison && comparisonProducts?.length > 0 &&
        <ComparisonModal
          products={comparisonProducts}
          onClose={() => setShowComparison(false)}
          onRemoveProduct={handleRemoveFromComparison}
          onEnquire={handleAddToCart} />
      }
      <Footer />
    </div>);

};

export default ProductsCatalog;