import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Icon from '../AppIcon';
import Toast from '../ui/Toast';
import apiService from '../../services/api';
import LoginModal from '../auth/LoginModal';

const ReviewForm = ({ productId, serviceId, onReviewSubmitted }) => {
  const { isAuthenticated, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    // In a real implementation, you would handle file uploads
    // For now, we'll just simulate it
    if (e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).slice(0, 3); // Limit to 3 images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      Toast.success(`${newImages.length} image(s) selected`);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    if (formData.rating === 0) {
      Toast.error('Please select a rating');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare review data
      const reviewData = {
        userId: user._id,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        // In a real implementation, you would handle image uploads differently
        images: [] // This would contain the URLs after upload
      };
      
      if (productId) {
        reviewData.productId = productId;
      } else if (serviceId) {
        reviewData.serviceId = serviceId;
      }
      
      // Submit review to API
      await apiService.createReview(reviewData);
      
      Toast.success('Review submitted successfully!');
      
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        images: []
      });
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-4">Write a Review</h2>
        
        {!isAuthenticated() && (
          <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
            <Icon name="Info" size={18} className="text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-warning font-medium">Login Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                You need to login to submit a review. Click submit to proceed with login.
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  <Icon 
                    name="Star" 
                    size={24} 
                    color={star <= (hoverRating || formData.rating) ? 'var(--color-warning)' : 'var(--color-muted)'}
                    fill={star <= (hoverRating || formData.rating) ? 'var(--color-warning)' : 'transparent'}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {formData.rating > 0 && (
                  <>
                    {formData.rating}/5 - {' '}
                    {formData.rating === 1 && 'Poor'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 5 && 'Excellent'}
                  </>
                )}
              </span>
            </div>
          </div>
          
          {/* Review title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Review Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your experience"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Review comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="What did you like or dislike about it?"
              rows={4}
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>
          
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Add Photos (optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 bg-muted rounded overflow-hidden">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-black/50 p-0.5 rounded-bl"
                    onClick={() => removeImage(index)}
                  >
                    <Icon name="X" size={12} color="#fff" />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 3 && (
                <label className="w-16 h-16 border-2 border-dashed border-border flex flex-col items-center justify-center rounded cursor-pointer hover:border-primary transition-colors">
                  <Icon name="Plus" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    multiple={formData.images.length === 0}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              You can upload up to 3 images (PNG, JPG)
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="mr-2">Submitting...</span>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </div>
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default ReviewForm;
