import React, { useState, useEffect } from 'react';

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

  const products = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      description: "Flagship smartphone with AI-powered camera, S Pen, and stunning 6.8-inch Dynamic AMOLED display",
      price: 124999,
      originalPrice: 139999,
      image: "[https://images.unsplash.com/photo-1707410420102-faff6eb0e033](https://images.unsplash.com/photo-1707410420102-faff6eb0e033)",
      imageAlt: "Samsung Galaxy S24 Ultra smartphone in titanium gray color with S Pen stylus on white background showing premium design",
      badge: "Bestseller",
      rating: 4.8,
      reviewCount: 2847,
      specs: ["12GB RAM", "256GB Storage", "200MP Camera", "5000mAh"],
      stockStatus: "in-stock",
      stockCount: 15,
      category: "smartphones",
      brand: "Samsung",
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
      image: "[https://images.unsplash.com/photo-1695560923428-5464fd01d01f](https://images.unsplash.com/photo-1695560923428-5464fd01d01f)",
      imageAlt: "Apple iPhone 15 Pro Max in natural titanium finish displaying iOS interface on elegant white surface",
      badge: "New Arrival",
      rating: 4.9,
      reviewCount: 3521,
      specs: ["8GB RAM", "256GB Storage", "48MP Camera", "A17 Pro"],
      stockStatus: "in-stock",
      stockCount: 8,
      category: "smartphones",
      brand: "Apple",
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
      image: "[https://images.unsplash.com/photo-1610887603721-1b944a45d266](https://images.unsplash.com/photo-1610887603721-1b944a45d266)",
      imageAlt: "OnePlus 12 smartphone in flowy emerald color showcasing curved display and premium glass back design",
      rating: 4.7,
      reviewCount: 1893,
      specs: ["16GB RAM", "512GB Storage", "50MP Camera", "5400mAh"],
      stockStatus: "in-stock",
      stockCount: 22,
      category: "smartphones",
      brand: "OnePlus",
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
      image: "[https://images.unsplash.com/photo-1687331780289-f2bec66a0550](https://images.unsplash.com/photo-1687331780289-f2bec66a0550)",
      imageAlt: "Xiaomi 14 Pro smartphone in titanium black with Leica camera system prominently displayed on marble surface",
      badge: "Hot Deal",
      rating: 4.6,
      reviewCount: 1456,
      specs: ["12GB RAM", "256GB Storage", "50MP Leica", "4880mAh"],
      stockStatus: "low",
      stockCount: 5,
      category: "smartphones",
      brand: "Xiaomi",
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
      image: "[https://images.unsplash.com/photo-1664865277950-312c8310d8e7](https://images.unsplash.com/photo-1664865277950-312c8310d8e7)",
      imageAlt: "Realme GT 5 Pro gaming smartphone in racing yellow color with RGB lighting effects on dark background",
      rating: 4.5,
      reviewCount: 987,
      specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5400mAh"],
      stockStatus: "in-stock",
      stockCount: 18,
      category: "smartphones",
      brand: "Realme",
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
      image: "[https://images.unsplash.com/photo-1607602706883-91f9e86e6214](https://images.unsplash.com/photo-1607602706883-91f9e86e6214)",
      imageAlt: "OPPO Find X7 Ultra smartphone in ocean blue with quad camera setup and premium leather back finish",
      badge: "Limited Edition",
      rating: 4.7,
      reviewCount: 1234,
      specs: ["16GB RAM", "512GB Storage", "50MP Quad", "5000mAh"],
      stockStatus: "in-stock",
      stockCount: 12,
      category: "smartphones",
      brand: "OPPO",
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
      image: "[https://img.rocket.new/generatedImages/rocket_gen_img_13749a1bf-1764490676381.png](https://img.rocket.new/generatedImages/rocket_gen_img_13749a1bf-1764490676381.png)",
      imageAlt: "Nothing Phone 2a in transparent design showing unique Glyph Interface LED lights on back panel",
      rating: 4.4,
      reviewCount: 2156,
      specs: ["8GB RAM", "128GB Storage", "50MP Camera", "5000mAh"],
      stockStatus: "in-stock",
      stockCount: 35,
      category: "smartphones",
      brand: "Nothing",
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
      image: "[https://images.unsplash.com/photo-1669708182253-1dfe68b48fc6](https://images.unsplash.com/photo-1669708182253-1dfe68b48fc6)",
      imageAlt: "Google Pixel 8 Pro in bay blue color showcasing camera bar design and matte glass finish on white background",
      badge: "Editor's Choice",
      rating: 4.8,
      reviewCount: 1678,
      specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5050mAh"],
      stockStatus: "in-stock",
      stockCount: 10,
      category: "smartphones",
      brand: "Google",
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
      image: "[https://images.unsplash.com/photo-1655802851117-167cb4ebaf2c](https://images.unsplash.com/photo-1655802851117-167cb4ebaf2c)",
      imageAlt: "Vivo X100 Pro smartphone in asteroid black with Zeiss camera module and premium curved glass design",
      rating: 4.6,
      reviewCount: 1089,
      specs: ["16GB RAM", "512GB Storage", "50MP Zeiss", "5400mAh"],
      stockStatus: "low",
      stockCount: 6,
      category: "smartphones",
      brand: "Vivo",
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
    // New tablets
    {
      id: 20,
      name: "Samsung Galaxy Tab S9 Ultra",
      description: "Massive 14.6-inch AMOLED display, S Pen included, and powerful Snapdragon 8 Gen 2 processor",
      price: 108999,
      originalPrice: 124999,
      image: "[https://images.unsplash.com/photo-1671092647826-558fbff5c9d1](https://images.unsplash.com/photo-1671092647826-558fbff5c9d1)",
      imageAlt: "Samsung Galaxy Tab S9 Ultra with S Pen on glass table displaying vibrant screen and thin profile",
      badge: "Premium",
      rating: 4.8,
      reviewCount: 986,
      specs: ["16GB RAM", "512GB Storage", "14.6″ AMOLED", "11200mAh"],
      stockStatus: "in-stock",
      stockCount: 12,
      category: "tablets",
      brand: "Samsung",
      detailedSpecs: {
        display: "14.6-inch Dynamic AMOLED 2X, 120Hz",
        processor: "Snapdragon 8 Gen 2",
        ram: "16GB LPDDR5X",
        storage: "512GB UFS 4.0",
        camera: "13MP + 8MP front, 12MP + 12MP rear",
        battery: "11200mAh with 45W fast charging",
        os: "Android 14 with One UI 6.1"
      }
    },
    {
      id: 21,
      name: "Apple iPad Pro 13-inch M4",
      description: "Revolutionary tablet with desktop-class M4 chip, ProMotion XDR display, and pro-grade cameras",
      price: 139900,
      originalPrice: 149900,
      image: "[https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0](https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0)",
      imageAlt: "Apple iPad Pro with Apple Pencil displaying creative application on stunning Liquid Retina XDR display",
      badge: "Most Powerful",
      rating: 4.9,
      reviewCount: 1235,
      specs: ["16GB RAM", "1TB Storage", "13″ Liquid Retina XDR", "M4 Chip"],
      stockStatus: "in-stock",
      stockCount: 8,
      category: "tablets",
      brand: "Apple",
      detailedSpecs: {
        display: "13-inch Liquid Retina XDR, 120Hz ProMotion",
        processor: "Apple M4 chip",
        ram: "16GB",
        storage: "1TB",
        camera: "12MP Ultra Wide front, 12MP Wide + 10MP Ultra Wide rear with LiDAR",
        battery: "All-day battery life",
        os: "iPadOS 17"
      }
    },
    // Audio products
    {
      id: 30,
      name: "Sony WH-1000XM5",
      description: "Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life",
      price: 34999,
      originalPrice: 39999,
      image: "[https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb](https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb)",
      imageAlt: "Sony WH-1000XM5 premium wireless headphones in black with plush ear cushions on minimalist background",
      badge: "Best ANC",
      rating: 4.9,
      reviewCount: 3254,
      specs: ["30hr Battery", "LDAC Codec", "8 Mics", "Wireless"],
      stockStatus: "in-stock",
      stockCount: 25,
      category: "audio",
      brand: "Sony",
      detailedSpecs: {
        type: "Over-ear, closed-back",
        drivers: "30mm carbon fiber composite",
        battery: "30 hours (ANC on), 40 hours (ANC off)",
        connectivity: "Bluetooth 5.2, 3.5mm, LDAC, AAC",
        features: "Adaptive noise cancellation, multipoint connection, speak-to-chat",
        weight: "250g"
      }
    },
    {
      id: 31,
      name: "Apple AirPods Pro 2",
      description: "Active noise cancellation, adaptive transparency, and personalized spatial audio with dynamic head tracking",
      price: 24900,
      originalPrice: 26900,
      image: "[https://images.unsplash.com/photo-1606741965509-717b9fde4786](https://images.unsplash.com/photo-1606741965509-717b9fde4786)",
      imageAlt: "Apple AirPods Pro 2 with charging case on white surface showcasing compact design and silicone tips",
      rating: 4.8,
      reviewCount: 5698,
      specs: ["6hr Battery", "H2 Chip", "IPX4", "Wireless"],
      stockStatus: "in-stock",
      stockCount: 45,
      category: "audio",
      brand: "Apple",
      detailedSpecs: {
        type: "In-ear, true wireless",
        drivers: "Custom high-excursion driver",
        battery: "6 hours (ANC on), 30 hours with case",
        connectivity: "Bluetooth 5.3, H2 chip",
        features: "Active noise cancellation, adaptive transparency, spatial audio",
        weight: "5.3g per earbud"
      }
    },
    {
      id: 32,
      name: "Samsung Galaxy Buds 3 Pro",
      description: "Premium earbuds with intelligent ANC, studio-quality sound, and seamless device switching",
      price: 16999,
      originalPrice: 19999,
      image: "[https://images.unsplash.com/photo-1638139222913-6cf5554e9065](https://images.unsplash.com/photo-1638139222913-6cf5554e9065)",
      imageAlt: "Samsung Galaxy Buds 3 Pro in charging case with LED indicator displaying premium design and compact form factor",
      badge: "New Release",
      rating: 4.7,
      reviewCount: 1456,
      specs: ["8hr Battery", "24-bit Audio", "IPX7", "Wireless"],
      stockStatus: "in-stock",
      stockCount: 30,
      category: "audio",
      brand: "Samsung",
      detailedSpecs: {
        type: "In-ear, true wireless",
        drivers: "Dual dynamic drivers",
        battery: "8 hours (ANC off), 5 hours (ANC on), 24 hours with case",
        connectivity: "Bluetooth 5.3, Samsung Seamless",
        features: "Intelligent ANC, 360 Audio, Voice Detect",
        weight: "5.5g per earbud"
      }
    },
    // Wearables
    {
      id: 40,
      name: "Apple Watch Series 9",
      description: "Advanced health monitoring, always-on Retina display, and powerful S9 chip in an elegant design",
      price: 41999,
      originalPrice: 45999,
      image: "[https://images.unsplash.com/photo-1696863076168-cccb37ae7de5](https://images.unsplash.com/photo-1696863076168-cccb37ae7de5)",
      imageAlt: "Apple Watch Series 9 in stainless steel case with Milanese loop band displaying fitness tracking interface",
      rating: 4.9,
      reviewCount: 2987,
      specs: ["Always-on Retina", "ECG", "Blood Oxygen", "GPS+Cellular"],
      stockStatus: "in-stock",
      stockCount: 22,
      category: "wearables",
      brand: "Apple",
      detailedSpecs: {
        display: "Always-On Retina LTPO OLED, 1000 nits",
        processor: "Apple S9 SiP",
        storage: "32GB",
        connectivity: "GPS, Cellular, Wi-Fi, Bluetooth 5.3",
        sensors: "ECG, blood oxygen, temperature, heart rate, altimeter",
        battery: "Up to 18 hours, 36 hours in Low Power Mode"
      }
    },
    {
      id: 41,
      name: "Samsung Galaxy Watch 6 Pro",
      description: "Advanced health tracking, premium design, and long battery life with Wear OS integration",
      price: 39999,
      originalPrice: 44999,
      image: "[https://images.unsplash.com/photo-1579586337278-3befd40fd17a](https://images.unsplash.com/photo-1579586337278-3befd40fd17a)",
      imageAlt: "Samsung Galaxy Watch 6 Pro with titanium case and premium band displaying health dashboard on round AMOLED screen",
      badge: "Health Expert",
      rating: 4.7,
      reviewCount: 1765,
      specs: ["Super AMOLED", "BioActive Sensor", "Sapphire Crystal", "GPS+LTE"],
      stockStatus: "in-stock",
      stockCount: 18,
      category: "wearables",
      brand: "Samsung",
      detailedSpecs: {
        display: "1.5-inch Super AMOLED, 480x480",
        processor: "Exynos W930",
        storage: "16GB",
        connectivity: "GPS, LTE, Wi-Fi, Bluetooth 5.3",
        sensors: "BioActive (heart rate, ECG, BIA), temperature, accelerometer",
        battery: "590mAh, up to 80 hours in power saving mode"
      }
    },
    // Accessories - Chargers
    {
      id: 50,
      name: "Samsung 45W Super Fast Charger",
      description: "Charge your Galaxy devices at lightning speed with this official Samsung Super Fast Wall Charger",
      price: 3999,
      originalPrice: 4999,
      image: "[https://images.unsplash.com/photo-1659709774702-a1728821f8e9](https://images.unsplash.com/photo-1659709774702-a1728821f8e9)",
      imageAlt: "Samsung 45W Super Fast Charger with USB-C cable in white color displayed on minimal surface",
      rating: 4.6,
      reviewCount: 2156,
      specs: ["45W Output", "USB-C", "PD 3.0", "PPS"],
      stockStatus: "in-stock",
      stockCount: 50,
      category: "accessories",
      subcategory: "chargers",
      brand: "Samsung",
      detailedSpecs: {
        type: "Wall charger",
        output: "45W maximum",
        compatibility: "Universal USB-C devices, optimized for Samsung",
        features: "Super Fast Charging 2.0, USB-PD, PPS",
        includes: "Charger and 1.5m USB-C cable"
      }
    },
    {
      id: 51,
      name: "Belkin 3-in-1 Wireless Charger with MagSafe",
      description: "Premium charging station for iPhone, Apple Watch, and AirPods with official MagSafe certification",
      price: 12999,
      originalPrice: 14999,
      image: "[https://images.unsplash.com/photo-1659709695211-23c519818063](https://images.unsplash.com/photo-1659709695211-23c519818063)",
      imageAlt: "Belkin 3-in-1 Wireless Charger in white/silver with iPhone 14 Pro, Apple Watch, and AirPods charging simultaneously",
      badge: "Apple Certified",
      rating: 4.8,
      reviewCount: 1342,
      specs: ["15W MagSafe", "Apple Watch Fast Charge", "Qi Certified", "LED Indicator"],
      stockStatus: "in-stock",
      stockCount: 15,
      category: "accessories",
      subcategory: "chargers",
      brand: "Belkin",
      detailedSpecs: {
        type: "Wireless charging station",
        output: "15W MagSafe, 5W Qi, Apple Watch Fast Charging",
        compatibility: "iPhone 12 and newer, Apple Watch, AirPods with wireless charging",
        features: "Official MagSafe certification, premium stainless steel design",
        includes: "Charging stand, 1.5m cable, power adapter"
      }
    },
    // Cases
    {
      id: 60,
      name: "Spigen Ultra Hybrid Case for iPhone 15 Pro",
      description: "Crystal clear protection with Air Cushion technology and hybrid structure",
      price: 1999,
      originalPrice: 2499,
      image: "[https://images.unsplash.com/photo-1658695604921-c051beb7284e](https://images.unsplash.com/photo-1658695604921-c051beb7284e)",
      imageAlt: "Spigen Ultra Hybrid clear case showing iPhone 15 Pro inside with perfect fit and raised bezels",
      rating: 4.7,
      reviewCount: 3421,
      specs: ["Crystal Clear", "Air Cushion", "Raised Bezels", "Wireless Charging"],
      stockStatus: "in-stock",
      stockCount: 75,
      category: "accessories",
      subcategory: "cases",
      brand: "Spigen",
      detailedSpecs: {
        type: "Hybrid case",
        material: "TPU bumper with polycarbonate back",
        protection: "Military-grade drop protection (MIL-STD-810G)",
        features: "Raised bezels, precise cutouts, wireless charging compatible",
        compatibility: "iPhone 15 Pro"
      }
    },
    {
      id: 61,
      name: "Samsung Smart View Cover for Galaxy S24 Ultra",
      description: "Official Samsung case with smart window for notifications and premium protection",
      price: 4999,
      originalPrice: 5999,
      image: "[https://images.unsplash.com/photo-1626113140684-6a6ff86139b7](https://images.unsplash.com/photo-1626113140684-6a6ff86139b7)",
      imageAlt: "Samsung Smart View Cover in navy blue showing notification window and premium textured finish",
      badge: "Official",
      rating: 4.5,
      reviewCount: 1245,
      specs: ["Smart View Window", "Auto Sleep/Wake", "S Pen Storage", "Premium Finish"],
      stockStatus: "in-stock",
      stockCount: 30,
      category: "accessories",
      subcategory: "cases",
      brand: "Samsung",
      detailedSpecs: {
        type: "Folio case with smart window",
        material: "Premium polyurethane exterior, microfiber interior",
        protection: "Full edge and screen protection",
        features: "S Pen storage slot, smart view window for notifications",
        compatibility: "Samsung Galaxy S24 Ultra"
      }
    },
    {
      id: 70,
      name: "Anker Magnetic Wireless Power Bank 5K",
      description: "MagSafe-compatible portable charger with 5,000mAh capacity for iPhone on the go",
      price: 3499,
      originalPrice: 3999,
      image: "[https://images.unsplash.com/photo-1606341401729-9a4025325247](https://images.unsplash.com/photo-1606341401729-9a4025325247)",
      imageAlt: "Anker Magnetic Wireless Power Bank attached to iPhone showing slim design and charging indicator",
      rating: 4.6,
      reviewCount: 2145,
      specs: ["5000mAh", "7.5W Wireless", "Magnetic", "USB-C Input/Output"],
      stockStatus: "in-stock",
      stockCount: 40,
      category: "accessories",
      subcategory: "power banks",
      brand: "Anker",
      detailedSpecs: {
        type: "Magnetic wireless power bank",
        capacity: "5,000mAh",
        output: "7.5W wireless, 12W USB-C",
        input: "USB-C PD (20W max)",
        compatibility: "iPhone 12 and newer, other devices via USB-C",
        features: "Strong magnetic attachment, LED indicators, pass-through charging"
      }
    },
    {
      id: 71,
      name: "Samsung Galaxy S Pen Pro",
      description: "Enhanced S Pen with Bluetooth control, precision tip, and multi-device compatibility",
      price: 8999,
      originalPrice: 10999,
      image: "[https://img.rocket.new/generatedImages/rocket_gen_img_199e59592-1764490676964.png](https://img.rocket.new/generatedImages/rocket_gen_img_199e59592-1764490676964.png)",
      imageAlt: "Samsung Galaxy S Pen Pro in premium black finish showing precision tip and Bluetooth control button",
      badge: "Pro Series",
      rating: 4.8,
      reviewCount: 976,
      specs: ["Bluetooth Control", "Precision Tip", "4096 Pressure Levels", "Cross-Device"],
      stockStatus: "in-stock",
      stockCount: 22,
      category: "accessories",
      subcategory: "stylus",
      brand: "Samsung",
      detailedSpecs: {
        type: "Active stylus pen",
        compatibility: "Galaxy S22/S23/S24 Ultra, Z Fold series, Galaxy Tab S series",
        features: "Air actions, precision tip, 4096 pressure levels, cross-device compatibility",
      }
    }
  ];



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

  // Search and filter functionality
  const handleSearch = () => {
    setIsSearching(true);

    let results = [...products];

    // Category filter
    if (currentCategory !== 'all') {
      results = results.filter(product => product.category === currentCategory);
    }

    // Text search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.specs.some(spec => spec.toLowerCase().includes(query)) ||
        product.category?.toLowerCase().includes(query)
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

  // Use useEffect to trigger search when dependencies change
  useEffect(() => {
    // Initial filter
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, sortBy]);
  
  // Trigger search when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
              Mobile & Accessories Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest smartphones, tablets, audio devices, wearables, and accessories
            </p>
          </div>

          {/* Search bar */}
          <div className="flex flex-col lg:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 w-full">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for products, brands, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pr-10"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  {searchQuery && <Icon name="X" size={16} />}
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
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Mobile-friendly category selector */}
          <div className="py-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3 pb-1">
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCurrentCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-smooth ${currentCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon name={category.icon} size={16} />
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length > 0 ? filteredProducts.length : products.length}</span> products
            </p>
            {currentCategory !== 'all' && (
              <p className="text-xs text-primary mt-1">
                Category: {categoryOptions.find(c => c.id === currentCategory)?.name}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              className="min-w-[180px]"
            />
            <div className="flex items-center space-x-1 border border-border rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-smooth ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Grid view">
                <Icon name="Grid" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-smooth ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="List view">
                <Icon name="List" size={16} />
              </button>
            </div>

            {comparisonProducts?.length > 0 && (
              <Button
                variant="outline"
                iconName="GitCompare"
                iconPosition="left"
                onClick={() => setShowComparison(true)}>
                Compare ({comparisonProducts?.length})
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-1">
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid-cols-1'}`}
            >
              {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
                <div key={product?.id} className="relative">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToWishlist={handleAddToWishlist}
                  />
                  <button
                    onClick={() => handleAddToComparison(product)}
                    className="absolute top-3 left-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-smooth"
                    aria-label="Add to comparison"
                    disabled={comparisonProducts?.length >= 3}
                  >
                    <Icon name="GitCompare" size={18} />
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
          onRemoveProduct={handleRemoveFromComparison} />

      }
      <Footer />
    </div>);

};

export default ProductsCatalog;