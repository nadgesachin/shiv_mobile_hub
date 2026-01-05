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
              
              {/* User Menu for Authenticated Users */}
              {isAuthenticated() ? (
                <div style={{ marginTop: '9px', display: 'flex' }}>
                  {/* Notifications */}
                  <NotificationDropdown />
                  
                  {/* User Profile Dropdown */}
                  <div className="relative  ">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-orange-purple flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-sm font-medium hidden xl:block">{user?.name || 'User'}</span>
                      <Icon name="ChevronDown" size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-semibold">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          
                          {isAdmin() && (
                            <Link
                              to="/admin/dashboard"
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-sm"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Icon name="LayoutDashboard" size={16} />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                          
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon name="User" size={16} />
                            <span>My Profile</span>
                          </Link>
                          
                          <Link
                            to="/chat"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon name="MessageCircle" size={16} />
                            <span>Messages</span>
                          </Link>
                          
                          <div className="border-t my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm w-full text-left"
                          >
                            <Icon name="LogOut" size={16} />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="ml-4"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="ml-2"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
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
                {isAuthenticated() ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-orange-purple flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin() && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-orange-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon name="LayoutDashboard" size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-orange-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name="User" size={18} />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      to="/chat"
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-orange-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name="MessageCircle" size={18} />
                      <span>Messages</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-left mt-2"
                    >
                      <Icon name="LogOut" size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="default"
                      className="w-full mt-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/signup');
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
