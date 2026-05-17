const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Social Media Links
  socialMedia: {
    website: {
      type: String,
      default: ''
    },
    whatsapp: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    telegram: {
      type: String,
      default: ''
    },
    snapchat: {
      type: String,
      default: ''
    },
    tiktok: {
      type: String,
      default: ''
    },
    pinterest: {
      type: String,
      default: ''
    }
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    email: {
      type: String,
      default: 'info@shivmobilehub.com'
    },
    address: {
      type: String,
      default: 'Shop No. 12, Main Market'
    },
    city: {
      type: String,
      default: 'Your City'
    },
    state: {
      type: String,
      default: 'State'
    },
    pincode: {
      type: String,
      default: '123456'
    }
  },
  
  // Business Hours
  businessHours: {
    weekdays: {
      type: String,
      default: '10:00 AM - 8:00 PM'
    },
    weekends: {
      type: String,
      default: '10:00 AM - 9:00 PM'
    }
  },
  
  // Shop Location (for Google Maps)
  location: {
    latitude: {
      type: Number,
      default: 28.6139
    },
    longitude: {
      type: Number,
      default: 77.2090
    }
  },
  
  // SEO Settings
  seo: {
    metaTitle: {
      type: String,
      default: 'Shiv Mobile Hub - Mobile Sales & Services'
    },
    metaDescription: {
      type: String,
      default: 'Your trusted mobile shop for sales, repairs, and accessories'
    },
    keywords: {
      type: String,
      default: 'mobile, phone, repair, accessories'
    }
  },
  
  // Email Settings
  email: {
    adminEmail: {
      type: String,
      default: 'admin@shivmobilehub.com'
    },
    supportEmail: {
      type: String,
      default: 'support@shivmobilehub.com'
    }
  },
  
  // Singleton pattern - only one settings document
  isSingleton: {
    type: Boolean,
    default: true,
    unique: true
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  const count = await this.constructor.countDocuments({ isSingleton: true });
  if (count > 0 && this.isNew) {
    throw new Error('Settings document already exists');
  }
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
