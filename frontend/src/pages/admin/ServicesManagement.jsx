import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import ServiceForm from '../../components/admin/ServiceForm';
import ServiceCard from '../../components/admin/ServiceCard';
import ServicePreviewModal from '../../components/admin/ServicePreviewModal';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, serviceId: null, serviceName: '' });
  const [previewService, setPreviewService] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'mobile-services', name: 'Mobile Services' },
    { id: 'government-services', name: 'Government Services' },
    { id: 'financial-services', name: 'Financial Services' },
    { id: 'digital-services', name: 'Digital Services' }
  ];

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.getServices();
      setServices(response.data.services);
      setFilteredServices(response.data.services);
      setError('');
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
      Toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search and category
  useEffect(() => {
    let filtered = [...services];
    
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  // Handle service creation
  const handleSubmit = async (formData) => {
    try {
      if (isEditing && selectedService) {
        await apiService.updateService(selectedService._id, formData);
        Toast.success('Service updated successfully!');
      } else {
        await apiService.createService(formData);
        Toast.success('Service created successfully!');
      }
      await fetchServices();
      handleCloseForm();
      setError('');
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.message || 'Failed to save service');
      Toast.error(err.message || 'Failed to save service');
      throw err;
    }
  };

  // Handle service update
  const handleUpdateService = async (id, serviceData) => {
    try {
      await apiService.updateService(id, serviceData);
      Toast.success('Service updated successfully!');
      await fetchServices();
      setIsFormOpen(false);
      setSelectedService(null);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update service');
      Toast.error('Failed to update service');
    }
  };

  // Handle service deletion
  const handleDeleteService = async (id) => {
    const service = services.find(s => s._id === id);
    setDeleteModal({ isOpen: true, serviceId: id, serviceName: service?.name || 'this service' });
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await apiService.deleteService(deleteModal.serviceId);
      Toast.success('Service deleted successfully!');
      await fetchServices();
      setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' });
      setError('');
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Failed to delete service');
      Toast.error('Failed to delete service');
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' });
  };

  // Handle service status toggle
  const handleToggleStatus = async (id) => {
    try {
      await apiService.toggleServiceStatus(id);
      Toast.success('Service status updated!');
      await fetchServices();
      setError('');
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err.message || 'Failed to toggle service status');
      Toast.error('Failed to update status');
    }
  };

  // Handle service popular toggle
  const handleTogglePopular = async (id) => {
    try {
      await apiService.toggleServicePopular(id);
      Toast.success('Service popular status updated!');
      await fetchServices();
      setError('');
    } catch (err) {
      console.error('Error toggling popular:', err);
      setError(err.message || 'Failed to toggle popular status');
      Toast.error('Failed to update popular status');
    }
  };

  // Open edit form - fetch fresh data from API
  const handleEditService = async (service) => {
    try {
      setLoading(true);
      const response = await apiService.request(`/services/${service._id}`);
      
      if (response.success && response.data) {
        setSelectedService(response.data);
        setIsEditing(true);
        setIsFormOpen(true);
      } else {
        setError('Failed to fetch service details');
        Toast.error('Failed to load service details');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError(err.message || 'Failed to load service details');
      Toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  // Open create form
  const handleCreateNew = () => {
    setSelectedService(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedService(null);
    setIsEditing(false);
  };

  // Handle show service preview
  const handleShowService = (service) => {
    setPreviewService(service);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setPreviewService(null);
  };

  if (loading && services.length === 0) {
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
          <h2 className="text-2xl font-bold text-foreground">Services Management</h2>
          <p className="text-muted-foreground">Manage your service catalog</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Icon name="Plus" size={16} className="mr-2" />
          Add Service
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

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" onClick={fetchServices}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Wrench" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by adding your first service'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button onClick={handleCreateNew}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Your First Service
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onShow={() => handleShowService(service)}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteService(service._id)}
              onToggleStatus={() => handleToggleStatus(service._id)}
              onTogglePopular={() => handleTogglePopular(service._id)}
            />
          ))}
        </div>
      )}

      {/* Service Form Modal */}
      {isFormOpen && (
        <ServiceForm
          service={selectedService}
          isEditing={isEditing}
          onSubmit={isEditing ? handleUpdateService : handleCreateService}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-error/10 rounded-full">
                <Icon name="AlertTriangle" size={24} className="text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Delete Service?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{deleteModal.serviceName}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmDelete}
                className="bg-error hover:bg-error/90 text-white"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Service Preview Modal */}
      {previewService && (
        <ServicePreviewModal
          service={previewService}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
