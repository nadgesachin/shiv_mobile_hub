const mongoose = require('mongoose');
const Service = require('../models/Service');

const servicesData = [
    // {
    //   id: 1,
    //   title: 'Mobile Screen Repair',
    //   description: 'Professional screen replacement with original quality parts and 6-month warranty coverage',
    //   icon: 'Smartphone',
    //   iconColor: 'var(--color-primary)',
    //   category: 'mobile',
    //   price: '999',
    //   duration: '30-45 mins',
    //   availability: 'Available',
    //   popular: true,
    //   features: [
    //     'Original quality display',
    //     '6-month warranty',
    //     'Free screen guard installation'
    //   ],
    //   comparisonData: {
    //     'Service Duration': '30-45 mins',
    //     'Price Range': '₹999 - ₹2,999',
    //     'Warranty Period': '6 months',
    //     'Home Service': 'Available',
    //     'Emergency Support': 'Yes',
    //     'Parts Included': 'Display, Tools'
    //   }
    // },
    {
      id: 2,
      title: 'Battery Replacement',
      description: 'High-capacity battery replacement with performance testing and optimization',
      icon: 'Battery',
      iconColor: 'var(--color-success)',
      category: 'mobile',
      price: '799',
      duration: '20-30 mins',
      availability: 'Available',
      popular: true,
      features: [
        'High-capacity batteries',
        'Performance testing included',
        '3-month warranty'
      ],
      comparisonData: {
        'Service Duration': '20-30 mins',
        'Price Range': '₹799 - ₹1,999',
        'Warranty Period': '3 months',
        'Home Service': 'Available',
        'Emergency Support': 'Yes',
        'Parts Included': 'Battery, Tools'
      }
    },
    {
      id: 3,
      title: 'Mobile Recharge',
      description: 'Instant mobile recharge for all operators with cashback offers and rewards',
      icon: 'Zap',
      iconColor: 'var(--color-secondary)',
      category: 'recharge',
      price: '10',
      duration: 'Instant',
      availability: 'Available',
      popular: true,
      features: [
        'All operators supported',
        'Instant processing',
        'Cashback offers available'
      ]
    },
    {
      id: 4,
      title: 'DTH Recharge',
      description: 'Quick DTH recharge for all service providers with special discount offers',
      icon: 'Tv',
      iconColor: 'var(--color-primary)',
      category: 'recharge',
      price: '100',
      duration: 'Instant',
      availability: 'Available',
      features: [
        'All DTH operators',
        'Instant activation',
        'Special offers'
      ]
    },
    {
      id: 5,
      title: 'Electricity Bill Payment',
      description: 'Pay electricity bills online with instant confirmation and payment history',
      icon: 'Lightbulb',
      iconColor: 'var(--color-warning)',
      category: 'recharge',
      price: '0',
      duration: 'Instant',
      availability: 'Available',
      features: [
        'No service charges',
        'Instant confirmation',
        'Payment history tracking'
      ]
    },
    {
      id: 6,
      title: 'Water Bill Payment',
      description: 'Convenient water bill payment with automatic reminders and receipt generation',
      icon: 'Droplet',
      iconColor: 'var(--color-secondary)',
      category: 'recharge',
      price: '0',
      duration: 'Instant',
      availability: 'Available',
      features: [
        'Zero charges',
        'Auto reminders',
        'Digital receipts'
      ]
    },
    {
      id: 7,
      title: 'PAN Card Application',
      description: 'Complete PAN card application assistance with document verification and tracking',
      icon: 'CreditCard',
      iconColor: 'var(--color-accent)',
      category: 'government',
      price: '107',
      duration: '15-20 days',
      availability: 'Available',
      popular: true,
      features: [
        'Document verification',
        'Application tracking',
        'Home delivery option'
      ],
      path: '/csc-portal'
    },
    {
      id: 8,
      title: 'Aadhaar Update',
      description: 'Update Aadhaar details including address, mobile number, and biometric information',
      icon: 'UserCheck',
      iconColor: 'var(--color-trust-builder)',
      category: 'government',
      price: '50',
      duration: '10-15 mins',
      availability: 'Available',
      features: [
        'Address update',
        'Mobile number update',
        'Biometric update'
      ],
      path: '/csc-portal'
    },
    {
      id: 9,
      title: 'Passport Application',
      description: 'Complete passport application support with form filling and document assistance',
      icon: 'Plane',
      iconColor: 'var(--color-primary)',
      category: 'government',
      price: '1500',
      duration: '30-45 days',
      availability: 'Available',
      features: [
        'Form filling assistance',
        'Document verification',
        'Appointment booking'
      ],
      path: '/csc-portal'
    },
    {
      id: 10,
      title: 'Voter ID Card',
      description: 'New voter ID card registration and existing card correction services',
      icon: 'Vote',
      iconColor: 'var(--color-secondary)',
      category: 'government',
      price: '30',
      duration: '20-30 days',
      availability: 'Available',
      features: [
        'New registration',
        'Correction services',
        'Status tracking'
      ],
      path: '/csc-portal'
    },
    {
      id: 11,
      title: 'Income Certificate',
      description: 'Apply for income certificate with complete documentation support',
      icon: 'FileText',
      iconColor: 'var(--color-accent)',
      category: 'government',
      price: '50',
      duration: '7-10 days',
      availability: 'Available',
      features: [
        'Document preparation',
        'Application submission',
        'Certificate delivery'
      ],
      path: '/csc-portal'
    },
    {
      id: 12,
      title: 'Software Installation',
      description: 'Professional software installation and configuration for all devices',
      icon: 'Download',
      iconColor: 'var(--color-primary)',
      category: 'digital',
      price: '299',
      duration: '30-60 mins',
      availability: 'Available',
      features: [
        'All software types',
        'Configuration included',
        'Post-installation support'
      ]
    },
    {
      id: 13,
      title: 'Data Recovery',
      description: 'Professional data recovery services for deleted or corrupted files',
      icon: 'HardDrive',
      iconColor: 'var(--color-warning)',
      category: 'digital',
      price: '999',
      duration: '2-4 hours',
      availability: 'Limited',
      features: [
        'All file types',
        'High success rate',
        'Secure process'
      ]
    },
    {
      id: 14,
      title: 'Email Setup',
      description: 'Professional email account setup and configuration for business and personal use',
      icon: 'Mail',
      iconColor: 'var(--color-secondary)',
      category: 'digital',
      price: '199',
      duration: '15-20 mins',
      availability: 'Available',
      features: [
        'All email providers',
        'Security setup',
        'Mobile sync'
      ]
    },
    {
      id: 15,
      title: 'Virus Removal',
      description: 'Complete virus and malware removal with system optimization',
      icon: 'Shield',
      iconColor: 'var(--color-accent)',
      category: 'digital',
      price: '499',
      duration: '1-2 hours',
      availability: 'Available',
      features: [
        'Complete scan',
        'Malware removal',
        'System optimization'
      ]
    },
    {
      id: 16,
      title: 'Cloud Backup Setup',
      description: 'Secure cloud backup configuration for automatic data protection',
      icon: 'Cloud',
      iconColor: 'var(--color-trust-builder)',
      category: 'digital',
      price: '399',
      duration: '30-45 mins',
      availability: 'Available',
      features: [
        'Automatic backup',
        'Secure encryption',
        'Easy restoration'
      ]
    },
    {
      id: 17,
      title: 'Water Damage Repair',
      description: 'Emergency water damage repair with component cleaning and testing',
      icon: 'Droplets',
      iconColor: 'var(--color-error)',
      category: 'mobile',
      price: '799',
      duration: '2-4 hours',
      availability: 'Limited',
      features: [
        'Component cleaning',
        'Functionality testing',
        'Corrosion treatment'
      ],
      comparisonData: {
        'Service Duration': '2-4 hours',
        'Price Range': '₹799 - ₹2,499',
        'Warranty Period': '1 month',
        'Home Service': 'Not Available',
        'Emergency Support': 'Yes',
        'Parts Included': 'Cleaning, Testing'
      }
    },
    {
      id: 18,
      title: 'Charging Port Repair',
      description: 'Fix charging port issues with cleaning or replacement services',
      icon: 'Plug',
      iconColor: 'var(--color-success)',
      category: 'mobile',
      price: '399',
      duration: '20-30 mins',
      availability: 'Available',
      features: [
        'Port cleaning',
        'Replacement if needed',
        'Charging test'
      ]
    },
    {
      id: 19,
      title: 'Speaker Repair',
      description: 'Professional speaker repair or replacement for clear audio quality',
      icon: 'Volume2',
      iconColor: 'var(--color-primary)',
      category: 'mobile',
      price: '599',
      duration: '30-45 mins',
      availability: 'Available',
      features: [
        'Audio testing',
        'Quality speakers',
        'Sound optimization'
      ]
    },
    {
      id: 20,
      title: 'Camera Repair',
      description: 'Camera lens replacement and sensor cleaning for perfect photos',
      icon: 'Camera',
      iconColor: 'var(--color-secondary)',
      category: 'mobile',
      price: '899',
      duration: '45-60 mins',
      availability: 'Available',
      features: [
        'Lens replacement',
        'Sensor cleaning',
        'Image quality test'
      ]
    },
    {
      id: 21,
      title: 'Button Repair',
      description: 'Fix or replace non-responsive buttons including power and volume keys',
      icon: 'ToggleLeft',
      iconColor: 'var(--color-accent)',
      category: 'mobile',
      price: '299',
      duration: '15-20 mins',
      availability: 'Available',
      features: [
        'All button types',
        'Quick service',
        'Functionality test'
      ]
    },
    {
      id: 22,
      title: 'Software Update',
      description: 'Latest OS update installation with backup and optimization',
      icon: 'RefreshCw',
      iconColor: 'var(--color-trust-builder)',
      category: 'mobile',
      price: '199',
      duration: '30-60 mins',
      availability: 'Available',
      features: [
        'Latest OS version',
        'Data backup',
        'Performance optimization'
      ]
    },
    {
      id: 23,
      title: 'Gas Bill Payment',
      description: 'Quick LPG gas bill payment with booking history and reminders',
      icon: 'Flame',
      iconColor: 'var(--color-warning)',
      category: 'recharge',
      price: '0',
      duration: 'Instant',
      availability: 'Available',
      features: [
        'All gas agencies',
        'Booking history',
        'Payment reminders'
      ]
    },
    {
      id: 24,
      title: 'Broadband Bill Payment',
      description: 'Pay broadband bills for all ISPs with instant confirmation',
      icon: 'Wifi',
      iconColor: 'var(--color-primary)',
      category: 'recharge',
      price: '0',
      duration: 'Instant',
      availability: 'Available',
      features: [
        'All ISP supported',
        'Instant processing',
        'Auto-pay option'
      ]
    }
  ];
