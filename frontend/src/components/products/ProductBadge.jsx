import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';

const ProductBadge = ({ 
  type, 
  text, 
  className = '',
  animate = true 
}) => {
  const badges = {
    new: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'text-white',
      icon: 'Sparkles',
      label: text || 'New',
    },
    sale: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-500',
      text: 'text-white',
      icon: 'Tag',
      label: text || 'Sale',
    },
    bestseller: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      text: 'text-white',
      icon: 'TrendingUp',
      label: text || 'Bestseller',
    },
    trending: {
      bg: 'bg-gradient-to-r from-orange-500 to-purple-500',
      text: 'text-white',
      icon: 'Flame',
      label: text || 'Trending',
    },
    limited: {
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      text: 'text-white',
      icon: 'Zap',
      label: text || 'Limited Stock',
    },
    featured: {
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      text: 'text-white',
      icon: 'Star',
      label: text || 'Featured',
    },
    discount: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'text-white',
      icon: 'Percent',
      label: text,
    },
  };

  const badge = badges[type] || badges.new;

  const BadgeContent = () => (
    <div
      className={`
        ${badge.bg} ${badge.text} 
        px-3 py-1 rounded-full text-xs font-bold 
        shadow-md flex items-center gap-1.5
        ${className}
      `}
    >
      <Icon name={badge.icon} size={12} />
      <span>{badge.label}</span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
};

// Badge container for multiple badges
export const ProductBadges = ({ badges = [], position = 'top-left', className = '' }) => {
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-10 flex flex-col gap-2 ${className}`}>
      {badges.map((badge, idx) => (
        <ProductBadge 
          key={idx} 
          type={badge.type} 
          text={badge.text}
          animate={true}
        />
      ))}
    </div>
  );
};

export default ProductBadge;
