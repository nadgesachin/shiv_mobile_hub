const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please provide a valid 10-digit phone number'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  message: {
    type: String,
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    trim: true
  },
  productPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'call', 'walkin', 'other'],
    default: 'website'
  },
  notes: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ phone: 1 });
enquirySchema.index({ productId: 1 });

// Virtual for formatted phone
enquirySchema.virtual('formattedPhone').get(function() {
  return `+91 ${this.phone}`;
});

// Method to check if enquiry is recent (within 24 hours)
enquirySchema.methods.isRecent = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt >= twentyFourHoursAgo;
};

// Static method to get today's enquiries
enquirySchema.statics.getTodayEnquiries = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    createdAt: { $gte: today }
  }).sort({ createdAt: -1 });
};

// Static method to get enquiries by status
enquirySchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Pre-save hook to update timestamp
enquirySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Transform for JSON output
enquirySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
