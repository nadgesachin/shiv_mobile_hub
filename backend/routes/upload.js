const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const passport = require('passport');
require('../config/passport')(passport);

const router = express.Router();

// Middleware to protect admin routes
const adminAuth = passport.authenticate('jwt', { session: false });

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dppoe8r21',
  api_key: '962731654417822',
  api_secret: '-uM2_DJQnway8ONuanZ-AhXDMSg'
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shiv-mobile-hub',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    }
  }
});

// Initialize Multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/upload/single
// @desc    Upload single image (Admin only)
router.post('/single', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.format
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images (Admin only)
router.post('/multiple', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      format: file.format
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: {
        files: uploadedFiles
      }
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete image from Cloudinary (Admin only)
router.delete('/:publicId', adminAuth, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// @route   POST /api/upload/transform
// @desc    Get transformed image URL (Admin only)
router.post('/transform', adminAuth, async (req, res) => {
  try {
    const { publicId, transformations } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Default transformations
    const defaultTransforms = {
      quality: 'auto',
      fetch_format: 'auto'
    };

    // Merge with provided transformations
    const finalTransforms = { ...defaultTransforms, ...transformations };

    // Get transformed URL
    const transformedUrl = cloudinary.url(publicId, finalTransforms);

    res.json({
      success: true,
      data: {
        transformedUrl,
        transformations: finalTransforms
      }
    });
  } catch (error) {
    console.error('Transform error:', error);
    res.status(500).json({
      success: false,
      message: 'Transform failed',
      error: error.message
    });
  }
});

// Error handling middleware for Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
