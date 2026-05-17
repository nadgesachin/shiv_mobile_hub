import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';

const EmptyState = ({
  icon = 'Package',
  title = 'No items found',
  description = 'There are no items to display at the moment',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      {/* Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <Icon name={icon} size={48} className="text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

// Predefined empty states
export const NoProductsFound = ({ onBrowseAll }) => (
  <EmptyState
    icon="ShoppingBag"
    title="No products found"
    description="We couldn't find any products matching your criteria. Try adjusting your filters or browse all products."
    actionLabel="Browse All Products"
    onAction={onBrowseAll}
  />
);

export const NoSearchResults = ({ searchQuery }) => (
  <EmptyState
    icon="Search"
    title="No results found"
    description={`We couldn't find anything matching "${searchQuery}". Try different keywords or browse our categories.`}
  />
);

export const EmptyCart = ({ onContinueShopping }) => (
  <EmptyState
    icon="ShoppingCart"
    title="Your cart is empty"
    description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
    actionLabel="Continue Shopping"
    onAction={onContinueShopping}
  />
);

export const NoReviews = () => (
  <EmptyState
    icon="MessageSquare"
    title="No reviews yet"
    description="This product hasn't been reviewed yet. Be the first to share your experience!"
  />
);

export const NoOrders = ({ onStartShopping }) => (
  <EmptyState
    icon="Package"
    title="No orders yet"
    description="You haven't placed any orders yet. Start shopping to see your order history here."
    actionLabel="Start Shopping"
    onAction={onStartShopping}
  />
);

export const ConnectionError = ({ onRetry }) => (
  <EmptyState
    icon="WifiOff"
    title="Connection Error"
    description="We're having trouble connecting to the server. Please check your internet connection and try again."
    actionLabel="Try Again"
    onAction={onRetry}
  />
);

export default EmptyState;
