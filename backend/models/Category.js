const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true,
    default: 'product'
  },
  icon: {
    type: String,
    default: 'default-icon' // e.g., 'Smartphone', 'Wrench'; can be customized
  },
  image: {
    type: String, // Store image URL or path
    default: ''
  },
  description: {
    type: String,
    trim: true
  },
  imageObject: {
    url: {
      type: String
    },
    alt: {
      type: String
    }
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true
    },
    name: String,
    slug: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
