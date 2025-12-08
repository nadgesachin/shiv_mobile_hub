const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    publicId: String
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categoryPath: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String
  }],
  brand: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    enum: [
      'Bestseller',
      'New Arrival',
      'Hot Deal',
      'Premium',
      'Limited Edition',
      'Pro Series',
      'Gaming Beast',
      "Editor's Choice",
      'Apple Certified',
      'New Release',
      'Official',
      'Best ANC'
    ]
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  specs: [{
    type: String
  }],
  // detailedSpecs: {
  //   display: String,
  //   processor: String,
  //   ram: String,
  //   storage: String,
  //   camera: String,
  //   battery: String,
  //   os: String,
  //   type: String,
  //   drivers: String,
  //   connectivity: String,
  //   features: String,
  //   weight: String,
  //   output: String,
  //   compatibility: String,
  //   includes: String,
  //   protection: String,
  //   material: String,
  //   capacity: String,
  //   input: String
  // },
  detailedSpecs: {
    type: Map,
    of: String,
    default: {}
  },
  stockStatus: {
    type: String,
    enum: ['in-stock', 'low', 'out'],
    default: 'in-stock'
  },
  stockCount: {
    type: Number,
    default: 0
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }],
  isActive: {
    type: Boolean,
    default: true
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
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
