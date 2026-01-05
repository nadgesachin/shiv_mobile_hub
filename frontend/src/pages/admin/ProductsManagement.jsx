import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import ProductForm from '../../components/admin/ProductForm';
import ProductCard from '../../components/admin/ProductCard';
import ProductPreviewModal from '../../components/admin/ProductPreviewModal';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
  const [previewProduct, setPreviewProduct] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    page: 1,
    pages: 1,
    total: 0,
    limit: 20
  });

  useEffect(() => {
    if(localStorage.getItem('categories-product')) {
      setCategories(JSON.parse(localStorage.getItem('categories-product')));
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const query = {
        type: 'product'
      };
      const response = await apiService.getCategories(query, false);
      if(response.data){
        setCategories(response.data);
        localStorage.setItem('categories-product', JSON.stringify(response.data));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    }
  };

  // Fetch products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        page: params.page || pagination.page || 1,
        limit: pagination.limit,
        ...params
      });
      
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      setPagination({ ...response.data.pagination, current: response.data.pagination.page });
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      Toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditing && selectedProduct) {
        await apiService.updateProduct(selectedProduct._id, formData);
        Toast.success('Product updated successfully!');
      } else {
        await apiService.createProduct(formData);
        Toast.success('Product created successfully!');
      }
      await fetchProducts();
      handleCloseForm();
      setError('');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
      Toast.error(err.message || 'Failed to save product');
      throw err;
    }
  };

  // Handle product update
  const handleUpdateProduct = async (id, productData) => {
    console.log('Attempting to update product with ID:', id);
    console.log('Data being sent:', productData);
    try {
      await apiService.updateProduct(id, productData);
      console.log('Product update API call successful.');
      await fetchProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
      setIsEditing(false);
      setError('');
      Toast.success('Product updated successfully!');
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err.message || 'Failed to update product');
      Toast.error('Failed to update product');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    const product = products.find(p => p._id === id);
    setDeleteModal({ isOpen: true, productId: id, productName: product?.name || 'this product' });
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await apiService.deleteProduct(deleteModal.productId);
      Toast.success('Product deleted successfully!');
      await fetchProducts({ page: pagination.page });
      setError('');
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      Toast.error('Failed to delete product');
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
  };

  // Handle product status toggle
  const handleToggleStatus = async (id) => {
    try {
      await apiService.toggleProductStatus(id);
      Toast.success('Product status updated!');
      await fetchProducts();
      setError('');
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err.message || 'Failed to toggle product status');
      Toast.error('Failed to update status');
    }
  };

  // Open edit form - fetch fresh data from API
  const handleEditProduct = async (product) => {
    try {
      setLoading(true);
      const response = await apiService.request(`/products/${product._id}`);
      
      if (response.success && response.data) {
        setSelectedProduct(response.data?.product);
        setIsEditing(true);
        setIsFormOpen(true);
      } else {
        setError('Failed to fetch product details');
        Toast.error('Failed to load product details');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product details');
      Toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Open create form
  const handleCreateNew = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page: page, current: page }));
    fetchProducts({ page });
  };

  // Handle show product preview
  const handleShowProduct = (product) => {
    setPreviewProduct(product);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setPreviewProduct(null);
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setSelectedCategory('all'); // Reset to all category
    fetchProducts({}); // Fetch all products without filter
  };

  if (loading && products.length === 0) {
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
          <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Icon name="Plus" size={16} className="mr-2" />
          Add Product
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories?.length > 0 && categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={handleClearFilter}>
                Clear Filter
              </Button>
            </div>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" onClick={() => fetchProducts()}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button onClick={handleCreateNew}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onShow={() => handleShowProduct(product)}
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteProduct(product._id)}
              onToggleStatus={() => handleToggleStatus(product._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1 || loading}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          isEditing={isEditing}
          onSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
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
                  Delete Product?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{deleteModal.productName}</span>? This action cannot be undone.
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

      {/* Product Preview Modal */}
      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
