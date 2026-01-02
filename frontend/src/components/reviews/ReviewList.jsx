import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import apiService from '../../services/api';

const ReviewSummary = ({ ratings, totalReviews }) => {
  const calculateAverageRating = () => {
    if (!ratings || totalReviews === 0) return 0;
    
    let totalStars = 0;
    Object.entries(ratings).forEach(([rating, count]) => {
      totalStars += parseInt(rating) * count;
    });
    
    return totalStars / totalReviews;
  };
  
  const averageRating = calculateAverageRating();
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating - fullStars >= 0.5;
  
  return (
    <div className="bg-muted/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</h3>
          <div className="flex mt-1">
            {[...Array(5)].map((_, index) => (
              <Icon 
                key={index}
                name="Star"
                size={16}
                color="var(--color-warning)"
                fill={
                  index < fullStars 
                    ? "var(--color-warning)" 
                    : (index === fullStars && hasHalfStar)
                    ? "url(#half-star)" 
                    : "transparent"
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        
        <div className="hidden md:block">
          <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
            Sort Reviews
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratings?.[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="text-xs w-8">{rating} star</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground w-8 text-right">
                {percentage.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewItem = ({ review }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="border-b border-border last:border-b-0 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={14} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{review.userName || 'Anonymous User'}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <Icon 
              key={index}
              name="Star"
              size={14}
              color={index < review.rating ? 'var(--color-warning)' : 'var(--color-muted)'}
              fill={index < review.rating ? 'var(--color-warning)' : 'transparent'}
            />
          ))}
        </div>
      </div>
      
      {review.title && (
        <h4 className="font-medium text-sm mb-1">{review.title}</h4>
      )}
      
      <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
      
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto py-1">
          {review.images.map((image, index) => (
            <div 
              key={index}
              className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-border"
            >
              <img 
                src={image.url} 
                alt={`Review ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-4 mt-2">
        <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ThumbsUp" size={12} />
          <span>Helpful ({review.helpfulCount || 0})</span>
        </button>
        
        {review.verifiedPurchase && (
          <span className="text-xs flex items-center gap-1 text-success">
            <Icon name="CheckCircle" size={12} />
            <span>Verified Purchase</span>
          </span>
        )}
      </div>
    </div>
  );
};

const ReviewList = ({ productId, serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    ratings: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  
  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      
      let params = { page: pageNum, limit: 5 };
      if (productId) {
        params.productId = productId;
      } else if (serviceId) {
        params.serviceId = serviceId;
      }
      
      const response = await apiService.get('/api/reviews', { params });
      
      const { reviews: newReviews, summary: newSummary, pagination } = response.data;
      
      if (pageNum === 1) {
        setReviews(newReviews);
        setSummary(newSummary || summary);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      
      setHasMore(pagination?.hasNextPage || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      
      // Provide some dummy data if API fails
      if (pageNum === 1) {
        setReviews(generateDummyReviews());
        setSummary({
          totalReviews: 12,
          ratings: {
            5: 7,
            4: 3,
            3: 1,
            2: 1,
            1: 0
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [productId, serviceId]);
  
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReviews(nextPage);
    }
  };
  
  // Generate dummy reviews for testing or when API fails
  const generateDummyReviews = () => {
    return [
      {
        _id: '1',
        userId: 'user1',
        userName: 'Rajesh Kumar',
        rating: 5,
        title: 'Excellent service!',
        comment: 'The repair was done quickly and professionally. My phone works like new again.',
        createdAt: '2025-10-15T10:30:00Z',
        helpfulCount: 8,
        verifiedPurchase: true
      },
      {
        _id: '2',
        userId: 'user2',
        userName: 'Priya Sharma',
        rating: 4,
        title: 'Great quality products',
        comment: 'I bought a screen protector and case, both are good quality. The installation was perfect.',
        createdAt: '2025-10-12T14:45:00Z',
        helpfulCount: 3,
        verifiedPurchase: true
      },
      {
        _id: '3',
        userId: 'user3',
        userName: 'Amit Singh',
        rating: 5,
        title: 'Very professional staff',
        comment: 'The staff is very knowledgeable and helped me choose the right phone for my needs.',
        createdAt: '2025-10-10T09:15:00Z',
        helpfulCount: 5,
        verifiedPurchase: true
      },
      {
        _id: '4',
        userId: 'user4',
        userName: 'Sneha Reddy',
        rating: 3,
        title: 'Good but could be better',
        comment: 'The service was okay but took longer than expected. The staff was friendly though.',
        createdAt: '2025-10-05T16:20:00Z',
        helpfulCount: 1,
        verifiedPurchase: false
      },
      {
        _id: '5',
        userId: 'user5',
        userName: 'Vivek Mehta',
        rating: 5,
        title: 'Excellent customer service',
        comment: 'They went above and beyond to solve my issue. Highly recommended!',
        createdAt: '2025-10-03T11:50:00Z',
        helpfulCount: 10,
        verifiedPurchase: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=200&fit=crop' }
        ]
      }
    ];
  };
  
  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Customer Reviews</h2>
      
      <ReviewSummary 
        ratings={summary.ratings} 
        totalReviews={summary.totalReviews} 
      />
      
      {error && (
        <div className="p-4 mb-4 bg-error/10 border border-error/20 rounded-md text-error text-sm">
          {error}
        </div>
      )}
      
      {reviews.length === 0 && !loading && !error ? (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={40} className="text-muted mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {reviews.map(review => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </div>
      )}
      
      {loading && (
        <div className="py-4 text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      
      {hasMore && !loading && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