// MongoDB connection
const MONGO_URI = "mongodb://localhost:27017/shiv-mobile-hub";

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
};
const mapCategory = (category) => {
  switch (category) {
    case "mobile":
      return "mobile-services";
    case "government":
      return "government-services";
    case "recharge":
      return "financial-services";
    case "digital":
      return "digital-services";
    default:
      return "digital-services";
  }
};

/**
 * Transform frontend service → DB service
 */
const transformService = (service, index) => ({
  name: service.title,
  description: service.description,
  icon: service.icon,
  category: mapCategory(service.category),
  subcategory: "",

  price: Number(service.price) || 0,
  priceType:
    Number(service.price) === 0 ? "free" : "fixed",

  duration: service.duration || "",

  image: {
    url: "",
    alt: "",
    publicId: ""
  },

  features: service.features || [],
  requirements: [],

  process: service.comparisonData
    ? Object.entries(service.comparisonData).map(
        ([key, value]) => ({
          step: key,
          description: value
        })
      )
    : [],

  faqs: [],

  isActive: true,
  isPopular: service.popular || false,
  displayOrder: index,

  seo: {
    title: service.title,
    description: service.description,
    keywords: []
  }
});

const seedServices = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Optional: clear old data
    await Service.deleteMany({});
    console.log("🧹 Old services removed");
    
    // servicesss array file
    const formatted = servicesData.map(transformService);

    await Service.insertMany(formatted);
    console.log("🚀 Services seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedServices();
