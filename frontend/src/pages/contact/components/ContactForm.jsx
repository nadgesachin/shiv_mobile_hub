import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toast from '../../../components/ui/Toast';
import apiService from '../../../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    "General Inquiry",
    "Technical Support",
    "Service Booking",
    "Product Information",
    "CSC Services",
    "Complaint/Feedback",
    "Business Partnership",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = "Name is required";
    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData?.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/?.test(formData?.phone)) {
      newErrors.phone = "Invalid phone number (10 digits starting with 6-9)";
    }
    if (!formData?.subject?.trim()) newErrors.subject = "Subject is required";
    if (!formData?.category) newErrors.category = "Please select a category";
    if (!formData?.message?.trim()) newErrors.message = "Message is required";
    else if (formData?.message?.trim()?.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await apiService.request('/contact/send', {
        method: 'POST',
        data: formData
      });

      if (response.success) {
        setSubmitSuccess(true);
        Toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: ''
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        Toast.error(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and our team will get back to you within 24 hours
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Icon name="Clock" size={24} color="var(--color-primary)" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 2-4 hours during business hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-success/5 rounded-lg border border-success/20">
                <Icon name="Shield" size={24} color="var(--color-success)" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Data Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your information is secure and will never be shared with third parties
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <Icon name="Headphones" size={24} color="var(--color-secondary)" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Expert Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our certified technicians are ready to assist with any query
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-soft">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start space-x-3">
                <Icon name="CheckCircle" size={24} color="var(--color-success)" />
                <div>
                  <h4 className="font-semibold text-success mb-1">Message Sent Successfully!</h4>
                  <p className="text-sm text-muted-foreground">
                    We've received your message and will respond shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData?.name}
                onChange={handleChange}
                error={errors?.name}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData?.email}
                  onChange={handleChange}
                  error={errors?.email}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="98765 43210"
                  value={formData?.phone}
                  onChange={handleChange}
                  error={errors?.phone}
                  required
                />
              </div>

              <Input
                label="Subject"
                type="text"
                name="subject"
                placeholder="Brief subject of your inquiry"
                value={formData?.subject}
                onChange={handleChange}
                error={errors?.subject}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-accent">*</span>
                </label>
                <select
                  name="category"
                  value={formData?.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-background border ${errors?.category ? 'border-error' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth`}
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors?.category && (
                  <p className="mt-1 text-sm text-error">{errors?.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Describe your inquiry in detail (minimum 20 characters)"
                  value={formData?.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-background border ${errors?.message ? 'border-error' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth resize-none`}
                />
                {errors?.message && (
                  <p className="mt-1 text-sm text-error">{errors?.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formData?.message?.length} characters
                </p>
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isSubmitting}
                iconName="Send"
                iconPosition="right"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;