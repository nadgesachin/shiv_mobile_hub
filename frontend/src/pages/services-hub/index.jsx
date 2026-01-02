import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ServiceCard from './components/ServiceCard';
import CategoryFilter from './components/CategoryFilter';
import QuickActions from './components/QuickActions';
import BookingModal from './components/BookingModal';
import ServiceComparison from './components/ServiceComparison';
import TrustIndicators from './components/TrustIndicators';
import RecentBookings from './components/RecentBookings';
import apiService from 'services/api';
import { openChatWithLink } from '../../utils/ChatUtil';

const ServicesHub = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonServices, setComparisonServices] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(null);
  // const categories = [
  //   { id: 'mobile', name: 'Mobile Services', icon: 'Smartphone', color: 'var(--color-primary)', count: 8 },
  //   { id: 'recharge', name: 'Recharge & Bills', icon: 'Zap', color: 'var(--color-secondary)', count: 6 },
  //   { id: 'government', name: 'Government Services', icon: 'FileText', color: 'var(--color-accent)', count: 5 },
  //   { id: 'digital', name: 'Digital Services', icon: 'Globe', color: 'var(--color-trust-builder)', count: 5 }
  // ];

  const servicesss = [
    {
      id: 1,
      title: 'Mobile Screen Repair',
      description: 'Professional screen replacement with original quality parts and 6-month warranty coverage',
      icon: 'Smartphone',
      iconColor: 'var(--color-primary)',
      category: 'mobile',
      price: '999',
      duration: '30-45 mins',
      availability: 'Available',
      popular: true,
      features: [
        'Original quality display',
        '6-month warranty',
        'Free screen guard installation'
      ],
      comparisonData: {
        'Service Duration': '30-45 mins',
        'Price Range': '₹999 - ₹2,999',
        'Warranty Period': '6 months',
        'Home Service': 'Available',
        'Emergency Support': 'Yes',
        'Parts Included': 'Display, Tools'
      }
    },
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

  const quickActions = [
    { id: 1, title: 'Mobile Recharge', subtitle: 'Instant top-up', icon: 'Smartphone', color: 'var(--color-primary)' },
    { id: 2, title: 'Bill Payment', subtitle: 'Pay utility bills', icon: 'Receipt', color: 'var(--color-secondary)' },
    { id: 3, title: 'PAN Card', subtitle: 'Apply online', icon: 'CreditCard', color: 'var(--color-accent)' },
    { id: 4, title: 'Aadhaar Update', subtitle: 'Update details', icon: 'UserCheck', color: 'var(--color-trust-builder)' }
  ];

  const fetchCategories = async () => {
    try {
      const query = { type: 'service' };
      const response = await apiService.getCategories(query);
      if (response.data && response.data.length > 0) {
        const arr = [
          { _id: 'all', name: 'All Services', slug: 'all', icon: 'Grid3x3' },
          ...response.data.map(cat => ({ ...cat, slug: cat.slug || cat.name }))
        ];
        setCategories(arr);
        localStorage.setItem('categories-service', JSON.stringify(arr));
      } else {
        const fallback = [{ _id: 'all', name: 'All Services', slug: 'all', icon: 'Grid3x3' }];
        console.log('Setting fallback categories:', fallback);
        setCategories(fallback);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err.message || 'Failed to fetch categories');
    }
  };

  const fetchServices = async (categoryId = 'all') => {
    try {
      setServicesLoading(true);
      setServicesError(null);

      const params = {};
      if (categoryId !== 'all') {
        params.category = categoryId;
      }

      const response = await apiService.getServices(params);
      const data = response.data?.services;
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServicesError(err.message || 'Failed to fetch services');
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(); // Fetch all services on initial load
    if (localStorage.getItem('categories-service')) {
      const stored = JSON.parse(localStorage.getItem('categories-service'));
      const arr = [
        { _id: 'all', name: 'All Services', slug: 'all', icon: 'Grid3x3' },
        ...stored.filter(cat => cat._id !== 'all') // avoid duplicates
      ];
      setCategories(arr);
    } else {
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    const tempFilteredServices = Array.isArray(services) ? services.filter(service => {
      if (activeCategory === 'all') return true;
      const cat = service.category;
      const catSlug = typeof cat === 'string' ? cat.toLowerCase() : (cat?.slug || cat?.name || '').toLowerCase();
      const activeSlug = (activeCategory || '').toLowerCase();
      const matchesCategory = catSlug === activeSlug;
      const matchesSearch =
        service?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        service?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      return matchesCategory && matchesSearch;
    }) : [];

    console.log('Services after filtering:', tempFilteredServices);
    setFilteredServices(tempFilteredServices);
  }, [services, activeCategory, searchQuery]);
  // const quickActions = [
  //   { id: 1, title: 'Mobile Recharge', subtitle: 'Instant top-up', icon: 'Smartphone', color: 'var(--color-primary)' },
  //   { id: 2, title: 'Bill Payment', subtitle: 'Pay utility bills', icon: 'Receipt', color: 'var(--color-secondary)' },
  //   { id: 3, title: 'PAN Card', subtitle: 'Apply online', icon: 'CreditCard', color: 'var(--color-accent)' },
  //   { id: 4, title: 'Aadhaar Update', subtitle: 'Update details', icon: 'UserCheck', color: 'var(--color-trust-builder)' }
  // ];

  const recentBookings = [
    {
      id: 1,
      service: 'Mobile Screen Repair',
      customer: 'Rajesh Kumar',
      date: '28 Nov 2025',
      time: '02:30 PM',
      status: 'Completed',
      amount: '1,299',
      icon: 'Smartphone',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 2,
      service: 'PAN Card Application',
      customer: 'Priya Sharma',
      date: '29 Nov 2025',
      time: '11:00 AM',
      status: 'In Progress',
      amount: '107',
      icon: 'CreditCard',
      iconColor: 'var(--color-accent)'
    },
    {
      id: 3,
      service: 'Battery Replacement',
      customer: 'Amit Patel',
      date: '30 Nov 2025',
      time: '10:00 AM',
      status: 'Scheduled',
      amount: '899',
      icon: 'Battery',
      iconColor: 'var(--color-success)'
    },
    {
      id: 4,
      service: 'Aadhaar Update',
      customer: 'Sneha Reddy',
      date: '30 Nov 2025',
      time: '03:00 PM',
      status: 'Scheduled',
      amount: '50',
      icon: 'UserCheck',
      iconColor: 'var(--color-trust-builder)'
    }
  ];

  const handleBookNow = (service) => {
    const url = `${window.location.origin}/services-hub`; // or a more specific path if you have one

    openChatWithLink(
      {
        name: service.title,
        url,
      },
      'book'
    );
  };

  const handleBookingConfirm = (bookingData) => {
    setShowBookingModal(false);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const handleQuickAction = (action) => {
    const service = services?.find(s => s?.name === action?.name);
    if (service) {
      handleBookNow(service);
    }
  };

  const handleCompareServices = () => {
    const mobileServices = services?.filter(s => s?.category === 'mobile' && s?.comparisonData)?.slice(0, 3);
    setComparisonServices(mobileServices);
    setShowComparison(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {bookingSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-success text-success-foreground px-6 py-4 rounded-lg shadow-strong flex items-center gap-3 animate-slide-in-right">
          <Icon name="CheckCircle" size={24} />
          <div>
            <p className="font-semibold">Booking Confirmed!</p>
            <p className="text-sm opacity-90">You will receive confirmation via SMS and email</p>
          </div>
        </div>
      )}
      <section className="bg-community-pulse py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
              Complete Digital Services Hub
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              From mobile repairs to government services, we're your one-stop solution for all digital needs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                size="lg"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => handleBookNow(services?.[0])}
              >
                Book a Service
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="GitCompare"
                iconPosition="left"
                onClick={handleCompareServices}
              >
                Compare Services
              </Button>
            </div>
          </div>

          {/* <QuickActions actions={quickActions} onActionClick={handleQuickAction} /> */}
        </div>
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <TrustIndicators /> */}
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={(slug) => setActiveCategory(slug)}
              />
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="max-w-md"
                />
              </div>

              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredServices?.length} services
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    iconName="LayoutGrid"
                    iconPosition="left"
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    iconName="List"
                    iconPosition="left"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="SlidersHorizontal"
                    iconPosition="left"
                  >
                    Filters
                  </Button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices?.map((service) => (
                    <ServiceCard
                      key={service?.id}
                      service={service}
                      viewMode="grid"
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredServices?.map((service) => (
                    <ServiceCard
                      key={service?.id}
                      service={service}
                      viewMode="list"
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              )}

              {filteredServices?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {showComparison && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold text-foreground">
                Service Comparison
              </h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowComparison(false)}
              >
                Close
              </Button>
            </div>
            <ServiceComparison
              services={comparisonServices}
              onSelectService={handleBookNow}
            />
          </div>
        </section>
      )}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-bold text-foreground mb-2">
              Recent Bookings
            </h2>
            <p className="text-muted-foreground">
              Track your service bookings and history
            </p>
          </div>
          <RecentBookings bookings={recentBookings} />
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-8 text-center">
            <Icon name="Headphones" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
            <h2 className="text-2xl font-headline font-bold text-foreground mb-2">
              Need Help Choosing a Service?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our expert team is available 24/7 to help you select the right service for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                iconName="Phone"
                iconPosition="left"
                onClick={() => navigate('/contact')}
              >
                Call Us Now
              </Button>
              <Button
                variant="outline"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
      {showBookingModal && selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
      <Footer />
    </div>
  );
};

export default ServicesHub;