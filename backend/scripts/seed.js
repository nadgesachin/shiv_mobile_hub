const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Section = require('../models/Section');
const Service = require('../models/Service');

// // Sample data
// const sampleProducts = [
//   {
//     name: "Samsung Galaxy S24 Ultra",
//     description: "Flagship smartphone with AI-powered camera, S Pen, and stunning 6.8-inch Dynamic AMOLED display",
//     price: 124999,
//     originalPrice: 139999,
//     images: [{
//       url: "https://images.unsplash.com/photo-1707410420102-faff6eb0e033",
//       alt: "Samsung Galaxy S24 Ultra smartphone"
//     }],
//     category: "smartphones",
//     brand: "Samsung",
//     badge: "Bestseller",
//     rating: 4.8,
//     reviewCount: 2847,
//     specs: ["12GB RAM", "256GB Storage", "200MP Camera", "5000mAh"],
//     stockStatus: "in-stock",
//     stockCount: 15,
//     sections: ["flash-deals", "featured-products"],
//     detailedSpecs: {
//       display: "6.8-inch Dynamic AMOLED 2X, 120Hz",
//       processor: "Snapdragon 8 Gen 3",
//       ram: "12GB LPDDR5X",
//       storage: "256GB UFS 4.0",
//       camera: "200MP + 50MP + 12MP + 10MP",
//       battery: "5000mAh with 45W fast charging",
//       os: "Android 14 with One UI 6.1"
//     }
//   },
//   {
//     name: "Apple iPhone 15 Pro Max",
//     description: "Premium iPhone with titanium design, A17 Pro chip, and revolutionary camera system",
//     price: 159900,
//     originalPrice: 169900,
//     images: [{
//       url: "https://images.unsplash.com/photo-1695560923428-5464fd01d01f",
//       alt: "Apple iPhone 15 Pro Max"
//     }],
//     category: "smartphones",
//     brand: "Apple",
//     badge: "New Arrival",
//     rating: 4.9,
//     reviewCount: 3521,
//     specs: ["8GB RAM", "256GB Storage", "48MP Camera", "A17 Pro"],
//     stockStatus: "in-stock",
//     stockCount: 8,
//     sections: ["new-arrivals", "featured-products"],
//     detailedSpecs: {
//       display: "6.7-inch Super Retina XDR, ProMotion",
//       processor: "A17 Pro Bionic",
//       ram: "8GB",
//       storage: "256GB",
//       camera: "48MP + 12MP + 12MP with LiDAR",
//       battery: "4422mAh with MagSafe charging",
//       os: "iOS 17"
//     }
//   },
//   {
//     name: "OnePlus 12",
//     description: "Flagship killer with Hasselblad camera, 100W SuperVOOC charging, and stunning display",
//     price: 64999,
//     originalPrice: 69999,
//     images: [{
//       url: "https://images.unsplash.com/photo-1610887603721-1b944a45d266",
//       alt: "OnePlus 12 smartphone"
//     }],
//     category: "smartphones",
//     brand: "OnePlus",
//     rating: 4.7,
//     reviewCount: 1893,
//     specs: ["16GB RAM", "512GB Storage", "50MP Camera", "5400mAh"],
//     stockStatus: "in-stock",
//     stockCount: 22,
//     sections: ["flash-deals"],
//     detailedSpecs: {
//       display: "6.82-inch AMOLED, 120Hz",
//       processor: "Snapdragon 8 Gen 3",
//       ram: "16GB LPDDR5X",
//       storage: "512GB UFS 4.0",
//       camera: "50MP + 64MP + 48MP Hasselblad",
//       battery: "5400mAh with 100W SuperVOOC",
//       os: "OxygenOS 14 based on Android 14"
//     }
//   },
//   {
//     name: "Samsung 45W Super Fast Charger",
//     description: "Charge your Galaxy devices at lightning speed with this official Samsung Super Fast Wall Charger",
//     price: 3999,
//     originalPrice: 4999,
//     images: [{
//       url: "https://images.unsplash.com/photo-1659709774702-a1728821f8e9",
//       alt: "Samsung 45W Super Fast Charger"
//     }],
//     category: "accessories",
//     subcategory: "chargers",
//     brand: "Samsung",
//     badge: "Hot Deal",
//     rating: 4.6,
//     reviewCount: 2156,
//     specs: ["45W Output", "USB-C", "PD 3.0", "PPS"],
//     stockStatus: "in-stock",
//     stockCount: 50,
//     sections: ["top-accessories"],
//     detailedSpecs: {
//       type: "Wall charger",
//       output: "45W maximum",
//       compatibility: "Universal USB-C devices, optimized for Samsung",
//       features: "Super Fast Charging 2.0, USB-PD, PPS",
//       includes: "Charger and 1.5m USB-C cable"
//     }
//   },
//   {
//     name: "Sony WH-1000XM5",
//     description: "Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life",
//     price: 34999,
//     originalPrice: 39999,
//     images: [{
//       url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
//       alt: "Sony WH-1000XM5 headphones"
//     }],
//     category: "audio",
//     brand: "Sony",
//     badge: "Best ANC",
//     rating: 4.9,
//     reviewCount: 3254,
//     specs: ["30hr Battery", "LDAC Codec", "8 Mics", "Wireless"],
//     stockStatus: "in-stock",
//     stockCount: 25,
//     sections: ["top-accessories"],
//     detailedSpecs: {
//       type: "Over-ear, closed-back",
//       drivers: "30mm carbon fiber composite",
//       battery: "30 hours (ANC on), 40 hours (ANC off)",
//       connectivity: "Bluetooth 5.2, 3.5mm, LDAC, AAC",
//       features: "Adaptive noise cancellation, multipoint connection, speak-to-chat",
//       weight: "250g"
//     }
//   }
// ];

const sampleSections = [
  {
    name: "flash-deals",
    title: "Flash Deals",
    subtitle: "Limited Time Offers",
    description: "Grab these amazing deals before they're gone!",
    maxProducts: 10,
    displayOrder: 1,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: true,
      updateCriteria: "discounted"
    }
  },
  {
    name: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Latest Products",
    description: "Check out the newest additions to our store",
    maxProducts: 10,
    displayOrder: 2,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: true,
      updateCriteria: "newest"
    }
  },
  {
    name: "top-accessories",
    title: "Top Accessories",
    subtitle: "Essential Add-ons",
    description: "Must-have accessories for your devices",
    maxProducts: 10,
    displayOrder: 3,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: false
    }
  },
  {
    name: "featured-products",
    title: "Featured Products",
    subtitle: "Handpicked for You",
    description: "Our most popular and recommended products",
    maxProducts: 10,
    displayOrder: 4,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: true,
      updateCriteria: "highest-rated"
    }
  }
];

const sampleServices = [
  {
    name: "Mobile Repair",
    description: "Professional repair services for all mobile phones and tablets",
    icon: "Wrench",
    category: "mobile-services",
    price: 299,
    priceType: "variable",
    duration: "1-3 hours",
    features: ["Screen Replacement", "Battery Replacement", "Water Damage Repair", "Software Issues"],
    requirements: ["Device details", "Issue description"],
    process: [
      { step: "Diagnosis", description: "Our technicians diagnose the issue" },
      { step: "Quote", description: "Get a transparent price quote" },
      { step: "Repair", description: "Expert repair using genuine parts" },
      { step: "Testing", description: "Thorough testing before delivery" }
    ],
    isPopular: true,
    displayOrder: 1
  },
  {
    name: "Mobile Recharge",
    description: "Instant prepaid and postpaid mobile recharge for all operators",
    icon: "Smartphone",
    category: "mobile-services",
    price: 10,
    priceType: "variable",
    duration: "Instant",
    features: ["All Operators", "Instant Recharge", "Secure Payment", "Cashback Offers"],
    requirements: ["Mobile number", "Operator selection"],
    isPopular: true,
    displayOrder: 2
  },
  {
    name: "Bill Payment",
    description: "Pay all your utility bills online with ease and convenience",
    icon: "FileText",
    category: "financial-services",
    price: 0,
    priceType: "variable",
    duration: "Instant",
    features: ["Electricity Bills", "Water Bills", "Gas Bills", "Internet Bills"],
    requirements: ["Service provider", "Customer ID"],
    displayOrder: 3
  },
  {
    name: "Aadhaar Services",
    description: "Complete Aadhaar card services including enrollment and updates",
    icon: "User",
    category: "government-services",
    price: 0,
    priceType: "fixed",
    duration: "30 minutes",
    features: ["New Enrollment", "Address Update", "Mobile Update", "Biometric Update"],
    requirements: ["Original documents", "Biometric verification"],
    isPopular: true,
    displayOrder: 4
  }
];

