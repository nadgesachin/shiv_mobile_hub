const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  style: {
    type: String,
    enum: [
      // Legacy values (kept for backward compatibility with existing rows)
      'DailyDeals',
      'TrendingProducts',
      'BestsellingProducts',
      'LowPriceProducts',
      'LiveShopBanner',
      'TopOffers',
      'BrandDhamaka',
      'ForYouProductSection',
      'CategoryGrid',
      // New Flipkart-inspired layout primitives — admin picks one of these
      'MultiColumnGrid',     // Dense 5–6 col grid, shows ~12 products
      'CompactGrid',         // Very dense 6–8 col grid, shows ~16 products
      'DualRowCarousel',     // Two horizontal rows (2x stacked carousels)
      'HeroBannerGrid',      // Big banner on left + 4 product tiles right
      'DealOfTheDay',        // Featured product w/ countdown + side rail
      'TopPicks',            // Numbered ranking 1–6 cards
      'BrandShowcase',       // Brand-grouped columns of products
      'FlashSale',           // Countdown + 8-product grid with progress bars
      'HorizontalScroll',    // Classic carousel (default fallback)
      'MegaBanner'           // Full-bleed banner header + product grid below
    ],
    default: 'HorizontalScroll'
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
