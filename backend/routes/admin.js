const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Section = require('../models/Section');
const Service = require('../models/Service');
const User = require('../models/User');
const Setting = require('../models/Setting');
const mongoose = require('mongoose');

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [productCount, sectionCount, serviceCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Section.countDocuments(),
      Service.countDocuments(),
      User.countDocuments()
    ]);

    // Get recent products and services
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const recentServices = await Service.find().sort({ createdAt: -1 }).limit(5);

    // Calculate additional stats
    const lowStockProducts = await Product.countDocuments({ stockStatus: 'low' });
    const outOfStockProducts = await Product.countDocuments({ stockStatus: 'out' });

    res.json({
      success: true,
      data: {
        counts: {
          products: productCount,
          sections: sectionCount,
          services: serviceCount,
          users: userCount
        },
        recent: {
          products: recentProducts,
          services: recentServices
        },
        stock: {
          low: lowStockProducts,
          out: outOfStockProducts
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Products
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort = 'createdAt', order = -1 } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    
    const sortOptions = {};
    sortOptions[sort] = order;
    
    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
      
    const total = await Product.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: { 
        products, 
        pagination: { 
          current: parseInt(page), 
          pages: Math.ceil(total / limit), 
          total 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Also remove product from sections
    await Section.updateMany(
      { products: req.params.id },
      { $pull: { products: req.params.id } }
    );
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id/toggle-status', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.isActive = !product.isActive;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sections
router.get('/sections', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const sections = await Section.find()
      .populate('products', 'name price images category brand')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ displayOrder: 1 });
      
    const total = await Section.countDocuments();
    
    res.json({ 
      success: true, 
      data: { 
        sections, 
        pagination: { 
          current: parseInt(page), 
          pages: Math.ceil(total / limit), 
          total 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('products', 'name price images category brand');
      
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/sections', async (req, res) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/sections/:id/add-product', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Check if product is already in the section
    if (section.products.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Product already in section' });
    }
    
    // Add product to section
    section.products.push(productId);
    await section.save();
    
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/sections/:id/remove-product', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    // Remove product from section
    section.products = section.products.filter(
      product => product.toString() !== productId
    );
    await section.save();
    
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Services
router.get('/services', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    
    const services = await Service.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ displayOrder: 1, createdAt: -1 });
      
    const total = await Service.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: { 
        services, 
        pagination: { 
          current: parseInt(page), 
          pages: Math.ceil(total / limit), 
          total 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/services/:id/toggle-status', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/services/:id/toggle-popular', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isPopular = !service.isPopular;
    await service.save();
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    
    const users = await User.find(filter, { password: 0 }) // exclude password
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await User.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: { 
        users, 
        pagination: { 
          current: parseInt(page), 
          pages: Math.ceil(total / limit), 
          total 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Don't allow deactivating the current admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot deactivate your own account' 
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/update-role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Don't allow changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot change your own role' 
      });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    
    const settings = await Setting.find(filter).sort({ key: 1 });
    
    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});
    
    res.json({ success: true, data: groupedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/settings/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    // Check if setting already exists
    const existingSetting = await Setting.findOne({ key: req.body.key });
    if (existingSetting) {
      return res.status(400).json({ 
        success: false, 
        message: 'Setting with this key already exists' 
      });
    }
    
    const setting = new Setting({
      ...req.body,
      updatedBy: req.user._id
    });
    
    await setting.save();
    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/settings/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    
    // Update allowed fields
    const { value, description, isPublic, category } = req.body;
    
    if (value !== undefined) setting.value = value;
    if (description !== undefined) setting.description = description;
    if (isPublic !== undefined) setting.isPublic = isPublic;
    if (category !== undefined) setting.category = category;
    
    setting.updatedBy = req.user._id;
    
    await setting.save();
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/settings/:key', async (req, res) => {
  try {
    const result = await Setting.deleteOne({ key: req.params.key });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Initialize default settings
router.post('/settings/initialize', async (req, res) => {
  try {
    const defaultSettings = Setting.defaultSettings;
    
    // Insert settings if they don't exist
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { ...setting, updatedBy: req.user._id },
        { upsert: true, new: true }
      );
    }
    
    res.json({ 
      success: true, 
      message: 'Default settings initialized successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;