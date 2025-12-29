import React from 'react';
import { motion } from 'framer-motion';

// Fade In Animation Component
export const FadeIn = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = "",
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide Up Animation Component
export const SlideUp = ({ 
  children, 
  duration = 0.5, 
  delay = 0,
  distance = 20,
  className = "", 
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide Down Animation Component
export const SlideDown = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  distance = 20,
  className = "",
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, y: -distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide Left Animation Component
export const SlideRight = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  distance = 20,
  className = "",
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -distance }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide Right Animation Component
export const SlideLeft = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  distance = 20,
  className = "",
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, x: distance }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Scale In Animation Component
export const ScaleIn = ({ 
  children, 
  duration = 0.5, 
  delay = 0,
  className = "", 
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Floating Animation Component
export const Float = ({ 
  children, 
  duration = 3,
  delay = 0,
  distance = 10, 
  className = "",
  ...props 
}) => (
  <motion.div
    animate={{ y: [-distance/2, distance/2, -distance/2] }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      repeatType: "loop",
      ease: "easeInOut",
      delay
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Staggered Children Animation Container
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  delay = 0,
  className = "", 
  ...props 
}) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <div className={className} {...props}>
      {childrenArray.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: delay + (i * staggerDelay),
            duration: 0.5
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// Hover Scale Animation Component
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  duration = 0.2,
  className = "", 
  ...props 
}) => (
  <motion.div
    whileHover={{ scale }}
    transition={{ duration }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Tap Scale Animation Component
export const TapScale = ({ 
  children, 
  scale = 0.95, 
  duration = 0.2,
  className = "", 
  ...props 
}) => (
  <motion.div
    whileTap={{ scale }}
    transition={{ duration }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover + Tap Animation Component (Combined for efficiency)
export const Interactive = ({ 
  children, 
  hoverScale = 1.05,
  tapScale = 0.95,
  duration = 0.2,
  className = "", 
  ...props 
}) => (
  <motion.div
    whileHover={{ scale: hoverScale }}
    whileTap={{ scale: tapScale }}
    transition={{ duration }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Attention Pulse Animation Component
export const Pulse = ({ 
  children, 
  duration = 2,
  scale = 1.05,
  className = "", 
  ...props 
}) => (
  <motion.div
    animate={{ scale: [1, scale, 1] }}
    transition={{ 
      duration, 
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut" 
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Badge Notification Animation
export const AnimatedBadge = ({ 
  children, 
  initial = true,
  className = "", 
  ...props 
}) => (
  <motion.div
    initial={initial ? { scale: 0 } : false}
    animate={{ scale: 1 }}
    transition={{ 
      type: "spring", 
      stiffness: 500,
      damping: 15
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Shimmer Loading Effect
export const ShimmerLoader = ({ 
  width = "100%", 
  height = "20px",
  borderRadius = "4px",
  className = "", 
  ...props 
}) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%] ${className}`}
    animate={{ backgroundPosition: ["100% 0%", "0% 0%"] }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity,
      repeatType: "mirror",
      ease: "linear" 
    }}
    style={{ 
      width, 
      height,
      borderRadius
    }}
    {...props}
  />
);

// Scroll Triggered Animation
export const ScrollReveal = ({ 
  children,
  animation = "fade", // "fade", "slideUp", "slideDown", "slideLeft", "slideRight", "scale"
  threshold = 0.1,
  duration = 0.5,
  className = "",
  ...props 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "slideUp" ? 50 : animation === "slideDown" ? -50 : 0,
      x: animation === "slideLeft" ? 50 : animation === "slideRight" ? -50 : 0,
      scale: animation === "scale" ? 0.9 : 1
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold }}
      transition={{ duration }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Gradient Text Animation Component
export const GradientText = ({ 
  children, 
  duration = 8,
  from = "from-secondary",
  via = "via-accent",
  to = "to-primary",
  className = "", 
  ...props 
}) => (
  <motion.span
    className={`bg-gradient-to-r ${from} ${via} ${to} inline-block text-transparent bg-clip-text bg-[length:200%_auto] ${className}`}
    animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
    transition={{ 
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear" 
    }}
    {...props}
  >
    {children}
  </motion.span>
);

// Glassmorphism Card with Animation
export const GlassCard = ({ 
  children, 
  duration = 0.5,
  blur = 10,
  opacity = 0.7,
  className = "", 
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0, backdropFilter: `blur(0px)` }}
    animate={{ opacity: 1, backdropFilter: `blur(${blur}px)` }}
    transition={{ duration }}
    className={`bg-white/70 backdrop-blur border border-white/20 ${className}`}
    style={{ backdropFilter: `blur(${blur}px)` }}
    {...props}
  >
    {children}
  </motion.div>
);
