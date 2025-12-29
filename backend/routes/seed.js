// backend/routes/seed.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const Section = require('../models/Section');

// Same sampleSections you have in scripts/seed.js
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
      updateCriteria: "newest"
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
      updateCriteria: "highest-rated"
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
      updateCriteria: "bestselling"
    }
  }
];

// POST /api/seed/admin-and-sections
router.post('/admin-and-sections', async (req, res) => {
  try {
    // 1) Ensure admin user exists
    const adminEmail = 'admin@shivmobilehub.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
    }

    // 2) Seed sections (upsert by name so we don’t duplicate)
    for (const sectionData of sampleSections) {
      await Section.findOneAndUpdate(
        { name: sectionData.name },
        { $setOnInsert: sectionData },
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Admin user and sections seeded successfully',
    });
  } catch (err) {
    console.error('Seed route error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed admin user and sections',
      error: err.message,
    });
  }
});

module.exports = router;