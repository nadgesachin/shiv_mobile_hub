import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import apiService from '../../services/api';

const SimplifiedEnquiryForm = ({ 
  product = null, 
  onSuccess,
  onClose,
  isModal = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    productId: product?._id || product?.id || null,
    productName: product?.name || product?.title || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Submit enquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiService.request('/enquiries', 'POST', {
        ...formData,
        source: 'website',
        timestamp: new Date().toISOString()
      });
      
      if (response.success) {
        setShowSuccess(true);
        Toast.success('Enquiry submitted successfully! We will contact you soon.');
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          productId: null,
          productName: ''
        });
        
        // Call success callback
        onSuccess?.(response.data);
        
        // Close modal after 2 seconds if it's a modal
        if (isModal) {
          setTimeout(() => {
            onClose?.();
          }, 2000);
        }
      } else {
        throw new Error(response.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      Toast.error(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp enquiry
  const handleWhatsApp = () => {
    const phoneNumber = '919876543210'; // Replace with actual business WhatsApp number
    let message = `Hi! I'm interested in `;
    
    if (product) {
      message += `${product.name || product.title}`;
      if (product.price) {
        message += ` (₹${product.price})`;
      }
    } else {
      message += 'your products/services';
    }
    
    if (formData.name) {
      message += `\n\nMy name is ${formData.name}`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isModal ? '' : 'max-w-md mx-auto'} bg-white rounded-xl ${!isModal && 'shadow-lg'} p-6`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {product ? 'Product Enquiry' : 'Get in Touch'}
        </h2>
        <p className="text-gray-600">
          Fill the form below or contact us via WhatsApp for quick response
        </p>
      </div>

      {/* Product Info (if product enquiry) */}
      {product && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-4">
            {product.image && (
              <img 
                src={product.image || product.images?.[0]?.url} 
                alt={product.name || product.title}
                className="w-20 h-20 object-contain rounded-lg bg-white"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {product.name || product.title}
              </h3>
              {product.price && (
                <p className="text-lg font-bold text-primary mt-1">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Enquiry Submitted!</p>
                <p className="text-sm text-green-600">We'll contact you within 24 hours.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-gray-500">+91</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter 10-digit phone number"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Message (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Any specific requirements or questions?"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Icon name="Send" size={18} className="mr-2" />
                Submit Enquiry
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleWhatsApp}
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Icon name="MessageCircle" size={18} className="mr-2" />
            WhatsApp Us
          </Button>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          <Icon name="Shield" size={12} className="inline mr-1" />
          Your information is safe with us and will only be used to respond to your enquiry.
        </p>
      </form>
    </motion.div>
  );
};

export default SimplifiedEnquiryForm;
