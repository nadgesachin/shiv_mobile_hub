const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const { auth } = require('../middleware/auth');

// Helper function to calculate review summary
const calculateReviewSummary = async (filter) => {
  try {
    const aggregateResult = await Review.aggregate([
      { $match: { ...filter, status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: '$count' },
          ratings: {
            $push: {
              rating: '$_id',
              count: '$count'
            }
          }
        }
      }
    ]);

    if (aggregateResult.length === 0) {
      return {
        totalReviews: 0,
        ratings: {}
      };
    }

    // Transform ratings array into object
    const ratingsObj = {};
    aggregateResult[0].ratings.forEach(item => {
      ratingsObj[item.rating] = item.count;
    });

    return {
      totalReviews: aggregateResult[0].totalReviews,
      ratings: ratingsObj
    };
  } catch (error) {
    console.error('Error calculating review summary:', error);
    return {
      totalReviews: 0,
      ratings: {}
    };
  }
};

// Get reviews with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { status: 'approved' };
    
    if (req.query.productId) {
      filter.productId = req.query.productId;
    }
    
    if (req.query.serviceId) {
      filter.serviceId = req.query.serviceId;
    }
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    // Get reviews
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name profileImage')
      .lean();
    
    // Format reviews for response
    const formattedReviews = reviews.map(review => ({
      ...review,
      userName: review.userId ? review.userId.name : 'Anonymous User'
    }));
    
    // Get total count
    const totalReviews = await Review.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalReviews / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Get review summary statistics
    const summary = await calculateReviewSummary(filter);

    res.json({
      success: true,
      reviews: formattedReviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      summary
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get a single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name profileImage')
      .lean();
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Format review for response
    const formattedReview = {
      ...review,
      userName: review.userId ? review.userId.name : 'Anonymous User'
    };
    
    res.json({
      success: true,
      review: formattedReview
    });
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, serviceId, rating, title, comment, images } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Rating, title, and comment are required' });
    }
    
    // Validate that either productId or serviceId is provided
    if (!productId && !serviceId) {
      return res.status(400).json({ success: false, message: 'Either productId or serviceId is required' });
    }
    
    // Create new review
    const newReview = new Review({
      userId,
      rating,
      title,
      comment,
      images: images || []
    });
    
    // Set either productId or serviceId
    if (productId) {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      newReview.productId = productId;
    } else {
      // Check if service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      newReview.serviceId = serviceId;
    }
    
    // Save review
    await newReview.save();
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Check if user is the owner of the review
    if (review.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }
    
    // Update fields
    const { rating, title, comment, images, status } = req.body;
    
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    
    // Only admin can update status
    if (status && req.user.isAdmin) {
      review.status = status;
    }
    
    await review.save();
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Check if user is the owner of the review or an admin
    if (review.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Add a business reply to a review
router.post('/:id/reply', auth, async (req, res) => {
  try {
    // Only admins can reply to reviews
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to reviews' });
    }
    
    const reviewId = req.params.id;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Add reply
    review.replyFromBusiness = {
      text,
      userId: req.user.id,
      createdAt: new Date()
    };
    
    await review.save();
    
    res.json({
      success: true,
      message: 'Reply added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding reply to review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Increment helpful count
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    await review.save();
    
    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get review summary for a product or service
router.get('/summary', async (req, res) => {
  try {
    // Build filter
    const filter = { status: 'approved' };
    
    if (req.query.productId) {
      filter.productId = req.query.productId;
    } else if (req.query.serviceId) {
      filter.serviceId = req.query.serviceId;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Either productId or serviceId is required' 
      });
    }
    
    // Get review summary statistics
    const summary = await calculateReviewSummary(filter);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error getting review summary:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
