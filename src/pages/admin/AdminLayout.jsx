import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { path: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/products', label: 'Products', icon: 'Package' },
    { path: '/admin/categories', label: 'Categories', icon: 'Folder' },
    { path: '/admin/sections', label: 'Sections', icon: 'Grid3x3' },
    { path: '/admin/services', label: 'Services', icon: 'Wrench' },
    { path: '/admin/users', label: 'Users', icon: 'Users' },
    { path: '/admin/pages', label: 'Pages', icon: 'FileText' },
    { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        </div>
        <nav className="p-2 space-y-1">
          {menu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          />
          <span className="text-sm text-muted-foreground">Admin</span>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            Exit Admin
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;