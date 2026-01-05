import CacheService from './cacheService';

const API_BASE_URL = import.meta.env.VITE_ADSENSE_ID || 'http://localhost:5000/api';
console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
    this.defaultCacheTime = 30; // Default cache time in minutes
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}, cacheOptions = {}) {
    const { useCache = false, cacheTime = this.defaultCacheTime, invalidateCache = false } = cacheOptions;
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };
    
    // Generate a cache key based on the URL and request method/body
    const cacheKey = this.generateCacheKey(endpoint, options);
    
    // If this is a write operation (not GET), invalidate related caches
    if (options.method && options.method !== 'GET') {
      // Extract entity type from endpoint (e.g., /products, /categories)
      const entityType = endpoint.split('/')[1];
      if (entityType) {
        CacheService.invalidateByPrefix(entityType);
      }
    }
    
    // For explicit cache invalidation
    if (invalidateCache) {
      CacheService.remove(cacheKey);
    }
    
    // Only use cache for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      try {
        // Try to get from cache first
        return await CacheService.getOrFetch(
          cacheKey,
          async () => {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.message || 'API request failed');
            }
            
            return data;
          },
          cacheTime
        );
      } catch (error) {
        console.error('API Error with cache:', error);
        throw error;
      }
    } else {
      // Regular request without cache
      try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  }
  
  // Generate a unique cache key based on endpoint and request options
  generateCacheKey(endpoint, options) {
    const method = options.method || 'GET';
    let key = `${method}_${endpoint}`;
    
    // Add query params if any
    const urlParts = endpoint.split('?');
    if (urlParts.length > 1) {
      key = `${method}_${urlParts[0]}_${urlParts[1]}`;
    }
    
    // Add body hash to key for non-GET methods with body
    if (options.body && method !== 'GET') {
      try {
        // Simple body hash
        const bodyStr = typeof options.body === 'string' 
          ? options.body 
          : JSON.stringify(options.body);
        key += `_${bodyStr.length}_${bodyStr.slice(0, 50)}`;
      } catch (e) {
        // Ignore body hash if we can't stringify it
      }
    }
    
    return key;
  }

  // Authentication endpoints
  async login(email, password, role = 'user') {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Product endpoints
  async getProducts(params = {}, useCache = false) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`, {}, { useCache });
  }

  async getProduct(id, useCache = false) {
    return this.request(`/products/${id}`, {}, { useCache });
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id) {
    return this.request(`/products/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async getProductCategories() {
    return this.request('/products/meta/categories');
  }

  // Section endpoints
  async getSections(useCache = false) {
    return this.request('/sections', {}, { useCache });
  }

  async getSection(name, useCache = false) {
    return this.request(`/sections/${name}`, {}, { useCache });
  }

  async createSection(sectionData) {
    return this.request('/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async updateSection(id, sectionData) {
    return this.request(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async addProductToSection(sectionId, productId) {
    return this.request(`/sections/${sectionId}/add-product`, {
      method: 'PUT',
      body: JSON.stringify({ productId }),
    });
  }

  async removeProductFromSection(sectionId, productId) {
    return this.request(`/sections/${sectionId}/remove-product`, {
      method: 'PUT',
      body: JSON.stringify({ productId }),
    });
  }

  async autoUpdateSection(id) {
    return this.request(`/sections/${id}/auto-update`, {
      method: 'PUT',
    });
  }

  // Service endpoints
  async getServices(params = {}, useCache = false) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/services${queryString ? `?${queryString}` : ''}`, {}, { useCache });
  }

  async getService(id, useCache = false) {
    return this.request(`/services/${id}`, {}, { useCache });
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id, serviceData) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleServiceStatus(id) {
    return this.request(`/services/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async toggleServicePopular(id) {
    return this.request(`/services/${id}/toggle-popular`, {
      method: 'PUT',
    });
  }

  async getServiceCategories() {
    return this.request('/services/meta/categories');
  }

  // Category management methods
  async getCategories(params = {}, useCache = false) {
    try {
    const queryString = new URLSearchParams(params).toString(); 
    return this.request(`/categories${queryString ? `?${queryString}` : ''}`, {}, { useCache });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(idOrSlug, useCache = false) {
    return this.request(`/categories/${idOrSlug}`, {}, { useCache });
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }, { invalidateCache: true });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }, { invalidateCache: true });
  }

  async deleteCategory(id, transferChildrenTo = null) {
    let endpoint = `/categories/${id}`;
    if (transferChildrenTo) {
      endpoint += `?transferChildrenTo=${transferChildrenTo}`;
    }
    return this.request(endpoint, {
      method: 'DELETE',
    }, { invalidateCache: true });
  }
  
  // Page management methods
  async getPages(params = {}, useCache = false) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/pages${queryString ? `?${queryString}` : ''}`, {}, { useCache });
  }

  async getPageBySlug(slug, useCache = false) {
    return this.request(`/pages/${slug}`, {}, { useCache });
  }

  async createPage(pageData) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    }, { invalidateCache: true });
  }

  async updatePage(id, pageData) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    }, { invalidateCache: true });
  }

  async deletePage(id) {
    return this.request(`/pages/${id}`, {
      method: 'DELETE',
    }, { invalidateCache: true });
  }

  // User management (admin only)
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async toggleUserStatus(id) {
    return this.request(`/users/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // Admin Product Management
  async getAdminProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminProduct(id) {
    return this.request(`/admin/products/${id}`);
  }

  async createAdminProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateAdminProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteAdminProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleAdminProductStatus(id) {
    return this.request(`/admin/products/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  // Admin Section Management
  async getAdminSections(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/sections${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminSection(id) {
    return this.request(`/admin/sections/${id}`);
  }

  async createAdminSection(sectionData) {
    return this.request('/admin/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async updateAdminSection(id, sectionData) {
    return this.request(`/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async deleteAdminSection(id) {
    return this.request(`/admin/sections/${id}`, {
      method: 'DELETE',
    });
  }

  async addProductToSection(sectionId, productId) {
    return this.request(`/admin/sections/${sectionId}/add-product`, {
      method: 'PUT',
      body: JSON.stringify({ productId }),
    });
  }

  async removeProductFromSection(sectionId, productId) {
    return this.request(`/admin/sections/${sectionId}/remove-product`, {
      method: 'PUT',
      body: JSON.stringify({ productId }),
    }, { invalidateCache: true });
  }

  // Admin Service Management
  async getAdminServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/services${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminService(id) {
    return this.request(`/admin/services/${id}`);
  }

  async createAdminService(serviceData) {
    return this.request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }, { invalidateCache: true });
  }

  async updateAdminService(id, serviceData) {
    return this.request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }, { invalidateCache: true });
  }

  async deleteAdminService(id) {
    return this.request(`/admin/services/${id}`, {
      method: 'DELETE',
    }, { invalidateCache: true });
  }

  async toggleAdminServiceStatus(id) {
    return this.request(`/admin/services/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async toggleAdminServicePopular(id) {
    return this.request(`/admin/services/${id}/toggle-popular`, {
      method: 'PUT',
    });
  }

  // Admin User Management
  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminUser(id) {
    return this.request(`/admin/users/${id}`);
  }

  async toggleUserStatus(id) {
    return this.request(`/admin/users/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/update-role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Admin Settings Management
  async getAdminSettings(category) {
    const queryString = category ? `?category=${category}` : '';
    return this.request(`/admin/settings${queryString}`);
  }

  async getAdminSetting(key) {
    return this.request(`/admin/settings/${key}`);
  }

  async createAdminSetting(settingData) {
    return this.request('/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settingData),
    });
  }

  async updateAdminSetting(key, settingData) {
    return this.request(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify(settingData),
    });
  }

  async deleteAdminSetting(key) {
    return this.request(`/admin/settings/${key}`, {
      method: 'DELETE',
    });
  }

  async initializeAdminSettings() {
    return this.request('/admin/settings/initialize', {
      method: 'POST',
    });
  }

  // File upload endpoints
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseURL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async uploadMultipleImages(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${this.baseURL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async deleteImage(publicId) {
    return this.request(`/upload/${publicId}`, {
      method: 'DELETE',
    });
  }

  async getTransformedImageUrl(publicId, transformations = {}) {
    return this.request('/upload/transform', {
      method: 'POST',
      body: JSON.stringify({ publicId, transformations }),
    });
  }

  async createCategory(formData){
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }

  async updateCategory(id, formData){
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData)
    });
  }

  async deleteCategory(id){
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllConversations(){
    return this.request('/messages/conversations');
  }

  async getAllConversationsById(userId){
    return this.request(`/messages/conversations/${userId}`);
  }

  async markMessagesAsRead(userId){
    return this.request(`/messages/read/${userId}`, {
      method: 'PUT',
    });
  }

  async sendMessage(payload){
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getReviewList(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // Review endpoints
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async getReview(id) {
    return this.request(`/reviews/${id}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id, reviewData) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async addReviewReply(id, replyData) {
    return this.request(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }

  async markReviewHelpful(id) {
    return this.request(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
  }

  async getAllMessages(userId) {
    return this.request(`/messages/conversations/${userId}`, {
      method: 'GET',
    });
  }

}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
