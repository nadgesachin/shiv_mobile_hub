import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const { 
    notifications, 
    loading, 
    error, 
    loadNotifications, 
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();
  
  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Filter notifications by type
  const getFilteredNotifications = () => {
    if (filter === 'all') {
      return notifications;
    }
    
    if (filter === 'unread') {
      return notifications.filter(notification => !notification.read);
    }
    
    return notifications.filter(notification => notification.type === filter);
  };
  
  // Get notification type counts
  const getTypeCounts = () => {
    const counts = {
      all: notifications.length,
      unread: 0,
      message: 0,
      order: 0,
      system: 0,
      product: 0,
      service: 0,
      appointment: 0
    };
    
    notifications.forEach(notification => {
      if (!notification.read) counts.unread++;
      if (counts[notification.type] !== undefined) {
        counts[notification.type]++;
      }
    });
    
    return counts;
  };
  
  // Get counts
  const counts = getTypeCounts();
  
  // Format date relative to current time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get icon component by name
  const getIcon = (iconName) => {
    return <Icon name={iconName || 'Bell'} size={18} />;
  };
  
  // Get icon color based on notification type
  const getIconClass = (type) => {
    switch (type) {
      case 'message':
        return 'text-blue-500';
      case 'order':
        return 'text-green-500';
      case 'system':
        return 'text-purple-500';
      case 'product':
        return 'text-amber-500';
      case 'service':
        return 'text-cyan-500';
      case 'appointment':
        return 'text-pink-500';
      default:
        return 'text-muted-foreground';
    }
  };
  
  // Filter options
  const filterOptions = [
    { id: 'all', name: 'All Notifications', icon: 'Bell', count: counts.all },
    { id: 'unread', name: 'Unread', icon: 'CircleDot', count: counts.unread },
    { id: 'message', name: 'Messages', icon: 'MessageCircle', count: counts.message },
    { id: 'order', name: 'Orders', icon: 'ShoppingBag', count: counts.order },
    { id: 'system', name: 'System', icon: 'Info', count: counts.system },
    { id: 'product', name: 'Products', icon: 'Package', count: counts.product },
    { id: 'service', name: 'Services', icon: 'Wrench', count: counts.service },
    { id: 'appointment', name: 'Appointments', icon: 'Calendar', count: counts.appointment }
  ];
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            
            {counts.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={loading}
              >
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-3">Filter</h3>
                <div className="space-y-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFilter(option.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                        filter === option.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={option.icon} size={16} />
                        <span>{option.name}</span>
                      </div>
                      {option.count > 0 && (
                        <span className="bg-background/30 rounded-full px-2 py-0.5 text-xs">
                          {option.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="md:col-span-3">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Icon name="BellOff" size={48} className="text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No notifications</h2>
                    <p className="text-center text-muted-foreground">
                      You don't have any notifications yet. Check back later for updates.
                    </p>
                  </div>
                ) : getFilteredNotifications().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No matching notifications</h2>
                    <p className="text-center text-muted-foreground">
                      No notifications match your current filter.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setFilter('all')}
                    >
                      View all notifications
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {getFilteredNotifications().map((notification) => (
                      <div 
                        key={notification._id} 
                        className={`p-4 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 ${getIconClass(notification.type)}`}>
                            {getIcon(notification.icon)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap mt-1 sm:mt-0 sm:ml-4">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            
                            <p className="text-muted-foreground mb-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              {notification.url ? (
                                <Link
                                  to={notification.url}
                                  onClick={() => !notification.read && markAsRead(notification._id)}
                                  className="text-sm text-primary hover:underline"
                                >
                                  View details
                                </Link>
                              ) : (
                                <span></span>
                              )}
                              
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification._id)}
                                    aria-label="Mark as read"
                                  >
                                    <Icon name="CheckCircle" size={16} />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification._id)}
                                  aria-label="Delete notification"
                                >
                                  <Icon name="Trash" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
