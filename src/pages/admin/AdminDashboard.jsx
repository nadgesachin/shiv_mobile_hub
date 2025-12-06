import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Admin navigation items
  const adminNavItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: 'Package',
      description: 'Manage products'
    },
    {
      name: 'Sections',
      path: '/admin/sections',
      icon: 'Grid3x3',
      description: 'Homepage sections'
    },
    {
      name: 'Services',
      path: '/admin/services',
      icon: 'Wrench',
      description: 'Manage services'
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: 'Users',
      description: 'User management'
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: 'ShoppingCart',
      description: 'Order management'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: 'BarChart3',
      description: 'Reports and insights'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: 'Settings',
      description: 'System settings'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border min-h-screen transition-all duration-300`}>
          <div className="p-4">
            {/* Sidebar Toggle */}
            <div className="flex items-center justify-between mb-6">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={16} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground">Management Console</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={16} />
              </Button>
            </div>

            {/* User Info */}
            {sidebarOpen && (
              <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                    isActiveRoute(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {sidebarOpen && (
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            {sidebarOpen && (
              <div className="mt-8 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {adminNavItems.find(item => isActiveRoute(item.path))?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {adminNavItems.find(item => isActiveRoute(item.path))?.description}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="Bell" size={16} className="mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  View Site
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
