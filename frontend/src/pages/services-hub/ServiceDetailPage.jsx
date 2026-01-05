import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import ServiceEnquiryModal from '../../components/services/ServiceEnquiryModal';
import Header from '../../components/ui/Header';
import ReviewsSection from '../../components/reviews/ReviewsSection';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getService(id, true);
      
      if (response.success) {
        setService(response.data);
        setError(null);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: `Check out ${service.name} at Shiv Mobile Hub`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/services-hub')}>
              Back to Services
            </Button>
          </div>
        </div>
      </>
    );
  }

  const iconColor = service.iconColor || '#6366f1';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
            <Icon name="ChevronRight" size={16} className="mx-2 text-gray-400" />
            <Link to="/services-hub" className="text-gray-600 hover:text-primary">Services</Link>
            <Icon name="ChevronRight" size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{service.name}</span>
          </nav>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Service Icon & Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                {/* Icon */}
                <div 
                  className="w-32 h-32 rounded-3xl flex items-center justify-center mb-6 mx-auto"
                  style={{ 
                    backgroundColor: `${iconColor}15`,
                    border: `2px solid ${iconColor}30`
                  }}
                >
                  <Icon 
                    name={service.icon || 'Wrench'} 
                    size={64} 
                    style={{ color: iconColor }}
                  />
                </div>

                {/* Service Images Gallery */}
                {service.images && service.images.length > 0 && (
                  <div className="mb-6">
                    {/* Main Image */}
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                      <img
                        src={typeof service.images[selectedImageIndex] === 'string' 
                          ? service.images[selectedImageIndex] 
                          : service.images[selectedImageIndex]?.url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {service.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          {selectedImageIndex + 1} / {service.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {service.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {service.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex === idx
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={typeof img === 'string' ? img : img?.url}
                              alt={`${service.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Popular Badge */}
                {service.popular && (
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-full">
                      ⭐ Popular Service
                    </span>
                  </div>
                )}

                {/* Service Details */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Icon name="Clock" size={20} className="text-primary mr-2" />
                      <span className="text-gray-600">Duration</span>
                    </div>
                    <span className="font-semibold text-gray-900">{service.duration || '30-60 mins'}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Icon name="IndianRupee" size={20} className="text-primary mr-2" />
                      <span className="text-gray-600">Starting Price</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{service.price?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Icon name="Calendar" size={20} className="text-primary mr-2" />
                      <span className="text-gray-600">Availability</span>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      {service.availability || 'Available'}
                    </span>
                  </div>

                  {service.category && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Icon name="Tag" size={20} className="text-primary mr-2" />
                        <span className="text-gray-600">Category</span>
                      </div>
                      <span className="font-semibold text-gray-900 capitalize">
                        {service.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full mt-6 py-3 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <Icon name="Share2" size={20} className="mr-2 text-gray-700" />
                  <span className="font-medium">Share Service</span>
                </button>
              </div>
            </motion.div>

            {/* Service Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={18}
                        className={`${
                          i < Math.floor(service.rating || 4.5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {service.rating || '4.5'} ({service.reviewCount || '0'} reviews)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About this Service</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Icon name="CheckCircle2" size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowEnquiryModal(true)}
                >
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Book Now
                </Button>

                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="Users" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Expert Team</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="Shield" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Quality Assured</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="Clock" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Quick Service</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: 'Calendar', title: 'Book Service', desc: 'Choose your preferred time' },
                { icon: 'MessageCircle', title: 'Get Confirmation', desc: 'Receive booking confirmation' },
                { icon: 'Wrench', title: 'Service Delivery', desc: 'Our expert handles it' },
                { icon: 'Star', title: 'Rate & Review', desc: 'Share your experience' },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <Icon name={step.icon} size={28} style={{ color: iconColor }} />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReviewsSection serviceId={id} />
          </motion.div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <ServiceEnquiryModal
          service={service}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ServiceDetailPage;
