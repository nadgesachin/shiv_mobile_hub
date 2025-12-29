const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Section = require('../models/Section');
const Service = require('../models/Service');
const Category = require('../models/Category');

const sampleSections = [
  {
    name: "New Arrivals",
    icon: "Package",
    title: "New Arrivals",
    subtitle: "Latest Products Just In",
    description: "Discover the newest additions to our store.",
    products: [],
    maxProducts: 12,
    isActive: true,
    displayOrder: 2,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: true,
      updateCriteria: "newest" // ✔ valid
    }
  },
  {
    name: "Top Accessories",
    icon: "Headphones",
    title: "Top Accessories",
    subtitle: "Best-Selling Mobile & Tech Accessories",
    description: "Handpicked accessories that customers love.",
    products: [],
    maxProducts: 15,
    isActive: true,
    displayOrder: 3,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: false,
      autoUpdate: true,
      updateCriteria: "highest-rated" // ✔ valid
    }
  },
  {
    name: "Featured Products",
    icon: "Star",
    title: "Featured Products",
    subtitle: "Handpicked Items Specially for You",
    description: "Premium curated products highlighted for customers.",
    products: [],
    maxProducts: 8,
    isActive: true,
    displayOrder: 4,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: false,
      updateCriteria: "bestselling" // ✔ valid
    }
  }
]

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
    // console.log('Cleared existing data');

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
    // await Category.insertMany(categories);
    // await Section.insertMany(sampleSections);

    // Seed services (ensure category references are valid ObjectIds; you may need to query and link them)
    // services.map(async (ele) => {
    //   const id = (await Category.findOne({ name: ele.category }))._id;
    //   ele.category = id;
    // })
    // await Service.insertMany(services);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
