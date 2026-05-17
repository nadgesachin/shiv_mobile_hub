import React from 'react';

// Base Skeleton component with shimmer effect
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-xl border border-gray-100 p-4">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-square mb-4" />
      
      {/* Title skeleton */}
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2 mb-3" />
      
      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-12 h-4" />
      </div>
      
      {/* Price skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-16 h-4" />
      </div>
      
      {/* Button skeleton */}
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  );
};

// Product Section Skeleton
export const ProductSectionSkeleton = ({ count = 4 }) => {
  return (
    <div className="mb-8">
      {/* Section title skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-48 h-8" />
        <div className="flex gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
      
      {/* Product cards skeleton */}
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: count }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

// Category Card Skeleton
export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <Skeleton className="w-full h-32 mb-3" />
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
};

// Product Detail Skeleton
export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image section */}
        <div>
          <Skeleton className="w-full aspect-square mb-4" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-square" />
            ))}
          </div>
        </div>
        
        {/* Details section */}
        <div>
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-1/2 h-6 mb-6" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4 mb-2" />
          <Skeleton className="w-4/5 h-4 mb-6" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="w-32 h-12" />
            <Skeleton className="w-32 h-12" />
          </div>
          <Skeleton className="w-full h-64" />
        </div>
      </div>
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
      <Skeleton variant="circular" className="w-16 h-16" />
      <div className="flex-1">
        <Skeleton variant="text" className="w-3/4 mb-2" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <Skeleton className="w-24 h-8" />
    </div>
  );
};

// Banner Skeleton
export const BannerSkeleton = () => {
  return (
    <Skeleton className="w-full h-64 sm:h-96 rounded-xl" />
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton variant="text" />
        </td>
      ))}
    </tr>
  );
};

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default Skeleton;
