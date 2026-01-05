import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

const PostersManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'product', 'service'
  
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    } else {
      loadPosters();
    }
  }, [isAdmin, navigate, filter]);
  
  const loadPosters = async () => {
    try {
      setLoading(true);
      const queryParam = filter !== 'all' ? `?type=${filter}` : '';
      const response = await apiService.request(`/posters${queryParam}`);
      setPosters(response.data || []);
    } catch (error) {
      console.error('Error loading posters:', error);
      Toast.error('Failed to load posters');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;
    
    try {
      await apiService.request(`/posters/${id}`, {
        method: 'DELETE'
      });
      
      Toast.success('Poster deleted successfully');
      loadPosters();
    } catch (error) {
      console.error('Error deleting poster:', error);
      Toast.error('Failed to delete poster');
    }
  };
  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Posters</h1>
            <p className="text-muted-foreground">
              Manage your marketing posters
            </p>
          </div>
          <Button onClick={() => navigate('/admin/poster-generator')}>
            <Icon name="Plus" size={18} className="mr-2" />
            Create New Poster
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'product' ? 'default' : 'outline'}
            onClick={() => setFilter('product')}
            size="sm"
          >
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            Products
          </Button>
          <Button
            variant={filter === 'service' ? 'default' : 'outline'}
            onClick={() => setFilter('service')}
            size="sm"
          >
            <Icon name="Wrench" size={16} className="mr-2" />
            Services
          </Button>
        </div>
        
        {/* Posters Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posters.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="Image" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posters yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first poster to get started
            </p>
            <Button onClick={() => navigate('/admin/poster-generator')}>
              <Icon name="Plus" size={18} className="mr-2" />
              Create Poster
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <div
                key={poster._id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted/30 flex items-center justify-center p-4">
                  <div className="text-center">
                    <Icon name="Image" size={48} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {poster.size.width}×{poster.size.height}px
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {poster.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      poster.type === 'product'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {poster.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {poster.type === 'product' && poster.productId?.name}
                    {poster.type === 'service' && poster.serviceId?.name}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="capitalize">{poster.template} Template</span>
                    <span>{new Date(poster.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/admin/poster-generator?edit=${poster._id}`)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(poster._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon name="Trash" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostersManagement;
