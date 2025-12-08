import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-medium'
            : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              to="/homepage"
              className="flex items-center space-x-3 group"
              aria-label="Shiv Mobile Hub Home"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
                <Icon
                  name="Smartphone"
                  size={24}
                  color="var(--color-primary)"
                  className="transition-smooth group-hover:scale-110"
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

            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated() ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <NotificationDropdown />
                  
                  {/* Messages */}
                  <Link to="/chat" className="relative">
                    <Button variant="ghost" size="sm">
                      <Icon name="MessageCircle" size={18} />
                    </Button>
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={16} />
                      )}
                      <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                      <Icon name={showUserMenu ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    </Button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-md z-50">
                        <div className="p-3 border-b border-border">
                          <p className="font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          {isAdmin() && (
                            <Link 
                              to="/admin" 
                              className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Icon name="LayoutDashboard" size={14} className="inline mr-2" />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link 
                            to="/chat" 
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon name="MessageCircle" size={14} className="inline mr-2" />
                            Messages
                          </Link>
                          <Link 
                            to="/notifications" 
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon name="Bell" size={14} className="inline mr-2" />
                            Notifications
                          </Link>
                        </div>
                        <div className="border-t border-border py-1">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Icon name="LogOut" size={14} className="inline mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
              <Button variant="default" iconName="Phone" iconPosition="left">
                Book Service
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-smooth"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-16 right-0 bottom-0 w-full max-w-sm bg-card shadow-strong animate-slide-in-right"
            onClick={(e) => e?.stopPropagation()}
          >
            <nav className="flex flex-col p-6 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-smooth touch-target ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {isAuthenticated() ? (
                  <>
                    <Link to="/chat" className="block">
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="MessageCircle"
                        iconPosition="left"
                      >
                        Messages
                      </Button>
                    </Link>
                    <Link to="/notifications" className="block">
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="Bell"
                        iconPosition="left"
                      >
                        Notifications
                      </Button>
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin" className="block">
                        <Button
                          variant="outline"
                          fullWidth
                          iconName="LayoutDashboard"
                          iconPosition="left"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="LogOut"
                      iconPosition="left"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block">
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="LogIn"
                        iconPosition="left"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button
                        variant="default"
                        fullWidth
                        iconName="UserPlus"
                        iconPosition="left"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  variant="default"
                  fullWidth
                  iconName="Phone"
                  iconPosition="left"
                >
                  Book Service
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;