const sampleProducts = [
  // SMARTPHONES
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship smartphone with AI-powered camera, S Pen, and stunning 6.8-inch Dynamic AMOLED display",
    price: 124999,
    originalPrice: 139999,
    images: [{
      url: "https://images.unsplash.com/photo-1707410420102-faff6eb0e033",
      alt: "Samsung Galaxy S24 Ultra smartphone"
    }],
    category: "smartphones",
    brand: "Samsung",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 2847,
    specs: ["12GB RAM", "256GB Storage", "200MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 15,
    sections: ["flash-deals", "featured-products"],
    detailedSpecs: new Map([
      ["display", "6.8-inch Dynamic AMOLED 2X, 120Hz"],
      ["processor", "Snapdragon 8 Gen 3"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 4.0"],
      ["camera", "200MP + 50MP + 12MP + 10MP"],
      ["battery", "5000mAh with 45W fast charging"],
      ["os", "Android 14 with One UI 6.1"]
    ])
  },
  {
    name: "Apple iPhone 15 Pro Max",
    description: "Premium iPhone with titanium design, A17 Pro chip, and revolutionary camera system",
    price: 159900,
    originalPrice: 169900,
    images: [{
      url: "https://images.unsplash.com/photo-1695560923428-5464fd01d01f",
      alt: "Apple iPhone 15 Pro Max"
    }],
    category: "smartphones",
    brand: "Apple",
    badge: "New Arrival",
    rating: 4.9,
    reviewCount: 3521,
    specs: ["8GB RAM", "256GB Storage", "48MP Camera", "A17 Pro"],
    stockStatus: "in-stock",
    stockCount: 8,
    sections: ["new-arrivals", "featured-products"],
    detailedSpecs: new Map([
      ["display", "6.7-inch Super Retina XDR, ProMotion"],
      ["processor", "A17 Pro Bionic"],
      ["ram", "8GB"],
      ["storage", "256GB"],
      ["camera", "48MP + 12MP + 12MP with LiDAR"],
      ["battery", "4422mAh with MagSafe charging"],
      ["os", "iOS 17"]
    ])
  },
  {
    name: "OnePlus 12",
    description: "Flagship killer with Hasselblad camera, 100W SuperVOOC charging, and stunning display",
    price: 64999,
    originalPrice: 69999,
    images: [{
      url: "https://images.unsplash.com/photo-1610887603721-1b944a45d266",
      alt: "OnePlus 12 smartphone"
    }],
    category: "smartphones",
    brand: "OnePlus",
    rating: 4.7,
    reviewCount: 1893,
    specs: ["16GB RAM", "512GB Storage", "50MP Camera", "5400mAh"],
    stockStatus: "in-stock",
    stockCount: 22,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.82-inch AMOLED, 120Hz"],
      ["processor", "Snapdragon 8 Gen 3"],
      ["ram", "16GB LPDDR5X"],
      ["storage", "512GB UFS 4.0"],
      ["camera", "50MP + 64MP + 48MP Hasselblad"],
      ["battery", "5400mAh with 100W SuperVOOC"],
      ["os", "OxygenOS 14 based on Android 14"]
    ])
  },
  {
    name: "Google Pixel 8 Pro",
    description: "AI-powered smartphone with Google Tensor G3, amazing camera, and pure Android experience",
    price: 84999,
    originalPrice: 94999,
    images: [{
      url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      alt: "Google Pixel 8 Pro"
    }],
    category: "smartphones",
    brand: "Google",
    badge: "Editor's Choice",
    rating: 4.8,
    reviewCount: 1654,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5050mAh"],
    stockStatus: "in-stock",
    stockCount: 12,
    sections: ["new-arrivals", "featured-products"],
    detailedSpecs: new Map([
      ["display", "6.7-inch LTPO OLED, 120Hz"],
      ["processor", "Google Tensor G3"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 3.1"],
      ["camera", "50MP + 48MP + 48MP with AI"],
      ["battery", "5050mAh with 30W fast charging"],
      ["os", "Android 14 with 7 years of updates"]
    ])
  },
  {
    name: "Xiaomi 14 Pro",
    description: "Premium flagship with Leica optics, Snapdragon 8 Gen 3, and stunning 2K display",
    price: 69999,
    originalPrice: 79999,
    images: [{
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      alt: "Xiaomi 14 Pro"
    }],
    category: "smartphones",
    brand: "Xiaomi",
    badge: "Hot Deal",
    rating: 4.6,
    reviewCount: 987,
    specs: ["12GB RAM", "256GB Storage", "50MP Leica", "4880mAh"],
    stockStatus: "in-stock",
    stockCount: 18,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.73-inch AMOLED, 120Hz, 3000 nits"],
      ["processor", "Snapdragon 8 Gen 3"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 4.0"],
      ["camera", "50MP Leica triple camera system"],
      ["battery", "4880mAh with 120W HyperCharge"],
      ["os", "HyperOS based on Android 14"]
    ])
  },
  {
    name: "Vivo X100 Pro",
    description: "Photography powerhouse with Zeiss optics, MediaTek Dimensity 9300, and exceptional low-light performance",
    price: 74999,
    originalPrice: 82999,
    images: [{
      url: "https://images.unsplash.com/photo-1592286927505-c7c7801bb3a8",
      alt: "Vivo X100 Pro"
    }],
    category: "smartphones",
    brand: "Vivo",
    rating: 4.7,
    reviewCount: 756,
    specs: ["16GB RAM", "512GB Storage", "50MP Zeiss", "5400mAh"],
    stockStatus: "in-stock",
    stockCount: 10,
    sections: ["new-arrivals"],
    detailedSpecs: new Map([
      ["display", "6.78-inch AMOLED, 120Hz"],
      ["processor", "MediaTek Dimensity 9300"],
      ["ram", "16GB LPDDR5T"],
      ["storage", "512GB UFS 4.0"],
      ["camera", "50MP + 50MP + 50MP Zeiss"],
      ["battery", "5400mAh with 100W charging"],
      ["os", "Funtouch OS 14 based on Android 14"]
    ])
  },
  {
    name: "Nothing Phone 2",
    description: "Unique transparent design with Glyph Interface, powerful performance, and clean software",
    price: 44999,
    originalPrice: 49999,
    images: [{
      url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2",
      alt: "Nothing Phone 2"
    }],
    category: "smartphones",
    brand: "Nothing",
    badge: "Editor's Choice",
    rating: 4.5,
    reviewCount: 1234,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "4700mAh"],
    stockStatus: "in-stock",
    stockCount: 20,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "6.7-inch LTPO AMOLED, 120Hz"],
      ["processor", "Snapdragon 8+ Gen 1"],
      ["ram", "12GB LPDDR5"],
      ["storage", "256GB UFS 3.1"],
      ["camera", "50MP + 50MP dual camera"],
      ["battery", "4700mAh with 45W fast charging"],
      ["os", "Nothing OS 2.0 based on Android 14"]
    ])
  },

  // ACCESSORIES - CHARGERS & CABLES
  {
    name: "Samsung 45W Super Fast Charger",
    description: "Charge your Galaxy devices at lightning speed with this official Samsung Super Fast Wall Charger",
    price: 3999,
    originalPrice: 4999,
    images: [{
      url: "https://images.unsplash.com/photo-1659709774702-a1728821f8e9",
      alt: "Samsung 45W Super Fast Charger"
    }],
    category: "accessories",
    subcategory: "chargers",
    brand: "Samsung",
    badge: "Hot Deal",
    rating: 4.6,
    reviewCount: 2156,
    specs: ["45W Output", "USB-C", "PD 3.0", "PPS"],
    stockStatus: "in-stock",
    stockCount: 50,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Wall charger"],
      ["output", "45W maximum"],
      ["compatibility", "Universal USB-C devices, optimized for Samsung"],
      ["features", "Super Fast Charging 2.0, USB-PD, PPS"],
      ["includes", "Charger and 1.5m USB-C cable"]
    ])
  },
  {
    name: "Anker PowerPort III 65W GaN Charger",
    description: "Compact 3-port GaN charger with 65W total output for all your devices",
    price: 3499,
    originalPrice: 4499,
    images: [{
      url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
      alt: "Anker 65W GaN Charger"
    }],
    category: "accessories",
    subcategory: "chargers",
    brand: "Anker",
    rating: 4.8,
    reviewCount: 1876,
    specs: ["65W Total", "3 Ports", "GaN Tech", "Compact"],
    stockStatus: "in-stock",
    stockCount: 35,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Multi-port wall charger"],
      ["output", "65W max (2x USB-C, 1x USB-A)"],
      ["features", "PowerIQ 3.0, foldable plug, GaN technology"],
      ["weight", "40% smaller than standard chargers"]
    ])
  },
  {
    name: "Belkin Boost Charge Pro 20W",
    description: "Fast charge your iPhone or Android device with this compact 20W USB-C wall charger",
    price: 1799,
    originalPrice: 2499,
    images: [{
      url: "https://images.unsplash.com/photo-1591290619762-c588e5fb0e7d",
      alt: "Belkin 20W USB-C Charger"
    }],
    category: "accessories",
    subcategory: "chargers",
    brand: "Belkin",
    rating: 4.5,
    reviewCount: 945,
    specs: ["20W Output", "USB-C PD", "Compact", "Universal"],
    stockStatus: "in-stock",
    stockCount: 60,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Single port wall charger"],
      ["output", "20W USB-C PD 3.0"],
      ["compatibility", "iPhone 8 and later, Android devices"],
      ["features", "Intelligent power delivery, surge protection"]
    ])
  },
  {
    name: "Braided USB-C to USB-C Cable 2m",
    description: "Durable braided cable supporting 100W PD charging and 480Mbps data transfer",
    price: 599,
    originalPrice: 999,
    images: [{
      url: "https://images.unsplash.com/photo-1625948515291-69613efd103f",
      alt: "Braided USB-C Cable"
    }],
    category: "accessories",
    subcategory: "cables",
    brand: "Generic",
    rating: 4.4,
    reviewCount: 3421,
    specs: ["2m Length", "100W PD", "Braided", "USB 2.0"],
    stockStatus: "in-stock",
    stockCount: 100,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "USB-C to USB-C cable"],
      ["features", "2 meters, 100W (5A) power delivery, 480Mbps USB 2.0, 10,000+ bend lifespan"]
    ])
  },

  // AUDIO PRODUCTS
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life",
    price: 34999,
    originalPrice: 39999,
    images: [{
      url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      alt: "Sony WH-1000XM5 headphones"
    }],
    category: "audio",
    brand: "Sony",
    badge: "Best ANC",
    rating: 4.9,
    reviewCount: 3254,
    specs: ["30hr Battery", "LDAC Codec", "8 Mics", "Wireless"],
    stockStatus: "in-stock",
    stockCount: 25,
    sections: ["top-accessories", "featured-products"],
    detailedSpecs: new Map([
      ["type", "Over-ear, closed-back"],
      ["drivers", "30mm carbon fiber composite"],
      ["battery", "30 hours (ANC on), 40 hours (ANC off)"],
      ["connectivity", "Bluetooth 5.2, 3.5mm, LDAC, AAC"],
      ["features", "Adaptive noise cancellation, multipoint connection, speak-to-chat"],
      ["weight", "250g"]
    ])
  },
  {
    name: "Apple AirPods Pro 2nd Gen",
    description: "Advanced noise cancellation, personalized spatial audio, and seamless Apple ecosystem integration",
    price: 24900,
    originalPrice: 26900,
    images: [{
      url: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7",
      alt: "Apple AirPods Pro 2"
    }],
    category: "audio",
    brand: "Apple",
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 5432,
    specs: ["6hr Battery", "H2 Chip", "ANC", "MagSafe"],
    stockStatus: "in-stock",
    stockCount: 30,
    sections: ["featured-products", "top-accessories"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["processor", "Apple H2"],
      ["battery", "6 hours (ANC on), 30 hours with case"],
      ["connectivity", "Bluetooth 5.3, Apple ecosystem"],
      ["features", "Active noise cancellation, transparency mode, spatial audio, IPX4"]
    ])
  },
  {
    name: "JBL Flip 6",
    description: "Portable Bluetooth speaker with powerful sound, IP67 waterproof rating, and 12-hour battery",
    price: 9999,
    originalPrice: 12999,
    images: [{
      url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      alt: "JBL Flip 6 Bluetooth Speaker"
    }],
    category: "audio",
    brand: "JBL",
    badge: "Hot Deal",
    rating: 4.7,
    reviewCount: 2187,
    specs: ["12hr Battery", "IP67 Rated", "PartyBoost", "Portable"],
    stockStatus: "in-stock",
    stockCount: 40,
    sections: ["flash-deals", "top-accessories"],
    detailedSpecs: new Map([
      ["type", "Portable Bluetooth speaker"],
      ["drivers", "Dual passive radiators"],
      ["battery", "12 hours playtime"],
      ["connectivity", "Bluetooth 5.1"],
      ["features", "PartyBoost, IP67 waterproof & dustproof"],
      ["weight", "550g"]
    ])
  },
  {
    name: "Boat Airdopes 141",
    description: "Budget-friendly TWS earbuds with ASAP charging, 42 hours playback, and IPX4 rating",
    price: 1299,
    originalPrice: 2999,
    images: [{
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      alt: "Boat Airdopes 141"
    }],
    category: "audio",
    brand: "Boat",
    badge: "Hot Deal",
    rating: 4.2,
    reviewCount: 8765,
    specs: ["42hr Playback", "ASAP Charge", "IPX4", "Low Latency"],
    stockStatus: "in-stock",
    stockCount: 80,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "8mm dynamic drivers"],
      ["battery", "42 hours total (with case)"],
      ["connectivity", "Bluetooth 5.0"],
      ["features", "ASAP charge (10min=75min), IPX4, low latency mode"],
      ["weight", "40g (with case)"]
    ])
  },

  // WEARABLES - SMARTWATCHES
  {
    name: "Apple Watch Series 9",
    description: "Advanced health monitoring, fitness tracking, and seamless iPhone integration with stunning always-on display",
    price: 44900,
    originalPrice: 49900,
    images: [{
      url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9",
      alt: "Apple Watch Series 9"
    }],
    category: "wearables",
    brand: "Apple",
    badge: "Premium",
    rating: 4.8,
    reviewCount: 2341,
    specs: ["S9 Chip", "18hr Battery", "Always-On", "Health"],
    stockStatus: "in-stock",
    stockCount: 15,
    sections: ["new-arrivals", "featured-products"],
    detailedSpecs: new Map([
      ["display", "1.9-inch LTPO OLED Always-On Retina"],
      ["processor", "Apple S9 SiP"],
      ["battery", "Up to 18 hours"],
      ["features", "ECG, blood oxygen, heart rate, temperature, double tap gesture, crash detection, fall detection, 50m water resistant"]
    ])
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Comprehensive health tracking with Galaxy ecosystem integration and beautiful rotating bezel",
    price: 29999,
    originalPrice: 34999,
    images: [{
      url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
      alt: "Samsung Galaxy Watch 6"
    }],
    category: "wearables",
    brand: "Samsung",
    rating: 4.6,
    reviewCount: 1876,
    specs: ["Exynos W930", "40hr Battery", "AMOLED", "Sleep"],
    stockStatus: "in-stock",
    stockCount: 22,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "1.5-inch Super AMOLED"],
      ["processor", "Exynos W930"],
      ["battery", "Up to 40 hours"],
      ["features", "BioActive sensor, heart rate, ECG, body composition, sleep coaching, workout tracking, Samsung Pay, 5ATM + IP68"]
    ])
  },
  {
    name: "Amazfit GTR 4",
    description: "Long-lasting battery, accurate GPS, and comprehensive fitness tracking at an affordable price",
    price: 12999,
    originalPrice: 16999,
    images: [{
      url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      alt: "Amazfit GTR 4"
    }],
    category: "wearables",
    brand: "Amazfit",
    badge: "Hot Deal",
    rating: 4.5,
    reviewCount: 3421,
    specs: ["14 Day Battery", "GPS", "AMOLED", "150+ Sports"],
    stockStatus: "in-stock",
    stockCount: 35,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "1.43-inch AMOLED"],
      ["battery", "Up to 14 days typical use"],
      ["features", "Dual-band circularly-polarized GPS, BioTracker 4.0 PPG, 150+ sports modes, strength training recognition, Alexa, 5ATM"]
    ])
  },

  // POWER BANKS
  {
    name: "Anker PowerCore 20000mAh",
    description: "High-capacity power bank with dual USB ports and PowerIQ technology for fast charging",
    price: 2999,
    originalPrice: 3999,
    images: [{
      url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
      alt: "Anker PowerCore 20000mAh"
    }],
    category: "accessories",
    subcategory: "power-banks",
    brand: "Anker",
    rating: 4.7,
    reviewCount: 4532,
    specs: ["20000mAh", "Dual USB", "PowerIQ", "Fast Charge"],
    stockStatus: "in-stock",
    stockCount: 45,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["capacity", "20000mAh (74Wh)"],
      ["output", "4.8A total output, 2x USB-A with PowerIQ"],
      ["input", "Micro USB & USB-C"],
      ["features", "MultiProtect safety system, surge protection"],
      ["weight", "356g"]
    ])
  },
  {
    name: "Mi Power Bank 3i 20000mAh",
    description: "Affordable high-capacity power bank with 18W fast charging support and triple output ports",
    price: 1799,
    originalPrice: 2499,
    images: [{
      url: "https://images.unsplash.com/photo-1609592806716-e3abb0d4b74e",
      alt: "Mi Power Bank 3i"
    }],
    category: "accessories",
    subcategory: "power-banks",
    brand: "Mi",
    badge: "Hot Deal",
    rating: 4.5,
    reviewCount: 6789,
    specs: ["20000mAh", "18W Fast", "Triple Port", "LED Display"],
    stockStatus: "in-stock",
    stockCount: 70,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["capacity", "20000mAh"],
      ["output", "18W max (USB-C), 12W (USB-A), 2x USB-A, 1x USB-C"],
      ["input", "USB-C & Micro USB"],
      ["features", "LED display, 12-layer protection"],
      ["weight", "434g"]
    ])
  },

  // PHONE CASES & PROTECTION
  {
    name: "Spigen Rugged Armor Case",
    description: "Durable TPU case with carbon fiber texture and raised edges for screen protection",
    price: 899,
    originalPrice: 1299,
    images: [{
      url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
      alt: "Spigen Rugged Armor Case"
    }],
    category: "accessories",
    subcategory: "cases",
    brand: "Spigen",
    rating: 4.6,
    reviewCount: 2876,
    specs: ["TPU Material", "Shock Proof", "Raised Edges", "Universal Fit"],
    stockStatus: "in-stock",
    stockCount: 150,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["material", "Flexible TPU with carbon fiber design"],
      ["protection", "Military-grade drop protection"],
      ["features", "Air cushion technology, precise cutouts"],
      ["compatibility", "Available for multiple phone models"],
      ["weight", "30g"]
    ])
  },
  {
    name: "Tempered Glass Screen Protector 2-Pack",
    description: "9H hardness tempered glass with oleophobic coating and bubble-free installation",
    price: 299,
    originalPrice: 599,
    images: [{
      url: "https://images.unsplash.com/photo-1585857188823-eb164097a3e8",
      alt: "Tempered Glass Screen Protector"
    }],
    category: "accessories",
    subcategory: "screen-protectors",
    brand: "Generic",
    rating: 4.3,
    reviewCount: 5421,
    specs: ["9H Hardness", "2 Pack", "HD Clear", "Bubble Free"],
    stockStatus: "in-stock",
    stockCount: 200,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "9H tempered glass, 0.33mm ultra-thin"],
      ["features", "Anti-fingerprint, 99.9% transparency, easy installation kit"],
      ["compatibility", "Multiple phone models available"],
      ["includes", "2x glass, cleaning kit, installation guide"]
    ])
  },

  // MORE SMARTPHONES
  {
    name: "Realme GT 3",
    description: "Speed flagship with 240W charging, Snapdragon 8+ Gen 1, and brilliant AMOLED display",
    price: 42999,
    originalPrice: 49999,
    images: [{
      url: "https://images.unsplash.com/photo-1565849904461-04e41d6b8b89",
      alt: "Realme GT 3"
    }],
    category: "smartphones",
    brand: "Realme",
    badge: "Hot Deal",
    rating: 4.4,
    reviewCount: 1567,
    specs: ["16GB RAM", "256GB Storage", "50MP Camera", "4600mAh"],
    stockStatus: "in-stock",
    stockCount: 28,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.74-inch AMOLED, 144Hz"],
      ["processor", "Snapdragon 8+ Gen 1"],
      ["ram", "16GB LPDDR5"],
      ["storage", "256GB UFS 3.1"],
      ["camera", "50MP + 8MP + 2MP"],
      ["battery", "4600mAh with 240W SuperVOOC"],
      ["os", "Realme UI 4.0 based on Android 13"]
    ])
  },
  {
    name: "Oppo Find X6 Pro",
    description: "Premium camera phone with Hasselblad partnership, powerful chipset, and luxurious design",
    price: 79999,
    originalPrice: 89999,
    images: [{
      url: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
      alt: "Oppo Find X6 Pro"
    }],
    category: "smartphones",
    brand: "Oppo",
    badge: "New Arrival",
    rating: 4.7,
    reviewCount: 892,
    specs: ["12GB RAM", "256GB Storage", "50MP Hasselblad", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 14,
    sections: ["new-arrivals", "featured-products"],
    detailedSpecs: new Map([
      ["display", "6.82-inch LTPO AMOLED, 120Hz"],
      ["processor", "Snapdragon 8 Gen 2"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 4.0"],
      ["camera", "50MP + 50MP + 50MP Hasselblad"],
      ["battery", "5000mAh with 100W SuperVOOC"],
      ["os", "ColorOS 13.1 based on Android 13"]
    ])
  },
  {
    name: "Motorola Edge 40 Pro",
    description: "Flagship performance with clean Android experience, curved display, and versatile camera system",
    price: 49999,
    originalPrice: 55999,
    images: [{
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      alt: "Motorola Edge 40 Pro"
    }],
    category: "smartphones",
    brand: "Motorola",
    rating: 4.5,
    reviewCount: 1123,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "4600mAh"],
    stockStatus: "in-stock",
    stockCount: 19,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "6.67-inch pOLED, 165Hz"],
      ["processor", "Snapdragon 8 Gen 2"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 4.0"],
      ["camera", "50MP + 50MP + 12MP"],
      ["battery", "4600mAh with 125W TurboPower"],
      ["os", "Stock Android 13"]
    ])
  },
  {
    name: "Asus ROG Phone 7",
    description: "Ultimate gaming smartphone with advanced cooling, 165Hz display, and massive 6000mAh battery",
    price: 74999,
    originalPrice: 84999,
    images: [{
      url: "https://images.unsplash.com/photo-1556656793-08538906a9f8",
      alt: "Asus ROG Phone 7"
    }],
    category: "smartphones",
    brand: "Asus",
    badge: "Gaming Beast",
    rating: 4.8,
    reviewCount: 1654,
    specs: ["16GB RAM", "512GB Storage", "50MP Camera", "6000mAh"],
    stockStatus: "in-stock",
    stockCount: 11,
    sections: ["new-arrivals"],
    detailedSpecs: new Map([
      ["display", "6.78-inch AMOLED, 165Hz"],
      ["processor", "Snapdragon 8 Gen 2"],
      ["ram", "16GB LPDDR5X"],
      ["storage", "512GB UFS 4.0"],
      ["camera", "50MP + 13MP + 5MP"],
      ["battery", "6000mAh with 65W fast charging"],
      ["os", "ROG UI based on Android 13"]
    ])
  },

  // TABLETS
  {
    name: "Apple iPad Air 5th Gen",
    description: "Powerful M1 chip, stunning 10.9-inch Liquid Retina display, and Apple Pencil support",
    price: 59900,
    originalPrice: 64900,
    images: [{
      url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
      alt: "Apple iPad Air 5th Gen"
    }],
    category: "tablets",
    brand: "Apple",
    badge: "Editor's Choice",
    rating: 4.8,
    reviewCount: 3456,
    specs: ["M1 Chip", "64GB Storage", "10.9-inch", "Apple Pencil"],
    stockStatus: "in-stock",
    stockCount: 18,
    sections: ["featured-products", "new-arrivals"],
    detailedSpecs: new Map([
      ["display", "10.9-inch Liquid Retina, True Tone"],
      ["processor", "Apple M1 chip"],
      ["storage", "64GB"],
      ["camera", "12MP Wide + 12MP Ultra Wide front"],
      ["battery", "Up to 10 hours"],
      ["os", "iPadOS 16"],
      ["features", "Touch ID, USB-C, 5G support"]
    ])
  },
  {
    name: "Samsung Galaxy Tab S9",
    description: "Premium Android tablet with S Pen included, Dynamic AMOLED display, and DeX mode",
    price: 54999,
    originalPrice: 62999,
    images: [{
      url: "https://images.unsplash.com/photo-1561154464-82e9adf32764",
      alt: "Samsung Galaxy Tab S9"
    }],
    category: "tablets",
    brand: "Samsung",
    badge: "Bestseller",
    rating: 4.7,
    reviewCount: 2789,
    specs: ["Snapdragon 8 Gen 2", "128GB Storage", "11-inch", "S Pen"],
    stockStatus: "in-stock",
    stockCount: 23,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "11-inch Dynamic AMOLED 2X, 120Hz"],
      ["processor", "Snapdragon 8 Gen 2 for Galaxy"],
      ["ram", "8GB"],
      ["storage", "128GB (expandable)"],
      ["camera", "13MP + 8MP front"],
      ["battery", "8400mAh with 45W charging"],
      ["os", "Android 13 with One UI 5.1"],
      ["features", "S Pen included, IP68, DeX mode"]
    ])
  },
  {
    name: "Lenovo Tab P11 Pro Gen 2",
    description: "Affordable premium tablet with OLED display, quad speakers, and stylus support",
    price: 34999,
    originalPrice: 39999,
    images: [{
      url: "https://images.unsplash.com/photo-1585790050230-5dd28404f8db",
      alt: "Lenovo Tab P11 Pro Gen 2"
    }],
    category: "tablets",
    brand: "Lenovo",
    badge: "Hot Deal",
    rating: 4.5,
    reviewCount: 1234,
    specs: ["MediaTek 6080", "128GB Storage", "11.2-inch", "OLED"],
    stockStatus: "in-stock",
    stockCount: 30,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "11.2-inch OLED, 120Hz, HDR10+"],
      ["processor", "MediaTek Kompanio 1300T"],
      ["ram", "6GB"],
      ["storage", "128GB (expandable)"],
      ["camera", "13MP + 8MP front"],
      ["battery", "8000mAh with 20W charging"],
      ["os", "Android 12"],
      ["features", "Quad JBL speakers, Dolby Atmos, stylus support"]
    ])
  },

  // MORE AUDIO PRODUCTS
  {
    name: "Sennheiser Momentum 4 Wireless",
    description: "Audiophile-grade headphones with exceptional sound, 60-hour battery, and premium comfort",
    price: 29999,
    originalPrice: 34999,
    images: [{
      url: "https://images.unsplash.com/photo-1545127398-14699f92334b",
      alt: "Sennheiser Momentum 4 Wireless"
    }],
    category: "audio",
    brand: "Sennheiser",
    badge: "Premium",
    rating: 4.8,
    reviewCount: 1876,
    specs: ["60hr Battery", "ANC", "aptX Adaptive", "Foldable"],
    stockStatus: "in-stock",
    stockCount: 16,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["type", "Over-ear wireless headphones"],
      ["drivers", "42mm transducer system"],
      ["battery", "60 hours with ANC"],
      ["connectivity", "Bluetooth 5.2, aptX Adaptive, AAC"],
      ["features", "Adaptive ANC, sound personalization, multipoint"],
      ["weight", "293g"]
    ])
  },
  {
    name: "Bose QuietComfort Earbuds II",
    description: "Premium noise-cancelling earbuds with personalized audio and all-day comfort",
    price: 22999,
    originalPrice: 26999,
    images: [{
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      alt: "Bose QuietComfort Earbuds II"
    }],
    category: "audio",
    brand: "Bose",
    badge: "Best ANC",
    rating: 4.7,
    reviewCount: 2341,
    specs: ["6hr Battery", "ANC", "IPX4", "CustomTune"],
    stockStatus: "in-stock",
    stockCount: 24,
    sections: ["featured-products", "top-accessories"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["battery", "6 hours, 24 hours with case"],
      ["connectivity", "Bluetooth 5.3"],
      ["features", "CustomTune sound calibration, adaptive ANC, transparency mode, IPX4"],
      ["weight", "6.24g per earbud"]
    ])
  },
  {
    name: "Jabra Elite 85t",
    description: "Advanced ANC earbuds with adjustable levels, great call quality, and wireless charging",
    price: 14999,
    originalPrice: 19999,
    images: [{
      url: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7",
      alt: "Jabra Elite 85t"
    }],
    category: "audio",
    brand: "Jabra",
    rating: 4.6,
    reviewCount: 1987,
    specs: ["5.5hr Battery", "ANC", "6 Mics", "Wireless Charge"],
    stockStatus: "in-stock",
    stockCount: 32,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "12mm speakers"],
      ["battery", "5.5 hours with ANC, 25 hours total"],
      ["connectivity", "Bluetooth 5.1, multipoint"],
      ["features", "Adjustable ANC, 6-mic technology, wireless charging, IPX4"],
      ["weight", "7g per earbud"]
    ])
  },
  {
    name: "Marshall Emberton II",
    description: "Iconic portable speaker with signature Marshall sound, IP67 rating, and 30-hour playtime",
    price: 14999,
    originalPrice: 17999,
    images: [{
      url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      alt: "Marshall Emberton II"
    }],
    category: "audio",
    brand: "Marshall",
    badge: "Editor's Choice",
    rating: 4.7,
    reviewCount: 1543,
    specs: ["30hr Battery", "IP67", "360° Sound", "Wireless"],
    stockStatus: "in-stock",
    stockCount: 27,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Portable Bluetooth speaker"],
      ["drivers", "True Stereophonic multi-directional sound"],
      ["battery", "30+ hours playtime"],
      ["connectivity", "Bluetooth 5.1, Stack mode"],
      ["features", "360-degree sound, IP67 waterproof, USB-C charging"],
      ["weight", "700g"]
    ])
  },

  // MORE WEARABLES
  {
    name: "Garmin Forerunner 265",
    description: "Advanced running watch with AMOLED display, training metrics, and 13-day battery life",
    price: 39999,
    originalPrice: 44999,
    images: [{
      url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      alt: "Garmin Forerunner 265"
    }],
    category: "wearables",
    brand: "Garmin",
    badge: "Premium",
    rating: 4.8,
    reviewCount: 1876,
    specs: ["13 Day Battery", "AMOLED", "GPS", "Training"],
    stockStatus: "in-stock",
    stockCount: 13,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "1.3-inch AMOLED touchscreen"],
      ["battery", "13 days smartwatch, 20 hours GPS"],
      ["features", "Training readiness, HRV status, race predictor, music storage, Garmin Pay, 5ATM"],
      ["weight", "47g"]
    ])
  },
  {
    name: "Fitbit Charge 6",
    description: "Advanced fitness tracker with Google integration, heart rate monitoring, and 7-day battery",
    price: 12999,
    originalPrice: 15999,
    images: [{
      url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
      alt: "Fitbit Charge 6"
    }],
    category: "wearables",
    brand: "Fitbit",
    badge: "Bestseller",
    rating: 4.5,
    reviewCount: 3421,
    specs: ["7 Day Battery", "GPS", "Heart Rate", "Google Apps"],
    stockStatus: "in-stock",
    stockCount: 45,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "1.04-inch AMOLED color touchscreen"],
      ["battery", "Up to 7 days"],
      ["features", "Built-in GPS, Google Maps, YouTube Music, heart rate monitoring, stress management, sleep tracking, 5ATM"],
      ["weight", "29g"]
    ])
  },

  // MORE ACCESSORIES
  {
    name: "Apple MagSafe Charger",
    description: "Official wireless charger for iPhone with perfect magnetic alignment and 15W charging",
    price: 3999,
    originalPrice: 4500,
    images: [{
      url: "https://images.unsplash.com/photo-1591290619762-c588e5fb0e7d",
      alt: "Apple MagSafe Charger"
    }],
    category: "accessories",
    subcategory: "chargers",
    brand: "Apple",
    badge: "Apple Certified",
    rating: 4.7,
    reviewCount: 4567,
    specs: ["15W Wireless", "MagSafe", "USB-C", "Official"],
    stockStatus: "in-stock",
    stockCount: 55,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Wireless magnetic charger"],
      ["output", "Up to 15W for iPhone 12 and later"],
      ["compatibility", "All MagSafe compatible devices"],
      ["features", "Perfect magnetic alignment, USB-C cable (1m)"]
    ])
  },
  {
    name: "Baseus 100W USB-C Cable",
    description: "High-speed charging cable with E-marker chip supporting 100W PD and 480Mbps data transfer",
    price: 899,
    originalPrice: 1499,
    images: [{
      url: "https://images.unsplash.com/photo-1625948515291-69613efd103f",
      alt: "Baseus 100W USB-C Cable"
    }],
    category: "accessories",
    subcategory: "cables",
    brand: "Baseus",
    rating: 4.6,
    reviewCount: 2987,
    specs: ["100W PD", "1m Length", "E-Marker", "Durable"],
    stockStatus: "in-stock",
    stockCount: 120,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "USB-C to USB-C cable with E-marker chip"],
      ["features", "100W (20V/5A) power delivery, 480Mbps data transfer, zinc alloy connector, 20,000+ bend lifespan"]
    ])
  },
  {
    name: "Otterbox Defender Series Case",
    description: "Rugged multi-layer protection with port covers and included holster clip",
    price: 1799,
    originalPrice: 2499,
    images: [{
      url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
      alt: "Otterbox Defender Series Case"
    }],
    category: "accessories",
    subcategory: "cases",
    brand: "Otterbox",
    badge: "Premium",
    rating: 4.8,
    reviewCount: 3456,
    specs: ["Multi-Layer", "Port Covers", "Holster", "MIL-STD"],
    stockStatus: "in-stock",
    stockCount: 75,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["material", "Polycarbonate shell + synthetic rubber slipcover"],
      ["protection", "Multi-layer defense, port covers, screen bumper"],
      ["features", "DROP+ protection (3x military standard), belt-clip holster"],
      ["compatibility", "Available for multiple phone models"]
    ])
  },
  {
    name: "Samsung 10000mAh Wireless Power Bank",
    description: "Slim power bank with wireless charging, dual outputs, and fast charging support",
    price: 2499,
    originalPrice: 3499,
    images: [{
      url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
      alt: "Samsung Wireless Power Bank"
    }],
    category: "accessories",
    subcategory: "power-banks",
    brand: "Samsung",
    badge: "Official",
    rating: 4.6,
    reviewCount: 2134,
    specs: ["10000mAh", "Wireless", "25W Output", "LED Display"],
    stockStatus: "in-stock",
    stockCount: 40,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["capacity", "10000mAh"],
      ["output", "25W wired (USB-C), 7.5W wireless"],
      ["input", "USB-C PD"],
      ["features", "Qi wireless charging, LED display, pass-through charging"],
      ["weight", "218g"]
    ])
  },
  {
    name: "dbrand Grip Case",
    description: "Slim protective case with micro-dot texture for superior grip and customizable skins",
    price: 1299,
    originalPrice: 1799,
    images: [{
      url: "https://images.unsplash.com/photo-1556656793-08538906a9f8",
      alt: "dbrand Grip Case"
    }],
    category: "accessories",
    subcategory: "cases",
    brand: "dbrand",
    badge: "Editor's Choice",
    rating: 4.7,
    reviewCount: 1876,
    specs: ["Micro-Dot", "Slim Design", "Drop Protection", "Custom Skins"],
    stockStatus: "in-stock",
    stockCount: 90,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["material", "Hybrid TPU with micro-dot texture"],
      ["protection", "Corner and edge protection, raised camera lip"],
      ["features", "Superior grip, skin-ready surface, precise cutouts"],
      ["compatibility", "Available for multiple phone models"]
    ])
  },

  // MORE SMARTPHONES - MID-RANGE & BUDGET
  {
    name: "iPhone 14",
    description: "Reliable iPhone with A15 Bionic chip, dual camera system, and all-day battery life",
    price: 69900,
    originalPrice: 79900,
    images: [{
      url: "https://images.unsplash.com/photo-1663499482523-1c0d8c469772",
      alt: "Apple iPhone 14"
    }],
    category: "smartphones",
    brand: "Apple",
    badge: "Bestseller",
    rating: 4.7,
    reviewCount: 5678,
    specs: ["6GB RAM", "128GB Storage", "12MP Camera", "A15 Bionic"],
    stockStatus: "in-stock",
    stockCount: 35,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["display", "6.1-inch Super Retina XDR OLED"],
      ["processor", "A15 Bionic chip"],
      ["ram", "6GB"],
      ["storage", "128GB"],
      ["camera", "12MP dual camera system"],
      ["battery", "Up to 20 hours video playback"],
      ["os", "iOS 17"]
    ])
  },
  {
    name: "Samsung Galaxy A54 5G",
    description: "Premium mid-range phone with Exynos 1380, 120Hz Super AMOLED, and versatile camera",
    price: 38999,
    originalPrice: 43999,
    images: [{
      url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
      alt: "Samsung Galaxy A54 5G"
    }],
    category: "smartphones",
    brand: "Samsung",
    badge: "Bestseller",
    rating: 4.5,
    reviewCount: 4321,
    specs: ["8GB RAM", "128GB Storage", "50MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 42,
    sections: ["featured-products", "flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.4-inch Super AMOLED, 120Hz"],
      ["processor", "Exynos 1380"],
      ["ram", "8GB"],
      ["storage", "128GB expandable"],
      ["camera", "50MP + 12MP + 5MP"],
      ["battery", "5000mAh with 25W charging"],
      ["os", "Android 13 with One UI 5.1"]
    ])
  },
  {
    name: "Poco X6 Pro",
    description: "Performance beast with Dimensity 8300 Ultra, 67W charging, and flagship features at mid-range price",
    price: 28999,
    originalPrice: 32999,
    images: [{
      url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
      alt: "Poco X6 Pro"
    }],
    category: "smartphones",
    brand: "Poco",
    badge: "Hot Deal",
    rating: 4.4,
    reviewCount: 2876,
    specs: ["12GB RAM", "256GB Storage", "64MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 48,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.67-inch AMOLED, 120Hz"],
      ["processor", "MediaTek Dimensity 8300 Ultra"],
      ["ram", "12GB LPDDR5X"],
      ["storage", "256GB UFS 4.0"],
      ["camera", "64MP + 8MP + 2MP"],
      ["battery", "5000mAh with 67W turbo charging"],
      ["os", "MIUI 14 based on Android 13"]
    ])
  },
  {
    name: "Realme Narzo 60 Pro",
    description: "Stylish mid-ranger with curved AMOLED display, 100MP camera, and 67W SuperVOOC",
    price: 24999,
    originalPrice: 28999,
    images: [{
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      alt: "Realme Narzo 60 Pro"
    }],
    category: "smartphones",
    brand: "Realme",
    badge: "New Arrival",
    rating: 4.3,
    reviewCount: 1987,
    specs: ["12GB RAM", "256GB Storage", "100MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 52,
    sections: ["new-arrivals", "flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.7-inch curved AMOLED, 120Hz"],
      ["processor", "MediaTek Dimensity 7050"],
      ["ram", "12GB LPDDR4X"],
      ["storage", "256GB UFS 3.1"],
      ["camera", "100MP + 8MP + 2MP"],
      ["battery", "5000mAh with 67W SuperVOOC"],
      ["os", "Realme UI 4.0 based on Android 13"]
    ])
  },
  {
    name: "iQOO Neo 7 Pro",
    description: "Gaming-focused phone with Snapdragon 8+ Gen 1, 120W charging, and premium display",
    price: 34999,
    originalPrice: 39999,
    images: [{
      url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2",
      alt: "iQOO Neo 7 Pro"
    }],
    category: "smartphones",
    brand: "iQOO",
    badge: "Gaming Beast",
    rating: 4.6,
    reviewCount: 2134,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 28,
    sections: ["new-arrivals"],
    detailedSpecs: new Map([
      ["display", "6.78-inch AMOLED, 120Hz"],
      ["processor", "Snapdragon 8+ Gen 1"],
      ["ram", "12GB LPDDR5"],
      ["storage", "256GB UFS 3.1"],
      ["camera", "50MP + 8MP + 2MP"],
      ["battery", "5000mAh with 120W FlashCharge"],
      ["os", "Funtouch OS 13 based on Android 13"]
    ])
  },
  {
    name: "Moto G84 5G",
    description: "Stylish mid-ranger with vegan leather back, pOLED display, and clean Android experience",
    price: 18999,
    originalPrice: 21999,
    images: [{
      url: "https://images.unsplash.com/photo-1565849904461-04e41d6b8b89",
      alt: "Moto G84 5G"
    }],
    category: "smartphones",
    brand: "Motorola",
    rating: 4.4,
    reviewCount: 1654,
    specs: ["12GB RAM", "256GB Storage", "50MP Camera", "5000mAh"],
    stockStatus: "in-stock",
    stockCount: 38,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "6.55-inch pOLED, 120Hz"],
      ["processor", "Snapdragon 695"],
      ["ram", "12GB (8GB + 4GB virtual)"],
      ["storage", "256GB expandable"],
      ["camera", "50MP + 8MP"],
      ["battery", "5000mAh with 30W TurboPower"],
      ["os", "Stock Android 13"]
    ])
  },

  // MORE TABLETS
  {
    name: "OnePlus Pad",
    description: "Large 11.61-inch display, powerful MediaTek processor, and excellent battery life",
    price: 37999,
    originalPrice: 42999,
    images: [{
      url: "https://images.unsplash.com/photo-1585790050230-5dd28404f8db",
      alt: "OnePlus Pad"
    }],
    category: "tablets",
    brand: "OnePlus",
    badge: "New Arrival",
    rating: 4.6,
    reviewCount: 1432,
    specs: ["Dimensity 9000", "128GB Storage", "11.61-inch", "Dolby Atmos"],
    stockStatus: "in-stock",
    stockCount: 21,
    sections: ["new-arrivals"],
    detailedSpecs: new Map([
      ["display", "11.61-inch LCD, 144Hz, 2.8K"],
      ["processor", "MediaTek Dimensity 9000"],
      ["ram", "8GB"],
      ["storage", "128GB"],
      ["camera", "13MP + 8MP front"],
      ["battery", "9510mAh with 67W SuperVOOC"],
      ["os", "OxygenOS 13.1 based on Android 13"],
      ["features", "Quad speakers with Dolby Atmos, magnetic keyboard support"]
    ])
  },
  {
    name: "Xiaomi Pad 6",
    description: "Affordable tablet with 144Hz display, quad speakers, and stylus support",
    price: 26999,
    originalPrice: 29999,
    images: [{
      url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
      alt: "Xiaomi Pad 6"
    }],
    category: "tablets",
    brand: "Xiaomi",
    badge: "Hot Deal",
    rating: 4.5,
    reviewCount: 2345,
    specs: ["Snapdragon 870", "128GB Storage", "11-inch", "8840mAh"],
    stockStatus: "in-stock",
    stockCount: 34,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "11-inch LCD, 144Hz, 2.8K"],
      ["processor", "Snapdragon 870"],
      ["ram", "6GB"],
      ["storage", "128GB expandable"],
      ["camera", "13MP + 8MP front"],
      ["battery", "8840mAh with 33W charging"],
      ["os", "MIUI Pad 14 based on Android 13"],
      ["features", "Quad speakers with Dolby Atmos, stylus support"]
    ])
  },

  // MORE AUDIO - EARBUDS & SPEAKERS
  {
    name: "Samsung Galaxy Buds 2 Pro",
    description: "Premium earbuds with intelligent ANC, 360 audio, and seamless Galaxy integration",
    price: 14999,
    originalPrice: 17999,
    images: [{
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      alt: "Samsung Galaxy Buds 2 Pro"
    }],
    category: "audio",
    brand: "Samsung",
    badge: "Premium",
    rating: 4.6,
    reviewCount: 3421,
    specs: ["5hr Battery", "ANC", "360 Audio", "IPX7"],
    stockStatus: "in-stock",
    stockCount: 38,
    sections: ["featured-products"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "10mm + 5.3mm 2-way speakers"],
      ["battery", "5 hours with ANC, 18 hours total"],
      ["connectivity", "Bluetooth 5.3"],
      ["features", "Intelligent ANC, 360 audio, voice detect, IPX7"],
      ["weight", "5.5g per earbud"]
    ])
  },
  {
    name: "Nothing Ear (2)",
    description: "Transparent design earbuds with adaptive ANC, long battery life, and premium sound",
    price: 8999,
    originalPrice: 10999,
    images: [{
      url: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7",
      alt: "Nothing Ear (2)"
    }],
    category: "audio",
    brand: "Nothing",
    badge: "Editor's Choice",
    rating: 4.5,
    reviewCount: 2765,
    specs: ["6.3hr Battery", "ANC", "LDAC", "Unique Design"],
    stockStatus: "in-stock",
    stockCount: 45,
    sections: ["featured-products", "flash-deals"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "11.6mm dynamic drivers"],
      ["battery", "6.3 hours with ANC, 36 hours total"],
      ["connectivity", "Bluetooth 5.3, LDAC"],
      ["features", "Adaptive ANC, transparency mode, dual connection, IP54"],
      ["weight", "4.5g per earbud"]
    ])
  },
  {
    name: "Soundcore Liberty 4",
    description: "Feature-packed earbuds with LDAC, heart rate sensor, and spatial audio",
    price: 7999,
    originalPrice: 10999,
    images: [{
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      alt: "Soundcore Liberty 4"
    }],
    category: "audio",
    brand: "Soundcore",
    badge: "Hot Deal",
    rating: 4.4,
    reviewCount: 1987,
    specs: ["9hr Battery", "LDAC", "Heart Rate", "ANC"],
    stockStatus: "in-stock",
    stockCount: 52,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "9.2mm + 6mm dual drivers"],
      ["battery", "9 hours, 28 hours total"],
      ["connectivity", "Bluetooth 5.3, LDAC"],
      ["features", "Adaptive ANC, heart rate sensor, spatial audio, wireless charging, IPX4"],
      ["weight", "5.8g per earbud"]
    ])
  },
  {
    name: "Oppo Enco Air3 Pro",
    description: "Affordable ANC earbuds with 49dB noise cancellation and 30-hour battery",
    price: 4999,
    originalPrice: 6999,
    images: [{
      url: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7",
      alt: "Oppo Enco Air3 Pro"
    }],
    category: "audio",
    brand: "Oppo",
    rating: 4.3,
    reviewCount: 2456,
    specs: ["6hr Battery", "49dB ANC", "IP55", "Low Latency"],
    stockStatus: "in-stock",
    stockCount: 68,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "True wireless earbuds"],
      ["drivers", "12.4mm titanized drivers"],
      ["battery", "6 hours with ANC, 30 hours total"],
      ["connectivity", "Bluetooth 5.3"],
      ["features", "49dB ANC, transparency mode, 94ms low latency, IP55"],
      ["weight", "4g per earbud"]
    ])
  },
  {
    name: "Boat Stone 1508",
    description: "Rugged Bluetooth speaker with 10W output, IPX7 rating, and 7-hour playtime",
    price: 1999,
    originalPrice: 2999,
    images: [{
      url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      alt: "Boat Stone 1508"
    }],
    category: "audio",
    brand: "Boat",
    rating: 4.2,
    reviewCount: 4567,
    specs: ["7hr Battery", "10W Output", "IPX7", "Bluetooth 5.3"],
    stockStatus: "in-stock",
    stockCount: 85,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "Portable Bluetooth speaker"],
      ["output", "10W RMS"],
      ["battery", "7 hours playtime"],
      ["connectivity", "Bluetooth 5.3"],
      ["features", "IPX7 waterproof, TWS support, RGB lights"],
      ["weight", "400g"]
    ])
  },
  {
    name: "Zebronics Zeb-Sound Bomb X1",
    description: "Budget portable speaker with powerful bass, FM radio, and multi-connectivity",
    price: 1299,
    originalPrice: 1999,
    images: [{
      url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      alt: "Zebronics Sound Bomb X1"
    }],
    category: "audio",
    brand: "Zebronics",
    rating: 4.0,
    reviewCount: 3421,
    specs: ["6hr Battery", "FM Radio", "USB/SD", "Bluetooth"],
    stockStatus: "in-stock",
    stockCount: 95,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["type", "Portable Bluetooth speaker"],
      ["output", "5W"],
      ["battery", "6 hours playtime"],
      ["connectivity", "Bluetooth 5.0, USB, SD card, AUX"],
      ["features", "FM radio, call function, LED display"],
      ["weight", "350g"]
    ])
  },

  // MORE WEARABLES
  {
    name: "Noise ColorFit Pro 4",
    description: "Feature-rich smartwatch with AMOLED display, 100+ sports modes, and 7-day battery",
    price: 2999,
    originalPrice: 4499,
    images: [{
      url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
      alt: "Noise ColorFit Pro 4"
    }],
    category: "wearables",
    brand: "Noise",
    badge: "Bestseller",
    rating: 4.3,
    reviewCount: 8765,
    specs: ["7 Day Battery", "AMOLED", "100+ Sports", "Bluetooth Call"],
    stockStatus: "in-stock",
    stockCount: 75,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "1.78-inch AMOLED touchscreen"],
      ["battery", "Up to 7 days"],
      ["features", "100+ sports modes, heart rate, SpO2, sleep tracking, Bluetooth calling, IP68"],
      ["weight", "33g"]
    ])
  },
  {
    name: "Fire-Boltt Phoenix Pro",
    description: "Affordable smartwatch with large display, voice assistant, and comprehensive health tracking",
    price: 1999,
    originalPrice: 3499,
    images: [{
      url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      alt: "Fire-Boltt Phoenix Pro"
    }],
    category: "wearables",
    brand: "Fire-Boltt",
    badge: "Hot Deal",
    rating: 4.1,
    reviewCount: 6543,
    specs: ["7 Day Battery", "1.39-inch", "120+ Sports", "SpO2"],
    stockStatus: "in-stock",
    stockCount: 88,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "1.39-inch HD touchscreen"],
      ["battery", "Up to 7 days"],
      ["features", "120+ sports modes, heart rate, SpO2, sleep tracking, voice assistant, IP67"],
      ["weight", "45g"]
    ])
  },
  {
    name: "boAt Wave Call 2",
    description: "Budget smartwatch with Bluetooth calling, health tracking, and stylish design",
    price: 1799,
    originalPrice: 2999,
    images: [{
      url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
      alt: "boAt Wave Call 2"
    }],
    category: "wearables",
    brand: "Boat",
    rating: 4.0,
    reviewCount: 5432,
    specs: ["7 Day Battery", "1.83-inch", "Bluetooth Call", "100+ Sports"],
    stockStatus: "in-stock",
    stockCount: 92,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["display", "1.83-inch HD touchscreen"],
      ["battery", "Up to 7 days"],
      ["features", "Bluetooth calling, 100+ sports modes, heart rate, SpO2, IP68"],
      ["weight", "38g"]
    ])
  },

  // MORE POWER BANKS
  {
    name: "Ambrane 27000mAh Power Bank",
    description: "Ultra high-capacity power bank with triple outputs and fast charging support",
    price: 2299,
    originalPrice: 3499,
    images: [{
      url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
      alt: "Ambrane 27000mAh Power Bank"
    }],
    category: "accessories",
    subcategory: "power-banks",
    brand: "Ambrane",
    rating: 4.4,
    reviewCount: 3456,
    specs: ["27000mAh", "Triple Output", "22.5W Fast", "LED Display"],
    stockStatus: "in-stock",
    stockCount: 48,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["capacity", "27000mAh"],
      ["output", "22.5W fast charging, 3x USB outputs"],
      ["input", "Type-C & Micro USB"],
      ["features", "LED display, multi-protection system"],
      ["weight", "520g"]
    ])
  },
  {
    name: "Realme 10000mAh Power Bank 2",
    description: "Slim power bank with 18W fast charging, dual outputs, and low-current mode",
    price: 1199,
    originalPrice: 1799,
    images: [{
      url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
      alt: "Realme 10000mAh Power Bank"
    }],
    category: "accessories",
    subcategory: "power-banks",
    brand: "Realme",
    rating: 4.3,
    reviewCount: 2876,
    specs: ["10000mAh", "18W Fast", "Dual Output", "Slim Design"],
    stockStatus: "in-stock",
    stockCount: 65,
    sections: ["flash-deals"],
    detailedSpecs: new Map([
      ["capacity", "10000mAh"],
      ["output", "18W fast charging, 2x USB outputs"],
      ["input", "USB-C & Micro USB"],
      ["features", "12-layer protection, low-current mode for wearables"],
      ["weight", "225g"]
    ])
  },

  // MORE CASES & PROTECTION
  {
    name: "Ringke Fusion Case",
    description: "Clear protective case with reinforced corners, military-grade protection, and scratch resistance",
    price: 799,
    originalPrice: 1299,
    images: [{
      url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
      alt: "Ringke Fusion Case"
    }],
    category: "accessories",
    subcategory: "cases",
    brand: "Ringke",
    rating: 4.6,
    reviewCount: 2987,
    specs: ["Clear Design", "Military Grade", "Raised Edges", "Anti-Yellowing"],
    stockStatus: "in-stock",
    stockCount: 110,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["material", "Clear polycarbonate back + TPU bumper"],
      ["protection", "Military-grade drop protection (MIL-STD 810G-516.6)"],
      ["features", "Anti-yellowing coating, raised bezels, precise cutouts"],
      ["compatibility", "Available for multiple phone models"]
    ])
  },
  {
    name: "Nillkin CamShield Pro Case",
    description: "Innovative case with sliding camera cover for privacy and lens protection",
    price: 999,
    originalPrice: 1499,
    images: [{
      url: "https://images.unsplash.com/photo-1556656793-08538906a9f8",
      alt: "Nillkin CamShield Pro Case"
    }],
    category: "accessories",
    subcategory: "cases",
    brand: "Nillkin",
    badge: "Editor's Choice",
    rating: 4.7,
    reviewCount: 2456,
    specs: ["Camera Cover", "Matte Finish", "Drop Protection", "Premium Build"],
    stockStatus: "in-stock",
    stockCount: 78,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["material", "Premium PC with matte finish"],
      ["protection", "Sliding camera cover, corner cushions, raised edges"],
      ["features", "Privacy protection, anti-fingerprint, precise cutouts"],
      ["compatibility", "Available for multiple phone models"]
    ])
  },
  {
    name: "Privacy Tempered Glass Screen Protector",
    description: "Anti-spy screen protector with 9H hardness and privacy filter for secure viewing",
    price: 499,
    originalPrice: 899,
    images: [{
      url: "https://images.unsplash.com/photo-1585857188823-eb164097a3e8",
      alt: "Privacy Screen Protector"
    }],
    category: "accessories",
    subcategory: "screen-protectors",
    brand: "Generic",
    badge: "Hot Deal",
    rating: 4.4,
    reviewCount: 3214,
    specs: ["9H Hardness", "Privacy Filter", "Anti-Spy", "Easy Install"],
    stockStatus: "in-stock",
    stockCount: 145,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Privacy tempered glass, 0.33mm"],
      ["features", "Anti-spy filter (28° viewing angle), 9H hardness, oleophobic coating"],
      ["compatibility", "Multiple phone models available"],
      ["includes", "Glass, cleaning kit, installation guide"]
    ])
  },

  // MORE CHARGERS & CABLES
  {
    name: "Portronics Power Plate 7",
    description: "7-port USB hub with 65W total output and smart IC technology for optimal charging",
    price: 1999,
    originalPrice: 2999,
    images: [{
      url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
      alt: "Portronics Power Plate 7"
    }],
    category: "accessories",
    subcategory: "chargers",
    brand: "Portronics",
    rating: 4.5,
    reviewCount: 1765,
    specs: ["7 Ports", "65W Total", "Smart IC", "Compact"],
    stockStatus: "in-stock",
    stockCount: 42,
    sections: ["top-accessories"],
    detailedSpecs: new Map([
      ["type", "Multi-port USB charging station"],
      ["output", "65W total across 7 USB ports"],
      ["features", "Smart IC for device detection, over-current protection, compact design"],
      ["compatibility", "Universal for all USB devices"]
    ])
  }];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shiv-mobile-hub');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    // await Product.deleteMany({});
    // await Section.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@shivmobilehub.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Create sections and associate products
    for (const sectionData of sampleSections) {
      const section = new Section(sectionData);
      
      // Add products to sections based on sections array
      const sectionProducts = createdProducts.filter(product => 
        product.sections.includes(section.name)
      );
      section.products = sectionProducts.map(p => p._id);
      
      await section.save();
    }
    console.log('Created sections with products');

    // Create services
    await Service.insertMany(sampleServices);
    console.log(`Created ${sampleServices.length} services`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
