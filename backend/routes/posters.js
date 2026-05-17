const express = require('express');
const router = express.Router();
const Poster = require('../models/Poster');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Settings = require('../models/Settings');
const { auth, adminOnly } = require('../middleware/auth');

// Get all posters (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    
    const query = { createdBy: req.user.id };
    if (type) {
      query.type = type;
    }
    
    const posters = await Poster.find(query)
      .populate('productId', 'name price images')
      .populate('serviceId', 'name description images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Poster.countDocuments(query);
    
    res.json({
      success: true,
      data: posters,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching posters:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single poster
router.get('/:id', auth, async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id)
      .populate('productId')
      .populate('serviceId')
      .populate('createdBy', 'name email');
    
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: 'Poster not found'
      });
    }
    
    // Check if user owns this poster or is admin
    if (poster.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this poster'
      });
    }
    
    res.json({
      success: true,
      data: poster
    });
  } catch (error) {
    console.error('Error fetching poster:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new poster
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, type, productId, serviceId, template, design, size } = req.body;
    
    // Validate product or service exists
    if (type === 'product') {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
    } else if (type === 'service') {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
    }
    
    const poster = new Poster({
      title,
      type,
      productId: type === 'product' ? productId : undefined,
      serviceId: type === 'service' ? serviceId : undefined,
      template,
      design,
      size,
      createdBy: req.user.id
    });
    
    await poster.save();
    
    await poster.populate('productId', 'name price images');
    await poster.populate('serviceId', 'name description images');
    
    res.status(201).json({
      success: true,
      message: 'Poster created successfully',
      data: poster
    });
  } catch (error) {
    console.error('Error creating poster:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update poster
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, template, design, size } = req.body;
    
    const poster = await Poster.findById(req.params.id);
    
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: 'Poster not found'
      });
    }
    
    // Check ownership
    if (poster.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this poster'
      });
    }
    
    if (title) poster.title = title;
    if (template) poster.template = template;
    if (design) poster.design = { ...poster.design, ...design };
    if (size) poster.size = size;
    
    await poster.save();
    
    await poster.populate('productId', 'name price images');
    await poster.populate('serviceId', 'name description images');
    
    res.json({
      success: true,
      message: 'Poster updated successfully',
      data: poster
    });
  } catch (error) {
    console.error('Error updating poster:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete poster
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: 'Poster not found'
      });
    }
    
    // Check ownership
    if (poster.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this poster'
      });
    }
    
    await Poster.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Poster deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting poster:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get poster data (product/service + settings)
router.get('/:id/data', auth, async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id)
      .populate('productId')
      .populate('serviceId');
    
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: 'Poster not found'
      });
    }
    
    // Get settings for contact info
    const settings = await Settings.findOne();
    
    const data = {
      poster,
      item: poster.type === 'product' ? poster.productId : poster.serviceId,
      settings: {
        contact: settings?.contact || {},
        socialMedia: settings?.socialMedia || {}
      }
    };
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching poster data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
