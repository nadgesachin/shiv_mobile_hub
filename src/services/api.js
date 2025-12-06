const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
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

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

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
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
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
  async getSections() {
    return this.request('/sections');
  }

  async getSection(name) {
    return this.request(`/sections/${name}`);
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
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/services${queryString ? `?${queryString}` : ''}`);
  }

  async getService(id) {
    return this.request(`/services/${id}`);
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
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
