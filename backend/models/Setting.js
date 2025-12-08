const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'appearance', 'seo', 'notifications', 'security'],
    default: 'general'
  },
  description: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Define default settings to initialize
settingSchema.statics.defaultSettings = [
  {
    key: 'siteName',
    value: 'Shiv Mobile Hub',
    category: 'general',
    description: 'Website name displayed in the header, footer and browser tab',
    isPublic: true
  },
  {
    key: 'siteDescription',
    value: 'Your one-stop shop for mobile phones, accessories and services',
    category: 'seo',
    description: 'Default meta description for the website',
    isPublic: true
  },
  {
    key: 'contactEmail',
    value: 'contact@shivmobilehub.com',
    category: 'general',
    description: 'Primary contact email address',
    isPublic: true
  },
  {
    key: 'contactPhone',
    value: '+91 9876543210',
    category: 'general',
    description: 'Primary contact phone number',
    isPublic: true
  },
  {
    key: 'socialLinks',
    value: {
      facebook: 'https://facebook.com/shivmobilehub',
      instagram: 'https://instagram.com/shivmobilehub',
      twitter: 'https://twitter.com/shivmobilehub'
    },
    category: 'general',
    description: 'Social media links',
    isPublic: true
  },
  {
    key: 'homepageBanner',
    value: {
      enabled: true,
      title: 'Welcome to Shiv Mobile Hub',
      subtitle: 'Discover the latest smartphones and accessories',
      buttonText: 'Shop Now',
      buttonLink: '/products-catalog',
      image: '/assets/images/banner.jpg'
    },
    category: 'appearance',
    description: 'Main homepage banner configuration',
    isPublic: true
  },
  {
    key: 'logoUrl',
    value: '/assets/images/logo.png',
    category: 'appearance',
    description: 'Website logo URL',
    isPublic: true
  }
];

module.exports = mongoose.model('Setting', settingSchema);
