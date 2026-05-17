const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const passport = require('passport');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin only.'
  });
};

// @route   GET /api/settings
// @desc    Get all settings (public access for social links, etc.)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ isSingleton: true });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private (Admin only)
router.put('/', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    
    let settings = await Settings.findOne({ isSingleton: true });
    
    // If no settings exist, create new one
    if (!settings) {
      settings = new Settings(updates);
    } else {
      // Update existing settings
      Object.keys(updates).forEach(key => {
        if (key !== '_id' && key !== 'isSingleton' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          settings[key] = updates[key];
        }
      });
    }
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// @route   PUT /api/settings/social-media
// @desc    Update social media links
// @access  Private (Admin only)
router.put('/social-media', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const { socialMedia } = req.body;
    
    let settings = await Settings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.socialMedia = {
      ...settings.socialMedia,
      ...socialMedia
    };
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Social media links updated successfully',
      data: settings.socialMedia
    });
  } catch (error) {
    console.error('Update social media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update social media links'
    });
  }
});

// @route   PUT /api/settings/contact
// @desc    Update contact information
// @access  Private (Admin only)
router.put('/contact', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const { contact } = req.body;
    
    let settings = await Settings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.contact = {
      ...settings.contact,
      ...contact
    };
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: settings.contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information'
    });
  }
});

// @route   PUT /api/settings/business-hours
// @desc    Update business hours
// @access  Private (Admin only)
router.put('/business-hours', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const { businessHours } = req.body;
    
    let settings = await Settings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.businessHours = {
      ...settings.businessHours,
      ...businessHours
    };
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Business hours updated successfully',
      data: settings.businessHours
    });
  } catch (error) {
    console.error('Update business hours error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business hours'
    });
  }
});

// @route   PUT /api/settings/location
// @desc    Update shop location coordinates
// @access  Private (Admin only)
router.put('/location', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  try {
    const { location } = req.body;
    
    let settings = await Settings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.location = {
      ...settings.location,
      ...location
    };
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      data: settings.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
});

module.exports = router;
