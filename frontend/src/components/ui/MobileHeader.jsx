import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const MobileHeader = () => {
  const { user, cartItemCount } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products-catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
      initial={{ y: 0 }}
      animate={{ 
        y: 0,
        height: isScrolled ? '60px' : '70px',
      }}
    >
      <div className="px-3 py-2 flex flex-col">
        {/* Top row with logo and cart */}
        <div className="flex items-center justify-between mb-1.5">
          <Link to="/homepage" className="flex items-center">
            <Icon name="Smartphone" size={20} className="text-primary mr-1.5" />
            <span className="font-bold text-sm">Shiv Mobile</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link to="/wishlist" className="relative">
              <Icon name="Heart" size={20} className="text-gray-700" />
            </Link>
            <Link to="/cart" className="relative">
              <Icon name="ShoppingBag" size={20} className="text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to={user ? '/profile' : '/login'} className="relative">
              <Icon name={user ? 'User' : 'LogIn'} size={20} className="text-gray-700" />
            </Link>
          </div>
        </div>
        
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search mobiles, brands, accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm rounded-full bg-gray-100 border-0 focus:ring-1 focus:ring-primary"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </form>

        {/* Offer strip - only shown when not scrolled */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              className="bg-gradient-to-r from-secondary/10 to-accent/10 mt-1.5 py-1 px-2 rounded-md text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
                {/* <span className="text-xs font-medium">
                  <span className="text-secondary">SALE:</span> Get 10% off on all mobile accessories!
                </span> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default MobileHeader;
