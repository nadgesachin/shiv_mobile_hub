import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Icon from '../AppIcon';
import Button from './Button';
import { FadeIn, SlideDown, ScaleIn, Interactive, AnimatedBadge } from './animations';

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
      
      // Handle navbar transparency
      setIsScrolled(currentScrollY > 20);
      
      // Handle hiding on scroll down
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
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ 
          y: isHidden ? -100 : 0,
          opacity: 1
        }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        className={`fixed top-0 left-0 right-0 z-50 ${isScrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-navbar border-b border-white/20'
          : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Interactive>
              <Link
                to="/homepage"
                className="flex items-center space-x-3 group"
                aria-label="Shiv Mobile Hub Home"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-primary-light to-accent-light rounded-xl flex items-center justify-center shadow-colored transition-all duration-300 group-hover:shadow-xl">
                  <Icon
                    name="Smartphone"
                    size={24}
                    color="white"
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-headline font-bold text-foreground">
                    Shiv Mobile Hub
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Your Digital Neighborhood Partner
                  </span>
                </div>
              </Link>
            </Interactive>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex relative mx-4 flex-1 max-w-md">
              <motion.div 
                className={`flex items-center w-full relative ${isSearchFocused 
                  ? 'bg-white shadow-md rounded-lg' 
                  : 'bg-muted rounded-md'
                }`}
                animate={{ 
                  width: isSearchFocused ? '110%' : '100%',
                  boxShadow: isSearchFocused ? '0 4px 20px rgba(15, 23, 42, 0.08)' : 'none'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Icon 
                  name="Search" 
                  size={18} 
                  className="ml-3 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search for products, services..."
                  className="w-full bg-transparent border-none outline-none py-2 px-3 text-sm focus:ring-0"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Interactive key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${isActivePath(item.path)
                      ? 'bg-gradient-primary text-white font-medium shadow-colored'
                      : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </Interactive>
              ))}
            </nav>

            {/* Action Buttons (Desktop) */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated() ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <Interactive>
                    <NotificationDropdown />
                  </Interactive>
                  
                  {/* Messages */}
                  <Interactive>
                    <Link to="/chat" className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-full p-2"
                      >
                        <Icon name="MessageCircle" size={18} />
                        <AnimatedBadge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold shadow-md">
                          3
                        </AnimatedBadge>
                      </Button>
                    </Link>
                  </Interactive>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <Interactive>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 rounded-full px-4 border border-gray-200 shadow-sm bg-white"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                      >
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-sm">
                            <Icon name="User" size={16} />
                          </div>
                        )}
                        <span className="font-medium">{user?.name?.split(' ')[0] || 'Account'}</span>
                        <Icon name={showUserMenu ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground" />
                      </Button>
                    </Interactive>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <FadeIn
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-light/5 to-accent-light/5">
                            <p className="font-semibold text-foreground truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            {isAdmin() && (
                              <Interactive>
                                <Link 
                                  to="/admin" 
                                  className="flex items-center px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <Icon name="LayoutDashboard" size={16} className="mr-2 text-secondary" />
                                  Admin Dashboard
                                </Link>
                              </Interactive>
                            )}
                            <Interactive>
                              <Link 
                                to="/chat" 
                                className="flex items-center px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <Icon name="MessageCircle" size={16} className="mr-2 text-accent" />
                                Messages
                                <span className="ml-auto bg-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white">3</span>
                              </Link>
                            </Interactive>
                            <Interactive>
                              <Link 
                                to="/notifications" 
                                className="flex items-center px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <Icon name="Bell" size={16} className="mr-2 text-secondary" />
                                Notifications
                              </Link>
                            </Interactive>
                          </div>
                          <div className="border-t border-gray-100 py-1">
                            <Interactive>
                              <button
                                onClick={handleLogout}
                                className="flex w-full items-center text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Icon name="LogOut" size={16} className="mr-2" />
                                Logout
                              </button>
                            </Interactive>
                          </div>
                        </FadeIn>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Interactive>
                    <Link to="/login">
                      <Button 
                        variant="outline"
                        className="rounded-full shadow-sm hover:shadow-md px-6 py-2 border border-gray-200"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </Interactive>
                  <Interactive>
                    <Link to="/register">
                      <Button 
                        className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-sm hover:shadow-colored transition-all px-6 py-2"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </Interactive>
                </div>
              )}
              <Interactive>
                <Button 
                  variant="default" 
                  iconName="Phone" 
                  iconPosition="left"
                  className="rounded-full bg-gradient-to-r from-accent-dark to-accent text-white shadow-sm hover:shadow-md transition-all px-6"
                >
                  Book Service
                </Button>
              </Interactive>
            </div>

            {/* Mobile Menu Button */}
            <Interactive>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-full w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
              </button>
            </Interactive>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Search Bar - Fixed under header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 px-4 py-2 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="relative flex items-center bg-muted rounded-full">
          <Icon name="Search" size={16} className="ml-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, services..."
            className="w-full bg-transparent border-none outline-none py-2 pl-2 pr-3 text-sm focus:ring-0"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-xl lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-sm">
                    <Icon name="Smartphone" size={22} color="white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Shiv Mobile Hub</p>
                    <p className="text-xs text-muted-foreground">Your Digital Partner</p>
                  </div>
                </div>
                <Interactive>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-muted"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </Interactive>
              </div>
              
              <div className="h-full overflow-y-auto py-4 px-6 pb-32">
                <StaggerContainer staggerDelay={0.05} className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Interactive key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActivePath(item.path)
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                          : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name={item.icon} size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </Interactive>
                  ))}

                  <div className="pt-6 mt-2 border-t border-gray-100 space-y-3">
                    {isAuthenticated() ? (
                      <>
                        <Interactive>
                          <Link to="/chat" className="block">
                            <Button
                              variant="outline"
                              fullWidth
                              iconName="MessageCircle"
                              iconPosition="left"
                              className="rounded-xl py-3 justify-start border-gray-200 text-secondary shadow-sm"
                            >
                              Messages
                              <span className="ml-auto bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
                            </Button>
                          </Link>
                        </Interactive>
                        <Interactive>
                          <Link to="/notifications" className="block">
                            <Button
                              variant="outline"
                              fullWidth
                              iconName="Bell"
                              iconPosition="left"
                              className="rounded-xl py-3 justify-start border-gray-200 text-secondary shadow-sm"
                            >
                              Notifications
                            </Button>
                          </Link>
                        </Interactive>
                        {isAdmin() && (
                          <Interactive>
                            <Link to="/admin" className="block">
                              <Button
                                variant="outline"
                                fullWidth
                                iconName="LayoutDashboard"
                                iconPosition="left"
                                className="rounded-xl py-3 justify-start border-gray-200 text-secondary shadow-sm"
                              >
                                Admin Dashboard
                              </Button>
                            </Link>
                          </Interactive>
                        )}
                        <Interactive>
                          <Button
                            variant="outline"
                            fullWidth
                            iconName="LogOut"
                            iconPosition="left"
                            onClick={handleLogout}
                            className="rounded-xl py-3 justify-start border-gray-200 text-red-600 shadow-sm"
                          >
                            Logout
                          </Button>
                        </Interactive>
                      </>
                    ) : (
                      <>
                        <Interactive>
                          <Link to="/login" className="block">
                            <Button
                              variant="outline"
                              fullWidth
                              iconName="LogIn"
                              iconPosition="left"
                              className="rounded-xl py-3 justify-start border-gray-200 shadow-sm"
                            >
                              Sign In
                            </Button>
                          </Link>
                        </Interactive>
                        <Interactive>
                          <Link to="/register" className="block">
                            <Button
                              variant="default"
                              fullWidth
                              iconName="UserPlus"
                              iconPosition="left"
                              className="rounded-xl py-3 justify-start bg-gradient-to-r from-primary to-secondary text-white shadow-colored"
                            >
                              Sign Up
                            </Button>
                          </Link>
                        </Interactive>
                      </>
                    )}
                    <Interactive>
                      <Button
                        variant="default"
                        fullWidth
                        iconName="Phone"
                        iconPosition="left"
                        className="rounded-xl py-3 justify-start bg-gradient-to-r from-accent-dark to-accent text-white shadow-colored mt-4"
                      >
                        Book Service
                      </Button>
                    </Interactive>
                  </div>
                </StaggerContainer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer to compensate for fixed header */}
      <div className="h-16 lg:h-20" />
      {/* Extra space for mobile search bar */}
      <div className="h-14 lg:hidden" />
    </>
  );
};

export default Header;