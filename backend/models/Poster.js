const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() { return this.type === 'product'; }
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: function() { return this.type === 'service'; }
  },
  template: {
    type: String,
    // Remove enum to allow any template ID
    default: 'product-showcase'
  },
  design: {
    // Store the design configuration as JSON
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    accentColor: {
      type: String,
      default: '#3b82f6'
    },
    showLogo: {
      type: Boolean,
      default: true
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    showContact: {
      type: Boolean,
      default: true
    },
    showAddress: {
      type: Boolean,
      default: true
    },
    showWebsite: {
      type: Boolean,
      default: true
    },
    showQRCode: {
      type: Boolean,
      default: false
    },
    elements: {
      type: mongoose.Schema.Types.Mixed, // Allow flexible element structure
      default: []
    }
  },
  size: {
    width: {
      type: Number,
      default: 1080 // Instagram square post
    },
    height: {
      type: Number,
      default: 1080
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
posterSchema.index({ type: 1, createdBy: 1 });
posterSchema.index({ productId: 1 });
posterSchema.index({ serviceId: 1 });

module.exports = mongoose.model('Poster', posterSchema);
