const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminOnly } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { type, active, parent, flat,skip=0,limit=10 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by active status if specified
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    // Filter by active status if specified
    if (type !== undefined) {
      query.type = type;
    }
    
    // Filter by parent if specified
    if (parent !== undefined) {
      if (parent === 'null') {
        query.parent = null; // Root categories
      } else {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(parent)) {
          return res.status(400).json({ success: false, message: 'Invalid parent ID format' });
        }
        query.parent = parent;
      }
    }
    
    // Fetch categories
    let categories;
    
    if (flat === 'true') {
      // Flat list of all categories
      categories = await Category.find(query).sort({ order: 1, name: 1 });
    } else {
      // Hierarchical structure (default)
      // First get root categories
      const rootCategories = await Category.find(query).sort({ order: 1, name: 1 });
      
      // Recursively get children for each root category
      categories = await Promise.all(
        rootCategories.map(async rootCategory => {
          return {
            ...rootCategory.toObject(),
            children: await getChildCategories(rootCategory._id, query)
          };
        })
      );
    }
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to get child categories recursively
async function getChildCategories(parentId, baseQuery = {}) {
  const childCategories = await Category.find({ 
    ...baseQuery, 
    parent: parentId 
  }).sort({ order: 1, name: 1 });
  
  return Promise.all(
    childCategories.map(async category => {
      return {
        ...category.toObject(),
        children: await getChildCategories(category._id, baseQuery)
      };
    })
  );
}

// Get category by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category;
    
    // Check if parameter is ObjectID or slug
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug });
    }
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new category (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, parentId, isActive, order, metaTitle, metaDescription } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    
    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check for duplicate slug
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }
    
    // Build category object
    const categoryData = {
      name,
      slug,
      description,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      metaTitle,
      metaDescription,
      createdBy: req.user._id
    };
    
    // Handle parent category and build ancestors array
    if (parentId) {
      // Validate parentId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ success: false, message: 'Invalid parent category ID' });
      }
      
      // Find parent category
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ success: false, message: 'Parent category not found' });
      }
      
      // Set parent
      categoryData.parent = parentId;
      
      // Build ancestors array (parent's ancestors + parent itself)
      categoryData.ancestors = [
        ...(parentCategory.ancestors || []),
        {
          _id: parentCategory._id,
          name: parentCategory.name,
          slug: parentCategory.slug
        }
      ];
    }
    
    // Create and save new category
    const category = new Category(req.body);
    await category.save();
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update category (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentId, isActive, order, metaTitle, metaDescription, icon } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }
    
    // Find the category to update
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Check for name/slug changes
    if (name && name !== category.name) {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check for duplicate slug
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: 'A category with this name already exists' });
      }
      
      category.name = name;
      category.slug = slug;
    }
    
    // Update other fields if provided
    if (description !== undefined) category.description = description;
    if (req.body.image !== undefined) category.image = req.body.image;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;
    if (icon != undefined) category.icon = icon;
    // Handle parent category changes
    if (parentId !== undefined) {
      // If parent is being removed (set to null)
      if (parentId === null) {
        category.parent = null;
        category.ancestors = [];
      } 
      // If parent is being changed
      else if (parentId !== category.parent?.toString()) {
        // Prevent setting self as parent
        if (parentId === id) {
          return res.status(400).json({ success: false, message: 'Category cannot be its own parent' });
        }
        
        // Validate parentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
          return res.status(400).json({ success: false, message: 'Invalid parent category ID' });
        }
        
        // Prevent circular references
        let currentParent = await Category.findById(parentId);
        while (currentParent) {
          if (currentParent._id.toString() === id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Circular hierarchy detected - category cannot be a parent of its own ancestor' 
            });
          }
          
          if (currentParent.parent) {
            currentParent = await Category.findById(currentParent.parent);
          } else {
            break;
          }
        }
        
        // Find new parent category
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
          return res.status(404).json({ success: false, message: 'Parent category not found' });
        }
        
        // Set parent
        category.parent = parentId;
        
        // Build ancestors array (parent's ancestors + parent itself)
        category.ancestors = [
          ...(parentCategory.ancestors || []),
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug
          }
        ];
      }
    }
    
    // Save updated category
    await category.save();
    
    // Update all child categories' ancestors if name/slug changed
    if (name && name !== category.name) {
      await updateChildrenAncestors(category);
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to recursively update ancestors of child categories
async function updateChildrenAncestors(parentCategory) {
  const childCategories = await Category.find({ parent: parentCategory._id });
  
  for (const child of childCategories) {
    // Update the parent reference in ancestors array
    for (let i = 0; i < child.ancestors.length; i++) {
      if (child.ancestors[i]._id.toString() === parentCategory._id.toString()) {
        child.ancestors[i].name = parentCategory.name;
        child.ancestors[i].slug = parentCategory.slug;
        break;
      }
    }
    
    await child.save();
    
    // Recursively update children
    await updateChildrenAncestors(child);
  }
}

// Delete category (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { transferChildrenTo } = req.query;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }
    
    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Check for child categories
    const childCategories = await Category.find({ parent: id });
    
    if (childCategories.length > 0) {
      // If transferChildrenTo is provided, move children to that category
      if (transferChildrenTo) {
        // Don't transfer to self (which should be impossible since we're deleting it)
        if (transferChildrenTo === id) {
          return res.status(400).json({ success: false, message: 'Cannot transfer children to the category being deleted' });
        }
        
        // Validate transferChildrenTo is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(transferChildrenTo)) {
          return res.status(400).json({ success: false, message: 'Invalid transfer category ID' });
        }
        
        // Find transfer target category
        const transferCategory = await Category.findById(transferChildrenTo);
        if (!transferCategory) {
          return res.status(404).json({ success: false, message: 'Transfer category not found' });
        }
        
        // Build new ancestors array for children
        const newAncestors = transferCategory.parent ? [
          ...(transferCategory.ancestors || []),
          {
            _id: transferCategory._id,
            name: transferCategory.name,
            slug: transferCategory.slug
          }
        ] : [];
        
        // Update all children
        for (const child of childCategories) {
          child.parent = transferChildrenTo;
          child.ancestors = newAncestors;
          await child.save();
        }
      } else {
        // If no transfer target, return error
        return res.status(400).json({
          success: false,
          message: 'Category has child categories. Either delete them first or specify a transferChildrenTo parameter.'
        });
      }
    }
    
    // Delete the category
    await Category.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
