const express = require('express');
const router = express.Router();
const bannerController = require('./bannerController');

// POST /api/banners - Create banner (expects imageUrl/videoUrl from Cloudinary)
router.post('/', bannerController.createBanner);

// GET /api/banners - Get all banners
router.get('/', bannerController.getBanners);

// DELETE /api/banners/:id - Delete banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
