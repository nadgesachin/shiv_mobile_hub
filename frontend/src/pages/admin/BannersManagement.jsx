import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

const BannersManagement = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Banner');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      Toast.error('Failed to load banners');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please select an image');
      Toast.error('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Step 1: Upload image to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append('images', image);

      const token = localStorage.getItem('token');
      const uploadResponse = await fetch('http://localhost:5000/api/upload/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      if (!uploadData.success || !uploadData.data?.files?.[0]?.url) {
        throw new Error('Invalid upload response');
      }

      const imageUrl = uploadData.data.files[0].url;

      // Step 2: Create banner with the uploaded image URL
      const bannerPayload = {
        title: title,
        type: type,
        imageUrl: imageUrl
      };

      const bannerResponse = await fetch('http://localhost:5000/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bannerPayload),
      });

      if (bannerResponse.ok) {
        Toast.success('Banner created successfully!');
        await fetchBanners();
        setTitle('');
        setType('Banner');
        setImage(null);
        setPreview(null);
        setError('');
      } else {
        const errorData = await bannerResponse.json();
        throw new Error(errorData.message || 'Error adding banner');
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      setError(error.message || 'Error adding banner');
      Toast.error(error.message || 'Failed to create banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/banners/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Toast.success('Banner deleted successfully!');
        fetchBanners();
      } else {
        console.error('Error deleting banner');
        Toast.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      Toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        </div>

        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Banner</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
              <Icon name="AlertCircle" size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAddBanner} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-medium text-gray-600">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary" 
                  required 
                  disabled={uploading}
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-600">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                >
                  <option>Banner</option>
                  <option>Live Banner</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-gray-600">Image</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="w-full border p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary" 
                  required 
                  disabled={uploading}
                  accept="image/*"
                />
                {preview && <img src={preview} alt="Preview" className="w-24 h-12 object-cover rounded-lg" />}
              </div>
            </div>
            <div className="text-right">
              <Button type="submit" iconName={uploading ? "Loader" : "PlusCircle"} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Add Banner'}
              </Button>
            </div>
          </form>
        </motion.div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Banners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map(banner => (
              <motion.div 
                key={banner._id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{banner.title}</h3>
                    <p className="text-sm text-gray-500">{banner.type}</p>
                  </div>
                  <Button variant="destructive" size="sm" iconName="Trash2" onClick={() => handleDeleteBanner(banner._id)}>Delete</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannersManagement;

