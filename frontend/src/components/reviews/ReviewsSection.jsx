import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import Button from '../ui/Button';

const ReviewsSection = ({ productId, serviceId, initialTab = 'read' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'read' or 'write'
  
  const handleReviewSubmitted = () => {
    setActiveTab('read');
  };

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">Reviews & Feedback</h2>
          
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('read')}
            >
              Read Reviews
            </Button>
            <Button
              variant={activeTab === 'write' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('write')}
            >
              Write a Review
            </Button>
          </div>
        </div>
        
        {activeTab === 'write' ? (
          <ReviewForm 
            productId={productId} 
            serviceId={serviceId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        ) : (
          <ReviewList 
            productId={productId}
            serviceId={serviceId}
          />
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
