const Banner = require('../models/Banner');

// No multer needed here - frontend will upload to /api/upload first
// Then send the Cloudinary URL in the request body

exports.createBanner = async (req, res) => {
  try {
    const { title, type, imageUrl, videoUrl } = req.body;

    // Validate required fields
    if (!title || !type) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and type are required' 
      });
    }

    // At least one media URL is required
    if (!imageUrl && !videoUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Either imageUrl or videoUrl is required' 
      });
    }

    const newBanner = new Banner({ 
      title, 
      type, 
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null 
    });
    
    await newBanner.save();
    
    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: newBanner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating banner', 
      error: error.message 
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error });
  }
};
