import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import ProductEnquiryModal from '../../components/products/ProductEnquiryModal';
import Header from '../../components/ui/Header';
import ReviewsSection from '../../components/reviews/ReviewsSection';
import { ProductSEO } from '../../components/SEO';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { ProductDetailSkeleton } from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(id, true);
      
      if (response.success) {
        const productData = response.data?.product;
        setProduct(productData);
        setError(null);
        
        // Add to recently viewed
        if (productData) {
          addToRecentlyViewed(productData);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Shiv Mobile Hub`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
    }
  };

  const calculateDiscount = (originalPrice, sellingPrice) => {
    if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) {
      return 0;
    }
    return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <ProductDetailSkeleton />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
          <EmptyState
            icon="AlertCircle"
            title="Product Not Found"
            description={error || "The product you're looking for doesn't exist or has been removed."}
            actionLabel="Back to Products"
            onAction={() => navigate('/products-catalog')}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ProductSEO product={product} />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
            <Icon name="ChevronRight" size={16} className="mx-2 text-gray-400" />
            <Link to="/products-catalog" className="text-gray-600 hover:text-primary">Products</Link>
            <Icon name="ChevronRight" size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 group">
                  <Image
                    src={product.images?.[selectedImage]?.url || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-sm font-bold rounded-full bg-emerald-100 text-emerald-700">
                        {calculateDiscount(product.originalPrice, product.price)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Share Button - Opens Enquiry Modal */}
                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
                  >
                    <Icon name="Share2" size={18} className="text-gray-700" />
                  </button>

                  {/* Left/Right Navigation Buttons */}
                  {product.images && product.images.length > 1 && (
                    <>
                      {/* Left Button */}
                      <button
                        onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : product.images.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="ChevronLeft" size={20} className="text-gray-700" />
                      </button>

                      {/* Right Button */}
                      <button
                        onClick={() => setSelectedImage(prev => (prev < product.images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="ChevronRight" size={20} className="text-gray-700" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImage + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Images - Horizontal Scrollable */}
                {product.images && product.images.length > 1 && (
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={18}
                        className={`${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {product.rating || '4.5'} ({product.reviewCount || '0'} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{product.originalPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-emerald-600 font-semibold">
                          Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    <span className="text-emerald-600 font-medium">In Stock</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{spec.name}</span>
                          <span className="font-medium text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Icon name="CheckCircle2" size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onClick={() => setShowEnquiryModal(true)}
                  >
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Contact to Buy
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowEnquiryModal(true)}
                  >
                    <Icon name="Share2" size={20} />
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="Truck" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Free Delivery</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="Shield" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Warranty Available</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon name="RefreshCw" size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-xs text-gray-600">Easy Returns</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReviewsSection productId={id} />
          </motion.div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <ProductEnquiryModal
          product={product}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ProductDetailPage;
