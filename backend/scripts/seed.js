const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Section = require('../models/Section');
const Service = require('../models/Service');
const Category = require('../models/Category');

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

// Sample categories
const categories = [
  { name: 'Smartphones', type: 'product', description: 'Mobile phones and related devices', isActive: true },
  { name: 'Wearables', type: 'product', description: 'Smartwatches and fitness trackers', isActive: true, parent: null },
  { name: 'Repair Services', type: 'service', description: 'Device repair and maintenance', isActive: true },
  { name: 'Consultation', type: 'service', description: 'Expert advice on tech products', isActive: true }
];

// Sample services
const services = [
  { name: 'Screen Repair', description: 'Fix cracked screens on mobiles', price: 50, priceType: 'fixed', category: 'Repair Services', isActive: true },
  { name: 'Battery Replacement', description: 'Replace worn-out batteries', price: 30, priceType: 'fixed', category: 'Repair Services', isActive: true },
  { name: 'Product Consultation', description: 'Advice on best phone or gadget', price: 0, priceType: 'free', category: 'Consultation', isActive: true }
];
// Seed function
 const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shiv-mobile-hub');
    console.log('Connected to MongoDB');

    // Clear existing data
    // await User.deleteMany({});
    // await Product.deleteMany({});
    // await Section.deleteMany({});
    // await Service.deleteMany({});
    console.log('Cleared existing data');

    // // Create customer user
    // const hashedPassword = await bcrypt.hash('customer123456', 10);
    // const customerUser = new User({
    //   name: 'Customer User',
    //   email:'customer@shivmobilehub.com',
    //   password: hashedPassword,
    //   role: 'user',
    //   isActive: true
    // });
    // await customerUser.save();
    // console.log('Created customer user');

    // // Create admin user
    // const hashedPassword = await bcrypt.hash('admin123456', 10);
    // const adminUser = new User({
    //   name: 'Admin User',
    //   email:'admin@shivmobilehub.com',
    //   password: hashedPassword,
    //   role: 'admin',
    //   isActive: true
    // });
    // await adminUser.save();
    // console.log('Created admin user');

    // // Create products
    // const createdProducts = await Product.insertMany(sampleProducts);
    // console.log(`Created ${createdProducts.length} products`);

    // // Create sections and associate products
    // for (const sectionData of sampleSections) {
    //   const section = new Section(sectionData);

    //   // Add products to sections based on sections array
    //   const sectionProducts = createdProducts.filter(product => 
    //     product.sections.includes(section.name)
    //   );
    //   section.products = sectionProducts.map(p => p._id);

    //   await section.save();
    // }
    // console.log('Created sections with products');

    // // Create services
    // await Service.insertMany(sampleServices);
    // console.log(`Created ${sampleServices.length} services`);
    
    
    
    // Seed categories
    await Category.insertMany(categories);

    // Seed services (ensure category references are valid ObjectIds; you may need to query and link them)
    services.map(async (ele)=>{
      const id = (await Category.findOne({name:ele.category}))._id;
      ele.category = id;
    })
    await Service.insertMany(services);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
