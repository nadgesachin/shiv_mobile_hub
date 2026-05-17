const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const passport = require('passport');
require('../config/passport')(passport);

// Middleware to protect admin routes
const adminAuth = passport.authenticate('jwt', { session: false });

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      section,
      isActive = true
    } = req.query;

    // Fix NaN issue - ensure page and limit are valid numbers
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    /* -------------------- CONDITION BUILDING -------------------- */
    let condition = {
      isActive: isActive === 'true' || isActive === true
    };

    if (brand) condition.brand = brand;

    if (section) {
      condition.sections = { $in: Array.isArray(section) ? section : [section] };
    }

    if (category) {
      condition.category = category; // slug OR ObjectId
    }

    if (minPrice || maxPrice) {
      condition.price = {};
      if (minPrice) condition.price.$gte = Number(minPrice);
      if (maxPrice) condition.price.$lte = Number(maxPrice);
    }

    if (search) {
      condition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    /* -------------------- SORT -------------------- */
    const sortCriteria = { [sortBy]: sortDirection };

    /* -------------------- AGGREGATION -------------------- */
    const aggregate = [
      { $match: condition },

      /* 🔥 CATEGORY LOOKUP */
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$categoryId'] },
                    { $eq: ['$slug', '$$categoryId'] }
                  ]
                }
              }
            },
            {
              $project: {
                name: 1,
                slug: 1,
                icon: 1,
                image: 1
              }
            }
          ],
          as: 'categoryInfo'
        }
      },

      {
        $addFields: {
          categoryInfo: { $arrayElemAt: ['$categoryInfo', 0] }
        }
      },

      /* 🔥 SECTION LOOKUP */
      {
        $lookup: {
          from: 'sections',
          localField: 'sections',
          foreignField: '_id',
          as: 'sections'
        }
      },

      /* -------------------- SORT / PAGINATION -------------------- */
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: limitNum },

      /* -------------------- RESPONSE SHAPE -------------------- */
      {
        $project: {
          name: 1,
          price: 1,
          originalPrice: 1,
          brand: 1,
          rating: 1,
          stockStatus: 1,
          stockCount: 1,
          images: 1,
          category: '$categoryInfo',
          sections: {
            _id: 1,
            name: 1,
            title: 1
          },
          createdAt: 1
        }
      }
    ];

    /* -------------------- EXECUTION -------------------- */
    const [products, totalCount] = await Promise.all([
      Product.aggregate(aggregate),
      Product.countDocuments(condition)
    ]);

    return res.status(200).json({
      success: true,
      message: 'PRODUCTS FETCHED',
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: 'SERVER ERROR',
      error: error.message
    });
  }
});


// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { category, ...rest } = req.body; // Extract category for validation

    // Optionally, check if the category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found.' });
      }
    }
    req.body.category = category;
    // Update the product
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');

    res.json({
      success: true,
      data: {
        categories,
        brands
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

// @route   PUT /api/products/:id/toggle-status
// @desc    Toggle product active status (Admin only)
router.put('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        product
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

module.exports = router;
