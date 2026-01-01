const express = require('express');
const router = express.Router();
const bannerController = require('./bannerController');

router.post('/', bannerController.uploadImage, bannerController.createBanner);
router.get('/', bannerController.getBanners);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
