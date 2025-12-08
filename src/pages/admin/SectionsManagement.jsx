import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SectionsManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    title: '',
    subtitle: '',
    description: '',
    maxProducts: 10,
    isActive: true,
    displayOrder: 0,
    settings: {
      showBadge: true,
      showRating: true,
      showDiscount: true,
      autoUpdate: false,
      updateCriteria: 'newest'
    }
  });

  // Available section names (enum options)
  const availableSectionNames = [
    { value: 'flash-deals', label: 'Flash Deals' },
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'top-accessories', label: 'Top Accessories' },
    { value: 'featured-products', label: 'Featured Products' },
  ];

   // Curated list of Lucide icon names you want to allow
  const ICON_OPTIONS = [
    'Smartphone',
    'Watch',
    'Headphones',
    'Tablet',
    'Laptop',
    'Cpu',
    'Camera',
    'ShoppingBag',
    'ShoppingCart',
    'Wrench',
    'Tool',
    'Settings',
    'FileText',
    'Globe',
    'CreditCard',
    'User',
    'Users',
    'Grid3x3',
    'Star',
    'BadgeCheck',
    'Bell',
    'MessageSquare',
    'Phone',
    'Mail',
    'Home',
    'Package',
    'Zap'
  ];

  // Filter icons based on search
  const filteredIcons = ICON_OPTIONS.filter(icon =>
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );
  // Update criteria options
  const updateCriteriaOptions = [
    { value: 'newest', label: 'Newest Products' },
    { value: 'bestselling', label: 'Bestselling Products' },
    { value: 'discounted', label: 'Discounted Products' },
    { value: 'highest-rated', label: 'Highest Rated Products' },
  ];

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminSections();
      setSections(response.data.sections || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // Load sections on component mount
  useEffect(() => {
    fetchSections();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested properties (settings)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle section creation
  const handleCreateSection = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiService.createAdminSection(formData);
      await fetchSections();
      setIsFormOpen(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  // Handle section update
  const handleUpdateSection = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiService.updateAdminSection(selectedSection._id, formData);
      await fetchSections();
      setIsFormOpen(false);
      resetForm();
      setIsEditing(false);
      setSelectedSection(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update section');
    } finally {
      setLoading(false);
    }
  };

  // Handle section deletion
  const handleDeleteSection = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        setLoading(true);
        await apiService.deleteAdminSection(id);
        await fetchSections();
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to delete section');
      } finally {
        setLoading(false);
      }
    }
  };

  // Open create form
  const handleCreateNew = () => {
    resetForm();
    setIsEditing(false);
    setSelectedSection(null);
    setIsFormOpen(true);
  };

  // Open edit form
  const handleEditSection = (section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      icon: section.icon,
      title: section.title,
      subtitle: section.subtitle || '',
      description: section.description || '',
      maxProducts: section.maxProducts,
      isActive: section.isActive,
      displayOrder: section.displayOrder,
      settings: {
        showBadge: section.settings?.showBadge ?? true,
        showRating: section.settings?.showRating ?? true,
        showDiscount: section.settings?.showDiscount ?? true,
        autoUpdate: section.settings?.autoUpdate ?? false,
        updateCriteria: section.settings?.updateCriteria || 'newest'
      }
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
    setIsEditing(false);
    setSelectedSection(null);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      title: '',
      subtitle: '',
      description: '',
      maxProducts: 10,
      isActive: true,
      displayOrder: 0,
      settings: {
        showBadge: true,
        showRating: true,
        showDiscount: true,
        autoUpdate: false,
        updateCriteria: 'newest'
      }
    });
  };

  if (loading && sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sections Management</h2>
          <p className="text-muted-foreground">Manage homepage sections</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Icon name="Plus" size={16} className="mr-2" />
          Add Section
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
          <Icon name="AlertCircle" size={20} />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Grid3x3" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No sections found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first homepage section
          </p>
          <Button onClick={handleCreateNew}>
            <Icon name="Plus" size={16} className="mr-2" />
            Add Your First Section
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    {section.isActive ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {section.subtitle || 'No subtitle'}
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Icon name="Layers" size={14} className="text-muted-foreground" />
                      <span>{section.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Icon name="Package" size={14} className="text-muted-foreground" />
                      <span>{section.products?.length || 0} / {section.maxProducts} products</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Icon name="ArrowDownUp" size={14} className="text-muted-foreground" />
                      <span>Display order: {section.displayOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditSection(section)}>
                    <Icon name="Edit" size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSection(section._id)}
                  >
                    <Icon name="Trash" size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section Form (Create/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {isEditing ? 'Edit Section' : 'Add New Section'}
                </h3>
                <Button variant="ghost" size="sm" onClick={handleCloseForm}>
                  <Icon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={isEditing ? handleUpdateSection : handleCreateSection}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Section Name *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isEditing}
                      placeholder="Section Name"
                    />
                    {/* <label className="block text-sm font-medium">Section Type *</label>
                    <select
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isEditing}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Section Type</option>
                      {availableSectionNames.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select> */}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <div className="relative icon-dropdown">
                      <button
                        type="button"
                        onClick={() => setIconDropdownOpen(!iconDropdownOpen)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {formData.icon ? (
                            <>
                              <Icon name={formData.icon} size={20} />
                              <span>{formData.icon}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Select an icon</span>
                          )}
                        </div>
                        <Icon name="ChevronDown" size={16} className={`transition-transform ${iconDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {iconDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                          <div className="p-2 border-b border-border">
                            <Input
                              type="text"
                              placeholder="Search icons..."
                              value={iconSearch}
                              onChange={(e) => setIconSearch(e.target.value)}
                              className="w-full"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto p-2">
                            {filteredIcons.length > 0 ? (
                              <div className="grid grid-cols-4 gap-1">
                                {filteredIcons.map((iconName) => (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, icon: iconName }));
                                      setIconDropdownOpen(false);
                                      setIconSearch('');
                                    }}
                                    className={`p-2 rounded flex flex-col items-center justify-center hover:bg-muted transition-colors ${formData.icon === iconName ? 'bg-primary text-primary-foreground' : ''
                                      }`}
                                    title={iconName}
                                  >
                                    <Icon name={iconName} size={20} />
                                    <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground py-4">
                                No icons found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Title *</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Subtitle</label>
                    <Input
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Max Products</label>
                    <Input
                      type="number"
                      name="maxProducts"
                      value={formData.maxProducts}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                    />
                  </div>

                  <div className="flex items-center h-full pt-5">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">Active Section</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <h4 className="text-lg font-medium mb-3">Display Settings</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="settings.showBadge"
                        checked={formData.settings.showBadge}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">Show Badge</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="settings.showRating"
                        checked={formData.settings.showRating}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">Show Rating</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="settings.showDiscount"
                        checked={formData.settings.showDiscount}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">Show Discount</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="settings.autoUpdate"
                        checked={formData.settings.autoUpdate}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">Auto Update Products</span>
                    </label>
                  </div>

                  {formData.settings.autoUpdate && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Update Criteria</label>
                      <select
                        name="settings.updateCriteria"
                        value={formData.settings.updateCriteria}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {updateCriteriaOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : isEditing ? 'Update Section' : 'Create Section'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsManagement;
