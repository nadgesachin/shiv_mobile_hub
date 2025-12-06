import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ServiceForm = ({ service, isEditing, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Wrench',
    category: 'mobile-services',
    subcategory: '',
    price: '',
    priceType: 'fixed',
    duration: '',
    features: [],
    requirements: [],
    process: [],
    isPopular: false,
    displayOrder: 0,
    image: {
      url: '',
      alt: '',
      publicId: ''
    }
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [processStep, setProcessStep] = useState({ step: '', description: '' });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'mobile-services', label: 'Mobile Services' },
    { value: 'government-services', label: 'Government Services' },
    { value: 'financial-services', label: 'Financial Services' },
    { value: 'digital-services', label: 'Digital Services' }
  ];

  const priceTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'variable', label: 'Variable Price' },
    { value: 'free', label: 'Free' }
  ];

  const icons = [
    'Wrench', 'Smartphone', 'Battery', 'Zap', 'Tv', 'Lightbulb', 'Droplet',
    'CreditCard', 'UserCheck', 'Plane', 'Vote', 'FileText', 'Download',
    'HardDrive', 'Mail', 'Shield', 'Cloud', 'Droplets', 'Plug', 'Volume2',
    'Camera', 'ToggleLeft', 'RefreshCw', 'Flame', 'Wifi'
  ];

  // Initialize form with service data if editing
  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        icon: service.icon || 'Wrench',
        category: service.category || 'mobile-services',
        subcategory: service.subcategory || '',
        price: service.price || '',
        priceType: service.priceType || 'fixed',
        duration: service.duration || '',
        features: service.features || [],
        requirements: service.requirements || [],
        process: service.process || [],
        isPopular: service.isPopular || false,
        displayOrder: service.displayOrder || 0,
        image: service.image || { url: '', alt: '', publicId: '' }
      });
    }
  }, [isEditing, service]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add feature
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  // Remove feature
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add requirement
  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  // Remove requirement
  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Add process step
  const handleAddProcessStep = () => {
    if (processStep.step.trim() && processStep.description.trim()) {
      setFormData(prev => ({
        ...prev,
        process: [...prev.process, { ...processStep }]
      }));
      setProcessStep({ step: '', description: '' });
    }
  };

  // Remove process step
  const handleRemoveProcessStep = (index) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Service name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.priceType) newErrors.priceType = 'Price type is required';
    if (formData.priceType !== 'free' && (!formData.price || formData.price < 0)) {
      newErrors.price = 'Valid price is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      price: formData.priceType === 'free' ? 0 : Number(formData.price),
      displayOrder: Number(formData.displayOrder)
    };
    
    if (isEditing) {
      onSubmit(service._id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Service Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter service name"
                className={errors.name ? 'border-error' : ''}
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {icons.map(icon => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter service description"
              className={`w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-error' : ''}`}
            />
            {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? 'border-error' : ''}`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-error text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price Type *
              </label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.priceType ? 'border-error' : ''}`}
              >
                {priceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.priceType && <p className="text-error text-sm mt-1">{errors.priceType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price {formData.priceType !== 'free' && '*'}
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={formData.priceType === 'free'}
                className={errors.price ? 'border-error' : ''}
              />
              {errors.price && <p className="text-error text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Duration
              </label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 30-45 mins, Instant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Display Order
              </label>
              <Input
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Features
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <Button type="button" onClick={handleAddFeature}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                >
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Requirements
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add a requirement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
              />
              <Button type="button" onClick={handleAddRequirement}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((requirement, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                >
                  {requirement}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRequirement(index)}
                    className="p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Process Steps
            </label>
            <div className="space-y-2 mb-2">
              <div className="flex gap-2">
                <Input
                  value={processStep.step}
                  onChange={(e) => setProcessStep(prev => ({ ...prev, step: e.target.value }))}
                  placeholder="Step name (e.g., Diagnosis)"
                />
                <Input
                  value={processStep.description}
                  onChange={(e) => setProcessStep(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Step description"
                />
                <Button type="button" onClick={handleAddProcessStep}>
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {formData.process.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <span className="font-medium text-sm">{step.step}:</span>
                    <span className="text-sm text-muted-foreground ml-2">{step.description}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProcessStep(index)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Service */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleChange}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium text-foreground">
              Mark as Popular Service
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
