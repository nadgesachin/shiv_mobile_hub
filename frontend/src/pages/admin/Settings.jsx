import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentCategory, setCurrentCategory] = useState('general');
  const [editingSetting, setEditingSetting] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    isPublic: false,
    category: 'general'
  });

  const categories = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'appearance', name: 'Appearance', icon: 'Palette' },
    { id: 'seo', name: 'SEO', icon: 'Search' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'security', name: 'Security', icon: 'Shield' }
  ];

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminSettings();
      setSettings(response.data || {});
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Initialize default settings
  const initializeSettings = async () => {
    try {
      setLoading(true);
      await apiService.initializeAdminSettings();
      await fetchSettings();
      setSuccess('Settings initialized successfully');
    } catch (err) {
      setError(err.message || 'Failed to initialize settings');
    } finally {
      setLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Set form data when editing
  const handleEditSetting = (setting) => {
    setFormData({
      key: setting.key,
      value: typeof setting.value === 'object' 
        ? JSON.stringify(setting.value, null, 2)
        : String(setting.value),
      description: setting.description || '',
      isPublic: setting.isPublic || false,
      category: setting.category || 'general'
    });
    setEditingSetting(setting);
  };

  // Handle setting update
  const handleUpdateSetting = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Parse value if it looks like JSON
      let parsedValue = formData.value;
      if (formData.value.trim().startsWith('{') || formData.value.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(formData.value);
        } catch (err) {
          // If parsing fails, keep as string
        }
      }
      
      const updateData = {
        value: parsedValue,
        description: formData.description,
        isPublic: formData.isPublic,
        category: formData.category
      };
      
      await apiService.updateAdminSetting(editingSetting.key, updateData);
      
      // Refresh settings
      await fetchSettings();
      
      // Reset form
      setFormData({
        key: '',
        value: '',
        description: '',
        isPublic: false,
        category: 'general'
      });
      
      setEditingSetting(null);
      setSuccess('Setting updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  // Handle setting creation
  const handleCreateSetting = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Parse value if it looks like JSON
      let parsedValue = formData.value;
      if (formData.value.trim().startsWith('{') || formData.value.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(formData.value);
        } catch (err) {
          // If parsing fails, keep as string
        }
      }
      
      await apiService.createAdminSetting({
        key: formData.key,
        value: parsedValue,
        description: formData.description,
        isPublic: formData.isPublic,
        category: formData.category
      });
      
      // Refresh settings
      await fetchSettings();
      
      // Reset form
      setFormData({
        key: '',
        value: '',
        description: '',
        isPublic: false,
        category: 'general'
      });
      
      setSuccess('Setting created successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create setting');
    } finally {
      setLoading(false);
    }
  };

  // Handle setting deletion
  const handleDeleteSetting = async (key) => {
    if (window.confirm(`Are you sure you want to delete setting "${key}"?`)) {
      try {
        setLoading(true);
        await apiService.deleteAdminSetting(key);
        await fetchSettings();
        setSuccess('Setting deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete setting');
      } finally {
        setLoading(false);
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSetting(null);
    setFormData({
      key: '',
      value: '',
      description: '',
      isPublic: false,
      category: 'general'
    });
  };

  if (loading && Object.keys(settings).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if we have any settings
  const hasSettings = Object.keys(settings).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Configure system settings</p>
        </div>
        <div className="flex gap-2">
          {!hasSettings && (
            <Button onClick={initializeSettings}>
              <Icon name="Database" size={16} className="mr-2" />
              Initialize Default Settings
            </Button>
          )}
          <Button onClick={() => {
            setEditingSetting(null);
            setFormData({
              key: '',
              value: '',
              description: '',
              isPublic: false,
              category: currentCategory
            });
          }}>
            <Icon name="Plus" size={16} className="mr-2" />
            Add Setting
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
          <Icon name="AlertCircle" size={20} />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <Icon name="CheckCircle" size={20} />
          <span>{success}</span>
          <Button variant="ghost" size="sm" onClick={() => setSuccess('')}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      {!hasSettings ? (
        <div className="text-center py-12">
          <Icon name="Settings" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No settings found</h3>
          <p className="text-muted-foreground mb-4">
            Initialize the default settings or create new ones
          </p>
          <Button onClick={initializeSettings}>
            <Icon name="Database" size={16} className="mr-2" />
            Initialize Default Settings
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg p-2">
              <ul className="space-y-1">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setCurrentCategory(category.id)}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                        currentCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={category.icon} size={16} className="mr-2" />
                      {category.name}
                      {settings[category.id] && (
                        <span className="ml-auto bg-background/50 text-xs px-2 py-0.5 rounded-full">
                          {settings[category.id]?.length || 0}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-9 space-y-6">
            {/* Settings Form */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                {editingSetting ? `Edit Setting: ${editingSetting.key}` : 'Add New Setting'}
              </h3>
              
              <form onSubmit={editingSetting ? handleUpdateSetting : handleCreateSetting}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Key *</label>
                    <Input
                      name="key"
                      value={formData.key}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingSetting}
                      placeholder="e.g., siteName, logoUrl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Value *</label>
                    <textarea
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y"
                      rows="5"
                      placeholder="String value or JSON object"
                    ></textarea>
                    <p className="text-xs text-muted-foreground">
                      For objects or arrays, use valid JSON format
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of this setting"
                    />
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-sm">Public setting (available without authentication)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : editingSetting ? 'Update Setting' : 'Create Setting'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Settings List */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">
                  {categories.find(cat => cat.id === currentCategory)?.name} Settings
                </h3>
              </div>
              
              {settings[currentCategory] && settings[currentCategory].length > 0 ? (
                <div className="divide-y divide-border">
                  {settings[currentCategory].map((setting) => (
                    <div key={setting.key} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{setting.key}</h4>
                            {setting.isPublic && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                Public
                              </span>
                            )}
                          </div>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditSetting(setting)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteSetting(setting.key)}
                          >
                            <Icon name="Trash" size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 p-2 bg-muted/50 rounded-md overflow-x-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {typeof setting.value === 'object'
                            ? JSON.stringify(setting.value, null, 2)
                            : String(setting.value)
                          }
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Database" size={32} className="mx-auto mb-2" />
                  <p>No settings found in this category</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setEditingSetting(null);
                      setFormData(prev => ({
                        ...prev,
                        category: currentCategory
                      }));
                    }}
                  >
                    Add {categories.find(cat => cat.id === currentCategory)?.name} Setting
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
