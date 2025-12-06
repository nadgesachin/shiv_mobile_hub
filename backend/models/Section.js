const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['flash-deals', 'new-arrivals', 'top-accessories', 'featured-products'],
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  maxProducts: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  settings: {
    showBadge: {
      type: Boolean,
      default: true
    },
    showRating: {
      type: Boolean,
      default: true
    },
    showDiscount: {
      type: Boolean,
      default: true
    },
    autoUpdate: {
      type: Boolean,
      default: false
    },
    updateCriteria: {
      type: String,
      enum: ['newest', 'bestselling', 'discounted', 'highest-rated'],
      default: 'newest'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', sectionSchema);
