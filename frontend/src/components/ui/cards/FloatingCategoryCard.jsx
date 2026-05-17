import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../AppIcon';

const FloatingCategoryCard = ({ category, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    { bg: 'from-violet-400 to-purple-600', shadow: 'shadow-purple-500/50' },
    { bg: 'from-cyan-400 to-blue-600', shadow: 'shadow-blue-500/50' },
    { bg: 'from-pink-400 to-rose-600', shadow: 'shadow-rose-500/50' },
    { bg: 'from-amber-400 to-orange-600', shadow: 'shadow-orange-500/50' },
    { bg: 'from-emerald-400 to-green-600', shadow: 'shadow-green-500/50' },
    { bg: 'from-indigo-400 to-blue-600', shadow: 'shadow-indigo-500/50' },
  ];

  const style = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 150
      }}
      whileHover={{ y: -15, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={category.link} className="block">
        <div className="relative group">
          {/* Floating Card */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: isHovered ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0.5 }
            }}
            className={`relative bg-white rounded-3xl p-6 shadow-2xl ${style.shadow} hover:shadow-3xl transition-all duration-500`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Animated Circles */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${style.bg} rounded-full blur-xl opacity-30`}
            />
            
            {/* Icon Container */}
            <div className="relative mb-4">
              <motion.div
                animate={{ 
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.6 }}
                className={`w-20 h-20 mx-auto bg-gradient-to-br ${style.bg} rounded-2xl shadow-lg flex items-center justify-center`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 object-contain filter brightness-0 invert"
                  />
                ) : (
                  <Icon name={category.icon || 'Grid'} size={32} className="text-white" />
                )}
              </motion.div>
              
              {/* Pulse Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br ${style.bg} rounded-2xl`}
              />
            </div>
            
            {/* Content */}
            <div className="relative text-center">
              <h3 className={`font-bold text-lg mb-2 bg-gradient-to-r ${style.bg} bg-clip-text text-transparent`}>
                {category.name}
              </h3>
              
              {category.count && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600"
                >
                  {category.count} Products
                </motion.p>
              )}
            </div>
            
            {/* Hover Indicator */}
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            >
              <Icon name="ChevronDown" size={16} className={`bg-gradient-to-r ${style.bg} bg-clip-text text-transparent animate-bounce`} />
            </motion.div>
          </motion.div>
          
          {/* Shadow Effect */}
          <div className={`absolute inset-x-4 bottom-0 h-16 bg-gradient-to-br ${style.bg} opacity-10 blur-2xl transform translate-y-8 scale-75`} />
        </div>
      </Link>
    </motion.div>
  );
};

export default FloatingCategoryCard;
