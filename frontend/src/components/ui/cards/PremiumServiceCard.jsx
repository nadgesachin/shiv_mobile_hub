import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../AppIcon';

const PremiumServiceCard = ({ service, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-500 via-teal-500 to-blue-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-purple-500 via-indigo-500 to-blue-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-yellow-500 via-orange-500 to-red-500',
  ];

  const selectedGradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Floating Orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient}`}>
            <img
              src={service.image}
              alt={service.imageAlt || service.name}
              className="w-full h-full object-cover mix-blend-overlay opacity-50"
            />
          </div>
          
          {/* Icon Container */}
          <motion.div
            animate={{ 
              y: isHovered ? -10 : 0,
              rotate: isHovered ? 360 : 0
            }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
              <Icon 
                name={service.icon} 
                size={48} 
                className={`bg-gradient-to-br ${selectedGradient} bg-clip-text text-transparent`}
              />
            </div>
          </motion.div>
          
          {/* Popular Badge */}
          {service.popular && (
            <motion.div
              initial={{ rotate: -45, x: -100 }}
              animate={{ rotate: -45, x: 0 }}
              className="absolute top-8 -left-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-1 shadow-lg"
            >
              <span className="text-xs font-bold">POPULAR</span>
            </motion.div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          {/* Title with Gradient */}
          <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${selectedGradient} bg-clip-text text-transparent`}>
            {service.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description}
          </p>
          
          {/* Features with Animation */}
          <div className="space-y-2 mb-5">
            {service.features?.slice(0, 3).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Icon 
                    name="CheckCircle" 
                    size={16} 
                    className="text-green-500"
                  />
                </motion.div>
                <span className="text-sm text-gray-700">{feature}</span>
              </motion.div>
            ))}
            {service.features?.length > 3 && (
              <p className="text-xs text-gray-500 pl-6">
                +{service.features.length - 3} more features
              </p>
            )}
          </div>
          
          {/* CTA Button with Hover Effect */}
          <Link to={service.link}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full relative overflow-hidden rounded-2xl group/btn"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${selectedGradient}`} />
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
              <div className="relative px-6 py-3 flex items-center justify-center gap-2">
                <span className="text-white font-semibold">Explore Service</span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon name="ArrowRight" size={18} className="text-white" />
                </motion.div>
              </div>
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ x: '-200%' }}
                animate={{ x: isHovered ? '200%' : '-200%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </Link>
        </div>
        
        {/* Hover Border Glow */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${selectedGradient} opacity-0 group-hover:opacity-100 blur-xl -z-10 transition-opacity duration-500`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        />
      </div>
    </motion.div>
  );
};

export default PremiumServiceCard;
