const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Product = require('../models/Product');
const passport = require('passport');
require('../config/passport')(passport);

// Middleware to protect admin routes
const adminAuth = passport.authenticate('jwt', { session: false });

// @route   GET /api/sections
// @desc    Get all sections with products
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .populate({
        path: 'products',
        match: { isActive: true },
        options: { limit: 10 }
      });

    res.json({
      success: true,
      data: {
        sections
      }
    });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sections/:name
// @desc    Get specific section with products
router.get('/:name', async (req, res) => {
  try {
    const section = await Section.findOne({ 
      name: req.params.name, 
      isActive: true 
    })
    .populate({
      path: 'products',
      match: { isActive: true },
      options: { limit: 10 }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    res.json({
      success: true,
      data: {
        section
      }
    });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/sections
// @desc    Create new section (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const sectionData = req.body;
    const section = new Section(sectionData);
    await section.save();

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: {
        section
      }
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/sections/:id
// @desc    Update section (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: {
        section
      }
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/sections/:id/add-product
// @desc    Add product to section (Admin only)
router.put('/:id/add-product', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { productId } = req.body;
    
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add product to section if not already added
    if (!section.products.includes(productId)) {
      section.products.push(productId);
      await section.save();

      // Add section to product's sections array
      if (!product.sections.includes(section.name)) {
        product.sections.push(section.name);
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Product added to section successfully',
      data: {
        section
      }
    });
  } catch (error) {
    console.error('Add product to section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/sections/:id/remove-product
// @desc    Remove product from section (Admin only)
router.put('/:id/remove-product', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { productId } = req.body;
    
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // Remove product from section
    section.products = section.products.filter(id => id.toString() !== productId);
    await section.save();

    // Remove section from product's sections array
    const product = await Product.findById(productId);
    if (product) {
      product.sections = product.sections.filter(name => name !== section.name);
      await product.save();
    }

    res.json({
      success: true,
      message: 'Product removed from section successfully',
      data: {
        section
      }
    });
  } catch (error) {
    console.error('Remove product from section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/sections/:id/auto-update
// @desc    Auto-update section products based on criteria (Admin only)
router.put('/:id/auto-update', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    if (!section.settings.autoUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Auto-update is not enabled for this section'
      });
    }

    // Build query based on criteria
    let sortQuery = {};
    switch (section.settings.updateCriteria) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'bestselling':
        sortQuery = { reviewCount: -1 };
        break;
      case 'discounted':
        sortQuery = { 'originalPrice': -1 };
        break;
      case 'highest-rated':
        sortQuery = { rating: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Get products based on criteria
    const products = await Product.find({ isActive: true })
      .sort(sortQuery)
      .limit(section.maxProducts);

    // Update section with new products
    section.products = products.map(p => p._id);
    await section.save();

    res.json({
      success: true,
      message: 'Section auto-updated successfully',
      data: {
        section,
        products
      }
    });
  } catch (error) {
    console.error('Auto-update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
