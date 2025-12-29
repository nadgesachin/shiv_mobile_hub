import React from 'react';
import { motion } from 'framer-motion';

/**
 * A component that adds swipe gestures for mobile interactions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside
 * @param {Function} props.onSwipeLeft - Callback when swiping left
 * @param {Function} props.onSwipeRight - Callback when swiping right
 * @param {Number} props.threshold - Swipe threshold in pixels (default: 50)
 * @param {Object} props.constraints - Drag constraints (default: none)
 * @param {Boolean} props.dragElastic - Elasticity of the drag (default: 0.5)
 * @param {Object} props.style - Additional style properties
 * @param {String} props.className - Additional CSS classes
 */
const MobileSwipe = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  constraints = {},
  dragElastic = 0.5,
  style = {},
  className = '',
  ...rest
}) => {
  // Handle drag end
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipeThreshold = threshold;
    const swipeVelocity = 0.3;
    
    if (offset.x < -swipeThreshold && velocity.x < -swipeVelocity) {
      onSwipeLeft?.();
    } else if (offset.x > swipeThreshold && velocity.x > swipeVelocity) {
      onSwipeRight?.();
    }
  };

  return (
    <motion.div
      className={className}
      style={style}
      drag="x"
      dragConstraints={constraints}
      dragElastic={dragElastic}
      onDragEnd={handleDragEnd}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MobileSwipe;

/**
 * Example usage:
 * 
 * <MobileSwipe
 *   onSwipeLeft={() => handleNextSlide()}
 *   onSwipeRight={() => handlePrevSlide()}
 *   className="w-full touch-pan-y"
 * >
 *   <div className="carousel-content">
 *     Slide content here
 *   </div>
 * </MobileSwipe>
 */
