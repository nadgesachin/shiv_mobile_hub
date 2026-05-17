const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Banner', 'Live Banner'],
    required: true,
  },
  imageUrl: {
    type: String,
    required: false, // Not required if videoUrl is provided
  },
  videoUrl: {
    type: String,
    required: false, // Not required if imageUrl is provided
  },
}, { timestamps: true });

// Validate that at least one media URL exists
bannerSchema.pre('save', function(next) {
  if (!this.imageUrl && !this.videoUrl) {
    next(new Error('Either imageUrl or videoUrl must be provided'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
