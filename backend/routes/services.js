const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const passport = require('passport');
require('../config/passport')(passport);

// Middleware to protect admin routes
const adminAuth = passport.authenticate('jwt', { session: false });

// @route   GET /api/services
// @desc    Get all services with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      isPopular,
      isActive = true,
      sortBy = 'displayOrder',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { isActive };
    
    if (category) query.category = category;
    if (isPopular !== undefined) query.isPopular = isPopular === 'true';

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const services = await Service.find(query).sort(sort);

    res.json({
      success: true,
      data: {
        services
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/services
// @desc    Create new service (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const serviceData = req.body;
    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/categories
// @desc    Get all service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    
    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/services/:id/toggle-status
// @desc    Toggle service active status (Admin only)
router.put('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/services/:id/toggle-popular
// @desc    Toggle service popular status (Admin only)
router.put('/:id/toggle-popular', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isPopular = !service.isPopular;
    await service.save();

    res.json({
      success: true,
      message: `Service ${service.isPopular ? 'marked as' : 'unmarked as'} popular successfully`,
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Toggle popular status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
