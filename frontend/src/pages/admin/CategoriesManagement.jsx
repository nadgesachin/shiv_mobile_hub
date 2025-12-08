import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiService from '../../services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [transferCategoryId, setTransferCategoryId] = useState('');
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

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
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    type: 'product',
    icon: '',
    image: '',
    isActive: true,
    order: 0,
    metaTitle: '',
    metaDescription: ''
  });

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Close icon dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconDropdownOpen && !event.target.closest('.icon-dropdown')) {
        setIconDropdownOpen(false);
        setIconSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [iconDropdownOpen]);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCategories();
      console.log("response", response);
      if (response.data && response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && name === 'image') {
      handleImageUpload(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await apiService.uploadMultipleImages([file]);
      setImagePreview(URL.createObjectURL(file));
      const newImages = response?.data?.files.map(file => ({
        url: file.url
      }));

      setFormData(prev => ({
        ...prev,
        image: newImages[0]?.url || ''
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // Open modal to create new category
  const handleCreateNew = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
      type: 'product',
      icon: '',
      image: '',
      isActive: true,
      order: 0,
      metaTitle: '',
      metaDescription: ''
    });
    setEditingCategory(null);
    setModalOpen(true);
  };

  // Open modal to edit category
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parent || '',
      type: category.type,
      icon: category.icon,
      image: category.image || '',
      isActive: category.isActive,
      order: category.order || 0,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || ''
    });
    setImagePreview(category.image ? category.image : null);
    setEditingCategory(category);
    setModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setTransferCategoryId('');
    setConfirmDeleteModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        parentId: formData.parentId || null,
        type: formData.type,
        icon: formData.icon,
        image: formData.image,
        isActive: formData.isActive,
        order: parseInt(formData.order),
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription
      };

      let response;

      if (editingCategory) {
        // Update existing category
        response = await apiService.updateCategory(editingCategory._id, payload);
        toast.success('Category updated successfully');
      } else {
        // Create new category
        response = await apiService.createCategory(payload);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    try {
      if (!categoryToDelete) return;
      let url = `/api/categories/${categoryToDelete._id}`;
      // If transferring children, add query param
      if (transferCategoryId) {
        url += `?transferChildrenTo=${transferCategoryId}`;
      }

      await apiService.deleteCategory(categoryToDelete._id);

      toast.success('Category deleted successfully');
      fetchCategories();
      setConfirmDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Get potential parent categories (all except self and descendants)
  const getPotentialParents = () => {
    if (!editingCategory) return categories;
    // Filter out self and any descendants to prevent circular references
    return categories.filter(category => {
      // Exclude self
      if (category._id === editingCategory._id) return false;
      // Exclude descendants by checking if this category is in their ancestors
      if (category.ancestors) {
        return !category.ancestors.some(ancestor => ancestor._id === editingCategory._id);
      }

      return true;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>

        <Button onClick={handleCreateNew}>
          <Icon name="Plus" className="mr-2" size={16} />
          Add New Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <Button onClick={fetchCategories} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Folder" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="mb-4">No categories found</p>
            <Button onClick={handleCreateNew}>Create First Category</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Parent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="font-medium">{category.name}</span>
                        {category.ancestors?.length > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (/{category.ancestors.map(a => a.slug).join('/')}/{category.slug})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {category.parent ? (
                        categories.find(c => c._id === category.parent)?.name || 'Unknown'
                      ) : (
                        <span className="text-muted-foreground">None (Root)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="truncate block max-w-xs">
                        {category.description || <span className="text-muted-foreground italic">No description</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {category.order || 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="mr-1"
                        aria-label="Edit category"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category)}
                        className="text-red-500"
                        aria-label="Delete category"
                      >
                        <Icon name="Trash" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <Icon name="X" size={18} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Parent Category
                  </label>
                  <select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">None (Root Category)</option>
                    {getPotentialParents().map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                        {cat.ancestors?.length > 0 && ` (${cat.ancestors.map(a => a.name).join(' > ')})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="product">Product Category</option>
                    <option value="service">Service Category</option>
                  </select>
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category Image</label>
                  <Input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image or drag and drop. The URL will be saved automatically.
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers display first
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center h-full pt-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-primary' : 'bg-muted-foreground'
                      }`}>
                      <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform transform ${formData.isActive ? 'translate-x-5' : 'translate-x-1'
                        } top-0.5`} />
                    </div>
                    <span className="ml-2 text-sm">Active</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                />
              </div>

              {/* SEO Fields */}
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-md font-medium mb-3">SEO Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                    </label>
                    <Input
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder={formData.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                      placeholder={formData.description}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 border-t border-border pt-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-red-500">Delete Category</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteModalOpen(false)}
                aria-label="Close modal"
              >
                <Icon name="X" size={18} />
              </Button>
            </div>

            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?
              </p>

              {/* Check for child categories */}
              {categories.some(cat => cat.parent === categoryToDelete._id) && (
                <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-md p-3 mb-4">
                  <div className="flex items-start">
                    <Icon name="AlertTriangle" size={18} className="mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">This category has subcategories</p>
                      <p className="text-sm mt-1">
                        You need to select a category to transfer the subcategories to,
                        or delete them first.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">
                      Transfer subcategories to:
                    </label>
                    <select
                      value={transferCategoryId}
                      onChange={(e) => setTransferCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.filter(cat =>
                        cat._id !== categoryToDelete._id &&
                        (!cat.ancestors || !cat.ancestors.some(a => a._id === categoryToDelete._id))
                      ).map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteCategory}
                  disabled={
                    categories.some(cat => cat.parent === categoryToDelete._id) &&
                    !transferCategoryId
                  }
                >
                  Delete Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
