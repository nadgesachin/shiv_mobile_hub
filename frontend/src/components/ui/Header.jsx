import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Icon from '../AppIcon';
import Button from './Button';
import { FadeIn, Interactive, AnimatedBadge } from './animations';
import { StaggerContainer } from './animations';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  const navigationItems = [
    { path: '/homepage', label: 'Home', icon: 'Home' },
    { path: '/services-hub', label: 'Services', icon: 'Wrench' },
    { path: '/products-catalog', label: 'Products', icon: 'ShoppingBag' },
    { path: '/csc-portal', label: 'CSC Portal', icon: 'FileText' },
    { path: '/contact', label: 'Contact', icon: 'Phone' },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <>
      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 ${isScrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-navbar border-b border-white/20'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Interactive>
              <Link to="/homepage" className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-orange-purple-yellow rounded-xl flex items-center justify-center shadow-colored">
                  <Icon name="Smartphone" size={24} color="white" />
                </div>
                <span className="text-lg lg:text-xl font-bold">Shiv Mobile Hub</span>
              </Link>
            </Interactive>

            {/* Desktop Search */}
            <div className="hidden lg:flex relative mx-4 flex-1 max-w-md">
              <motion.div
                className={`flex items-center w-full ${isSearchFocused ? 'bg-white rounded-lg' : 'bg-muted rounded-md'
                  }`}
                animate={{ width: isSearchFocused ? '110%' : '100%' }}
              >
                <Icon name="Search" size={18} className="ml-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for products, services..."
                  className="w-full bg-transparent py-2 px-3 
        border-none outline-none ring-0 
        focus:border-none focus:outline-none focus:ring-0 
        text-sm"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md transition ${isActivePath(item.path)
                    ? 'bg-gradient-orange-purple text-white'
                    : 'hover:bg-orange-50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ===== HEADER SPACER ===== */}
      <div className="h-16 lg:h-20" />

      {/* ================= MOBILE SEARCH (NOT STICKY) ================= */}
      <div className="lg:hidden px-4 py-2 bg-white shadow-sm bg-gradient-to-r from-orange-500/10 to-purple-500/10">
        <div className="flex items-center bg-muted rounded-full">
          <Icon name="Search" size={16} className="ml-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, services..."
            className="w-full bg-transparent py-2 px-3 
             border-none outline-none ring-0 
             focus:border-none focus:outline-none focus:ring-0 
             text-sm"
          />

        </div>
      </div>


      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-xl"
            >
              <div className="p-4 border-b font-bold">Menu</div>
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-3 rounded-lg hover:bg-orange-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
