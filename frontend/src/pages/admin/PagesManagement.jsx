import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiService from '../../services/api';

const PagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  
  // Rich text editor ref
  const editorRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true
  });
  
  // Load pages on mount
  useEffect(() => {
    fetchPages();
  }, []);
  
  // Fetch pages from API
  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPages();
      if (response.success) {
        setPages(response.data);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('Failed to load pages');
      toast.error('Failed to load pages');
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
  
  // Handle content change from rich text editor
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  
  // Generate slug from title
  const handleGenerateSlug = () => {
    if (formData.title) {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  // Open modal to create new page
  const handleCreateNew = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      isActive: true
    });
    setEditingPage(null);
    setModalOpen(true);
  };
  
  // Open modal to edit page
  const handleEdit = async (page) => {
    setLoading(true);
    try {
      // Fetch full page content
      const response = await apiService.getPageBySlug(page.slug);
      if (response.success) {
        const pageData = response.data;
        
        setFormData({
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          metaTitle: pageData.metaTitle || '',
          metaDescription: pageData.metaDescription || '',
          isActive: pageData.isActive
        });
        setEditingPage(pageData);
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching page details:', err);
      toast.error('Failed to load page details');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete button click
  const handleDeleteClick = (page) => {
    setPageToDelete(page);
    setConfirmDeleteModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        toast.error('Page title is required');
        return;
      }
      
      if (!formData.content.trim()) {
        toast.error('Page content is required');
        return;
      }
      
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription,
        isActive: formData.isActive
      };
      
      let response;
      
      if (editingPage) {
        // Update existing page
        response = await apiService.updatePage(editingPage._id, payload);
        toast.success('Page updated successfully');
      } else {
        // Create new page
        response = await apiService.createPage(payload);
        toast.success('Page created successfully');
      }
      
      // Refresh pages list
      fetchPages();
      
      // Close modal
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving page:', err);
      toast.error(err.response?.data?.message || 'Failed to save page');
    }
  };
  
  // Handle page deletion
  const handleDeletePage = async () => {
    try {
      if (!pageToDelete) return;
      
      await apiService.deletePage(pageToDelete._id);
      
      toast.success('Page deleted successfully');
      fetchPages();
      setConfirmDeleteModalOpen(false);
      setPageToDelete(null);
    } catch (err) {
      console.error('Error deleting page:', err);
      toast.error(err.response?.data?.message || 'Failed to delete page');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages Management</h1>
        
        <Button onClick={handleCreateNew}>
          <Icon name="Plus" className="mr-2" size={16} />
          Add New Page
        </Button>
      </div>
      
      {/* Pages List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <Button onClick={fetchPages} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="mb-4">No pages found</p>
            <Button onClick={handleCreateNew}>Create First Page</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pages.map((page) => (
                  <tr key={page._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <span className="font-medium">{page.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">{page.slug}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {page.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(page.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(page)}
                        className="mr-1"
                        aria-label="Edit page"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-2 py-1 mr-1 text-sm font-medium rounded-md text-primary hover:bg-primary/10 transition-colors"
                        aria-label="View page"
                      >
                        <Icon name="ExternalLink" size={16} />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(page)}
                        className="text-red-500"
                        aria-label="Delete page"
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
      
      {/* Page Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold">
                {editingPage ? 'Edit Page' : 'Create New Page'}
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
            
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={handleGenerateSlug}
                    >
                      Generate from title
                    </Button>
                  </div>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="page-url-slug"
                  />
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
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${
                      formData.isActive ? 'bg-primary' : 'bg-muted-foreground'
                    }`}>
                      <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform transform ${
                        formData.isActive ? 'translate-x-5' : 'translate-x-1'
                      } top-0.5`} />
                    </div>
                    <span className="ml-2 text-sm">Active</span>
                  </label>
                </div>
              </div>
              
              {/* Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background resize-vertical"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  HTML content is supported
                </p>
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
                      placeholder={formData.title}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave blank to use page title
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Brief description for search engines
                    </p>
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
                  {editingPage ? 'Update Page' : 'Create Page'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDeleteModalOpen && pageToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-red-500">Delete Page</h2>
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
                Are you sure you want to delete <strong>{pageToDelete.title}</strong>?
              </p>
              
              <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-md p-3 mb-4">
                <div className="flex items-start">
                  <Icon name="AlertTriangle" size={18} className="mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium">This action cannot be undone</p>
                    <p className="text-sm mt-1">
                      Once you delete this page, it will be permanently removed from the system.
                    </p>
                  </div>
                </div>
              </div>
              
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
                  onClick={handleDeletePage}
                >
                  Delete Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManagement;
