import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkOrderSection = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productCategory: '',
    quantity: '',
    requirements: '',
  });

  const categoryOptions = [
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'accessories', label: 'Mobile Accessories' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'smartwatches', label: 'Smartwatches' },
    { value: 'audio', label: 'Audio Devices' },
    { value: 'mixed', label: 'Mixed Products' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Bulk order inquiry:', formData);
  };

  const benefits = [
    {
      icon: 'Percent',
      title: 'Volume Discounts',
      description: 'Get up to 25% off on bulk orders of 50+ units',
    },
    {
      icon: 'Truck',
      title: 'Free Delivery',
      description: 'Complimentary delivery for orders above ₹50,000',
    },
    {
      icon: 'Shield',
      title: 'Extended Warranty',
      description: 'Additional 6 months warranty on bulk purchases',
    },
    {
      icon: 'Headphones',
      title: 'Dedicated Support',
      description: 'Priority customer service and technical assistance',
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Package" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Bulk Orders</h2>
          <p className="text-sm text-muted-foreground">Special pricing for business customers</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose Us for Bulk Orders?</h3>
          <div className="space-y-4 mb-6">
            {benefits?.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={benefit?.icon} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{benefit?.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit?.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-success/10 border border-success rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-success mb-1">Trusted by 500+ Businesses</h4>
                <p className="text-sm text-muted-foreground">
                  Join retailers, corporate offices, and educational institutions who trust us for their bulk technology needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Request a Quote</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Name"
              type="text"
              placeholder="Enter your business name"
              value={formData?.businessName}
              onChange={(e) => handleInputChange('businessName', e?.target?.value)}
              required
            />

            <Input
              label="Contact Person"
              type="text"
              placeholder="Enter contact person name"
              value={formData?.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="business@example.com"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                required
              />
            </div>

            <Select
              label="Product Category"
              placeholder="Select product category"
              options={categoryOptions}
              value={formData?.productCategory}
              onChange={(value) => handleInputChange('productCategory', value)}
              required
            />

            <Input
              label="Estimated Quantity"
              type="number"
              placeholder="Enter quantity (minimum 50 units)"
              value={formData?.quantity}
              onChange={(e) => handleInputChange('quantity', e?.target?.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Requirements
              </label>
              <textarea
                className="w-full px-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                rows="4"
                placeholder="Tell us about your specific requirements, preferred brands, delivery timeline, etc."
                value={formData?.requirements}
                onChange={(e) => handleInputChange('requirements', e?.target?.value)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              iconName="Send"
              iconPosition="left"
            >
              Submit Inquiry
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Our team will contact you within 24 hours with a customized quote
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderSection;