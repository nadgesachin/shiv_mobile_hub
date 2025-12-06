import React, { useState, useEffect } from 'react';

import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ProductCard from './components/ProductCard';
import FilterSidebar from './components/FilterSidebar';
import ProductQuickView from './components/ProductQuickView';
import ComparisonModal from './components/ComparisonModal';
import BulkOrderSection from './components/BulkOrderSection';

const ProductsCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showBulkOrder, setShowBulkOrder] = useState(false);

  const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }];


  const products = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship smartphone with AI-powered camera, S Pen, and stunning 6.8-inch Dynamic AMOLED display",
    price: 124999,
    originalPrice: 139999,
    image: "https://images.unsplash.com/photo-1707410420102-faff6eb0e033",
    imageAlt: "Samsung Galaxy S24 Ultra smartphone in titanium gray color with S Pen stylus on white background showing premium design",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 2847,
    specs: ["12GB RAM", "256GB Storage", "200MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 15,
    detailedSpecs: {
      display: "6.8-inch Dynamic AMOLED 2X, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB LPDDR5X",
      storage: "256GB UFS 4.0",
      camera: "200MP + 50MP + 12MP + 10MP",
      battery: "5000mAh with 45W fast charging",
      os: "Android 14 with One UI 6.1"
    }
  },
  {
    id: 2,
    name: "Apple iPhone 15 Pro Max",
    description: "Premium iPhone with titanium design, A17 Pro chip, and revolutionary camera system",
    price: 159900,
    originalPrice: 169900,
    image: "https://images.unsplash.com/photo-1695560923428-5464fd01d01f",
    imageAlt: "Apple iPhone 15 Pro Max in natural titanium finish displaying iOS interface on elegant white surface",
    badge: "New Arrival",
    rating: 4.9,
    reviewCount: 3521,
    specs: ["8GB RAM", "256GB Storage", "48MP Camera", "A17 Pro"],
    stockStatus: "in-stock",
    stockCount: 8,
    detailedSpecs: {
      display: "6.7-inch Super Retina XDR, ProMotion",
      processor: "A17 Pro Bionic",
      ram: "8GB",
      storage: "256GB",
      camera: "48MP + 12MP + 12MP with LiDAR",
      battery: "4422mAh with MagSafe charging",
      os: "iOS 17"
    }
  },
  {
    id: 3,
    name: "OnePlus 12",
    description: "Flagship killer with Hasselblad camera, 100W SuperVOOC charging, and stunning display",
    price: 64999,
    originalPrice: 69999,
    image: "https://images.unsplash.com/photo-1610887603721-1b944a45d266",
    imageAlt: "OnePlus 12 smartphone in flowy emerald color showcasing curved display and premium glass back design",
    rating: 4.7,
    reviewCount: 1893,
    specs: ["16GB RAM", "512GB Storage", "50MP Camera", "5400mAh"],
    stockStatus: "in-stock",
    stockCount: 22,
    detailedSpecs: {
      display: "6.82-inch AMOLED, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "16GB LPDDR5X",
      storage: "512GB UFS 4.0",
      camera: "50MP + 64MP + 48MP Hasselblad",
      battery: "5400mAh with 100W SuperVOOC",
      os: "OxygenOS 14 based on Android 14"
    }
  },
  {
    id: 4,
    name: "Xiaomi 14 Pro",
    description: "Photography powerhouse with Leica optics, Snapdragon 8 Gen 3, and premium build quality",
    price: 79999,
    originalPrice: 89999,
    image: "https://images.unsplash.com/photo-1687331780289-f2bec66a0550",
    imageAlt: "Xiaomi 14 Pro smartphone in titanium black with Leica camera system prominently displayed on marble surface",
    badge: "Hot Deal",
    rating: 4.6,
    reviewCount: 1456,
    specs: ["12GB RAM", "256GB Storage", "50MP Leica", "4880mAh"],
    stockStatus: "low",
    stockCount: 5,
    detailedSpecs: {
      display: "6.73-inch AMOLED, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB LPDDR5X",
      storage: "256GB UFS 4.0",
      camera: "50MP + 50MP + 50MP Leica",
      battery: "4880mAh with 120W HyperCharge",
      os: "MIUI 15 based on Android 14"
    }
  },
  {
    id: 5,
    name: "Realme GT 5 Pro",
    description: "Performance beast with flagship specs at mid-range price, perfect for gaming enthusiasts",
    price: 42999,
    originalPrice: 49999,
    image: "https://images.unsplash.com/photo-1664865277950-312c8310d8e7",
    imageAlt: "Realme GT 5 Pro gaming smartphone in racing yellow color with RGB lighting effects on dark background",
    rating: 4.5,
    reviewCount: 987,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5400mAh"],
    stockStatus: "in-stock",
    stockCount: 18,
    detailedSpecs: {
      display: "6.78-inch AMOLED, 144Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB LPDDR5X",
      storage: "256GB UFS 4.0",
      camera: "50MP + 8MP + 2MP",
      battery: "5400mAh with 100W SuperDart",
      os: "Realme UI 5.0 based on Android 14"
    }
  },
  {
    id: 6,
    name: "OPPO Find X7 Ultra",
    description: "Photography flagship with dual periscope cameras and Hasselblad color science",
    price: 99999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1607602706883-91f9e86e6214",
    imageAlt: "OPPO Find X7 Ultra smartphone in ocean blue with quad camera setup and premium leather back finish",
    badge: "Limited Edition",
    rating: 4.7,
    reviewCount: 1234,
    specs: ["16GB RAM", "512GB Storage", "50MP Quad", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 12,
    detailedSpecs: {
      display: "6.82-inch AMOLED, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "16GB LPDDR5X",
      storage: "512GB UFS 4.0",
      camera: "50MP + 50MP + 50MP + 50MP Hasselblad",
      battery: "5000mAh with 100W SuperVOOC",
      os: "ColorOS 14 based on Android 14"
    }
  },
  {
    id: 7,
    name: "Nothing Phone (2a)",
    description: "Unique design with Glyph Interface, clean Android experience, and excellent value proposition",
    price: 23999,
    originalPrice: 27999,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_13749a1bf-1764490676381.png",
    imageAlt: "Nothing Phone 2a in transparent design showing unique Glyph Interface LED lights on back panel",
    rating: 4.4,
    reviewCount: 2156,
    specs: ["8GB RAM", "128GB Storage", "50MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 35,
    detailedSpecs: {
      display: "6.7-inch AMOLED, 120Hz",
      processor: "MediaTek Dimensity 7200 Pro",
      ram: "8GB LPDDR4X",
      storage: "128GB UFS 3.1",
      camera: "50MP + 50MP",
      battery: "5000mAh with 45W fast charging",
      os: "Nothing OS 2.5 based on Android 14"
    }
  },
  {
    id: 8,
    name: "Google Pixel 8 Pro",
    description: "AI-powered photography with Tensor G3, pure Android experience, and 7 years of updates",
    price: 106999,
    originalPrice: 119999,
    image: "https://images.unsplash.com/photo-1669708182253-1dfe68b48fc6",
    imageAlt: "Google Pixel 8 Pro in bay blue color showcasing camera bar design and matte glass finish on white background",
    badge: "Editor\'s Choice",
    rating: 4.8,
    reviewCount: 1678,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5050mAh"],
    stockStatus: "in-stock",
    stockCount: 10,
    detailedSpecs: {
      display: "6.7-inch LTPO OLED, 120Hz",
      processor: "Google Tensor G3",
      ram: "12GB LPDDR5X",
      storage: "256GB UFS 3.1",
      camera: "50MP + 48MP + 48MP",
      battery: "5050mAh with 30W fast charging",
      os: "Android 14 with 7 years updates"
    }
  },
  {
    id: 9,
    name: "Vivo X100 Pro",
    description: "Imaging flagship with Zeiss optics, MediaTek Dimensity 9300, and stunning curved display",
    price: 89999,
    originalPrice: 99999,
    image: "https://images.unsplash.com/photo-1655802851117-167cb4ebaf2c",
    imageAlt: "Vivo X100 Pro smartphone in asteroid black with Zeiss camera module and premium curved glass design",
    rating: 4.6,
    reviewCount: 1089,
    specs: ["16GB RAM", "512GB Storage", "50MP Zeiss", "5400mAh"],
    stockStatus: "low",
    stockCount: 6,
    detailedSpecs: {
      display: "6.78-inch AMOLED, 120Hz",
      processor: "MediaTek Dimensity 9300",
      ram: "16GB LPDDR5T",
      storage: "512GB UFS 4.0",
      camera: "50MP + 50MP + 50MP Zeiss",
      battery: "5400mAh with 120W FlashCharge",
      os: "Funtouch OS 14 based on Android 14"
    }
  },
  {
    id: 10,
    name: "Motorola Edge 50 Ultra",
    description: "Premium mid-ranger with clean Android, excellent display, and versatile camera system",
    price: 54999,
    originalPrice: 59999,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_126e9740e-1764490677243.png",
    imageAlt: "Motorola Edge 50 Ultra in forest gray with curved edge display and premium vegan leather back",
    rating: 4.5,
    reviewCount: 876,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "4500mAh"],
    stockStatus: "in-stock",
    stockCount: 20,
    detailedSpecs: {
      display: "6.7-inch pOLED, 144Hz",
      processor: "Snapdragon 8s Gen 3",
      ram: "12GB LPDDR5X",
      storage: "256GB UFS 4.0",
      camera: "50MP + 50MP + 64MP",
      battery: "4500mAh with 125W TurboPower",
      os: "My UX based on Android 14"
    }
  },
  {
    id: 11,
    name: "Sony Xperia 1 VI",
    description: "Content creator's dream with 4K HDR display, pro camera controls, and audiophile-grade sound",
    price: 119999,
    originalPrice: 134999,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_171c706e9-1764490677017.png",
    imageAlt: "Sony Xperia 1 VI in platinum silver with 21:9 display and triple camera system for professional photography",
    badge: "Pro Series",
    rating: 4.7,
    reviewCount: 654,
    specs: ["12GB RAM", "512GB Storage", "48MP Triple", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 7,
    detailedSpecs: {
      display: "6.5-inch 4K HDR OLED, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB LPDDR5X",
      storage: "512GB UFS 4.0",
      camera: "48MP + 12MP + 12MP Zeiss",
      battery: "5000mAh with wireless charging",
      os: "Android 14"
    }
  },
  {
    id: 12,
    name: "ASUS ROG Phone 8 Pro",
    description: "Ultimate gaming smartphone with AeroActive Cooler, 165Hz display, and massive battery",
    price: 99999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1732020884190-04a72e311403",
    imageAlt: "ASUS ROG Phone 8 Pro gaming smartphone in phantom black with RGB lighting and gaming triggers",
    badge: "Gaming Beast",
    rating: 4.8,
    reviewCount: 1432,
    specs: ["16GB RAM", "512GB Storage", "50MP Camera", "5500mAh"],
    stockStatus: "in-stock",
    stockCount: 14,
    detailedSpecs: {
      display: "6.78-inch AMOLED, 165Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "16GB LPDDR5X",
      storage: "512GB UFS 4.0",
      camera: "50MP + 13MP + 5MP",
      battery: "5500mAh with 65W HyperCharge",
      os: "ROG UI based on Android 14"
    }
  }];


  const handleFilterChange = (category, values) => {
    setFilters((prev) => ({ ...prev, [category]: values }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log('Added to cart:', product);
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

  const activeFiltersCount = Object.values(filters)?.reduce((acc, val) => acc + val?.length, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-3">
              Products Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive collection of premium smartphones, accessories, and electronics with exclusive deals
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 w-full">
              <Input
                type="search"
                placeholder="Search for products, brands, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full" />

            </div>
            <Button variant="default" size="lg" iconName="Search" iconPosition="left">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {['Smartphones', 'Accessories', 'Tablets', 'Smartwatches', 'Audio']?.map((category) =>
            <button
              key={category}
              className="px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth">

                {category}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{products?.length}</span> products
            </p>
            {activeFiltersCount > 0 &&
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-md">
                <Icon name="Filter" size={14} color="var(--color-primary)" />
                <span className="text-sm font-medium text-primary">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
              </div>
            }
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-48" />


            <div className="flex items-center space-x-1 border border-border rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-smooth ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
                aria-label="Grid view">

                <Icon name="Grid3x3" size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-smooth ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
                aria-label="List view">

                <Icon name="List" size={18} />
              </button>
            </div>

            {comparisonProducts?.length > 0 &&
            <Button
              variant="outline"
              iconName="GitCompare"
              iconPosition="left"
              onClick={() => setShowComparison(true)}>

                Compare ({comparisonProducts?.length})
              </Button>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFiltersCount={activeFiltersCount} />

            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`
            }>
              {products?.map((product) =>
              <div key={product?.id} className="relative">
                  <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                  onAddToWishlist={handleAddToWishlist} />

                  <button
                  onClick={() => handleAddToComparison(product)}
                  className="absolute top-3 left-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-smooth"
                  aria-label="Add to comparison"
                  disabled={comparisonProducts?.length >= 3}>

                    <Icon name="GitCompare" size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 mt-12">
              <Button variant="outline" iconName="ChevronLeft" disabled>
                Previous
              </Button>
              {[1, 2, 3, 4, 5]?.map((page) =>
              <button
                key={page}
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-smooth ${
                page === 1 ?
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
        onRemoveProduct={handleRemoveFromComparison} />

      }
      <Footer />
    </div>);

};

export default ProductsCatalog;