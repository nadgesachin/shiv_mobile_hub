const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { auth, adminOnly } = require('../middleware/auth');

// Get all pages (public)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    
    // Build query
    const query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const pages = await Page.find(query)
      .select('title slug metaTitle isActive updatedAt')
      .sort({ title: 1 });
      
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const page = await Page.findOne({ slug, isActive: true });
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new page (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, isActive } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    
    // Generate slug from title if not provided
    const pageSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check if slug is unique
    const existingPage = await Page.findOne({ slug: pageSlug });
    if (existingPage) {
      return res.status(400).json({ success: false, message: 'A page with this slug already exists' });
    }
    
    // Create and save new page
    const page = new Page({
      title,
      slug: pageSlug,
      content,
      metaTitle: metaTitle || title,
      metaDescription,
      isActive: isActive !== undefined ? isActive : true,
      lastUpdatedBy: req.user._id
    });
    
    await page.save();
    
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update page by ID (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, isActive } = req.body;
    
    const page = await Page.findById(id);
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    // Update fields if provided
    if (title) page.title = title;
    
    // Handle slug change
    if (slug && slug !== page.slug) {
      // Check if new slug is unique
      const existingPage = await Page.findOne({ slug, _id: { $ne: id } });
      if (existingPage) {
        return res.status(400).json({ success: false, message: 'A page with this slug already exists' });
      }
      page.slug = slug;
    }
    
    // Update other fields
    if (content) page.content = content;
    if (metaTitle) page.metaTitle = metaTitle;
    if (metaDescription !== undefined) page.metaDescription = metaDescription;
    if (isActive !== undefined) page.isActive = isActive;
    
    // Update last updated by
    page.lastUpdatedBy = req.user._id;
    
    await page.save();
    
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete page by ID (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Page.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
