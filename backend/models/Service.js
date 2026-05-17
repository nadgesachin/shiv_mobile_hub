const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  },
  priceType: {
    type: String,
    enum: ['fixed', 'variable', 'free'],
    default: 'fixed'
  },
  duration: {
    type: String
  },
  image: {
    url: String,
    alt: String,
    publicId: String
  },
  features: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  process: [{
    step: String,
    description: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for better search performance
serviceSchema.index({ name: 'text', description: 'text' });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Service', serviceSchema);
