import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ProductForm = ({ product, isEditing, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'smartphones',
    subcategory: '',
    brand: '',
    badge: '',
    rating: '',
    reviewCount: '',
    specs: [],
    stockStatus: 'in-stock',
    stockCount: '',
    sections: [],
    detailedSpecs: {},
    images: []
  });
  
  const [specInput, setSpecInput] = useState('');
  const [detailedSpecInput, setDetailedSpecInput] = useState({ key: '', value: '' });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'audio', label: 'Audio' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const subcategories = {
    smartphones: [],
    tablets: [],
    audio: [],
    wearables: [],
    accessories: ['chargers', 'cases', 'power-banks', 'stylus', 'cables', 'screen-protectors']
  };

  const badges = [
    'Bestseller',
    'New Arrival', 
    'Hot Deal',
    'Premium',
    'Limited Edition',
    'Pro Series',
    'Gaming Beast',
    "Editor's Choice",
    'Apple Certified',
    'New Release',
    'Official',
    'Best ANC'
  ];

  const sections = [
    { value: 'flash-deals', label: 'Flash Deals' },
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'top-accessories', label: 'Top Accessories' },
    { value: 'featured-products', label: 'Featured Products' }
  ];

  // Initialize form with product data if editing
  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'smartphones',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        badge: product.badge || '',
        rating: product.rating || '',
        reviewCount: product.reviewCount || '',
        specs: product.specs || [],
        stockStatus: product.stockStatus || 'in-stock',
        stockCount: product.stockCount || '',
        sections: product.sections || [],
        detailedSpecs: product.detailedSpecs || {},
        images: product.images || []
      });
    }
  }, [isEditing, product]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'sections') {
        setFormData(prev => ({
          ...prev,
          sections: checked 
            ? [...prev.sections, value]
            : prev.sections.filter(s => s !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add spec to specs array
  const handleAddSpec = () => {
    if (specInput.trim()) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, specInput.trim()]
      }));
      setSpecInput('');
    }
  };

  // Remove spec from specs array
  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  // Add detailed spec
  const handleAddDetailedSpec = () => {
    if (detailedSpecInput.key.trim() && detailedSpecInput.value.trim()) {
      setFormData(prev => ({
        ...prev,
        detailedSpecs: {
          ...prev.detailedSpecs,
          [detailedSpecInput.key.trim()]: detailedSpecInput.value.trim()
        }
      }));
      setDetailedSpecInput({ key: '', value: '' });
    }
  };

  // Remove detailed spec
  const handleRemoveDetailedSpec = (key) => {
    const newDetailedSpecs = { ...formData.detailedSpecs };
    delete newDetailedSpecs[key];
    setFormData(prev => ({
      ...prev,
      detailedSpecs: newDetailedSpecs
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const response = await apiService.uploadMultipleImages(files);
      
      const newImages = response.data.files.map(file => ({
        url: file.url,
        alt: file.originalName,
        publicId: file.publicId
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(prev => ({ ...prev, images: 'Failed to upload images' }));
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = async (index) => {
    const image = formData.images[index];
    
    try {
      if (image.publicId) {
        await apiService.deleteImage(image.publicId);
      }
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rating: formData.rating ? Number(formData.rating) : 0,
      reviewCount: formData.reviewCount ? Number(formData.reviewCount) : 0,
      stockCount: formData.stockCount ? Number(formData.stockCount) : 0
    };
    
    if (isEditing) {
      onSubmit(product._id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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
                Product Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={errors.name ? 'border-error' : ''}
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Brand *
              </label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className={errors.brand ? 'border-error' : ''}
              />
              {errors.brand && <p className="text-error text-sm mt-1">{errors.brand}</p>}
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
              rows={4}
              placeholder="Enter product description"
              className={`w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-error' : ''}`}
            />
            {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price *
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.price ? 'border-error' : ''}
              />
              {errors.price && <p className="text-error text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Original Price
              </label>
              <Input
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock Count
              </label>
              <Input
                name="stockCount"
                type="number"
                value={formData.stockCount}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Category and Badge */}
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

            {subcategories[formData.category]?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select subcategory</option>
                  {subcategories[formData.category].map(sub => (
                    <option key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Badge
              </label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select badge</option>
                {badges.map(badge => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stock Status
            </label>
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Homepage Sections
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sections.map(section => (
                <label key={section.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sections"
                    value={section.value}
                    checked={formData.sections.includes(section.value)}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{section.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Key Specifications
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={specInput}
                onChange={(e) => setSpecInput(e.target.value)}
                placeholder="Add a spec (e.g., 8GB RAM)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
              />
              <Button type="button" onClick={handleAddSpec}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specs.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                >
                  {spec}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-0 h-4 w-4"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Specs */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Detailed Specifications
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={detailedSpecInput.key}
                  onChange={(e) => setDetailedSpecInput(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="Spec name (e.g., Display)"
                />
                <Input
                  value={detailedSpecInput.value}
                  onChange={(e) => setDetailedSpecInput(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Spec value (e.g., 6.7-inch AMOLED)"
                />
                <Button type="button" onClick={handleAddDetailedSpec}>
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              <div className="space-y-1">
                {Object.entries(formData.detailedSpecs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDetailedSpec(key)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Images *
            </label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </span>
                </label>
              </div>

              {/* Error */}
              {errors.images && (
                <p className="text-error text-sm">{errors.images}</p>
              )}

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
