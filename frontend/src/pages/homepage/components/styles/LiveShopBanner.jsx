import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import { Interactive } from '../../../../components/ui/animations';

const LiveShopBanner = () => {
  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden p-8 my-8 border border-primary/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center lg:text-left">
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium">LIVE NOW</span>
          </motion.div>
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Exclusive Live Shopping Event
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Join us for amazing deals, product demos, and Q&A sessions. Don't miss out!
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        >
          <Interactive>
            <Link to="/live-shopping">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                iconName="PlayCircle"
                iconPosition="left"
              >
                Join the Event
              </Button>
            </Link>
          </Interactive>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveShopBanner;

