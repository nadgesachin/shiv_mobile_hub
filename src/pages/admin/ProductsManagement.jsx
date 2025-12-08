import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProductForm from '../../components/admin/ProductForm';
import ProductCard from '../../components/admin/ProductCard';

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
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });

  useEffect(() => {
    if(localStorage.getItem('categories-product')) {
      setCategories(JSON.parse(localStorage.getItem('categories')));
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
      setError(err.message || 'Failed to fetch categories');
    }
  };

  // Fetch products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        page: pagination.current,
        limit: pagination.limit,
        ...params
      });
      
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
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

  // Handle product creation
  const handleCreateProduct = async (productData) => {
    try {
      await apiService.createProduct(productData);
      await fetchProducts();
      setIsFormOpen(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create product');
    }
  };

  // Handle product update
  const handleUpdateProduct = async (id, productData) => {
    try {
      await apiService.updateProduct(id, productData);
      await fetchProducts();
      setIsFormOpen(false);
      setSelectedProduct(null);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update product');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(id);
        await fetchProducts();
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      }
    }
  };

  // Handle product status toggle
  const handleToggleStatus = async (id) => {
    try {
      await apiService.toggleProductStatus(id);
      await fetchProducts();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to toggle product status');
    }
  };

  // Open edit form
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
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
    setPagination(prev => ({ ...prev, current: page }));
    fetchProducts({ page });
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
                {categories.map(category => (
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
            Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
            {pagination.total} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === 1}
              onClick={() => handlePageChange(pagination.current - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.current} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === pagination.pages}
              onClick={() => handlePageChange(pagination.current + 1)}
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
    </div>
  );
};

export default ProductsManagement;
