import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    loadNotifications 
  } = useNotifications();
  
  // Load notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Navigate to target URL if provided
    if (notification.url) {
      navigate(notification.url);
    }
    
    setIsOpen(false);
  };
  
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
    return <Icon name={iconName || 'Bell'} size={16} />;
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
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative"
      >
        <Icon name="Bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-md shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 ${getIconClass(notification.type)}`}>
                        {getIcon(notification.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-border text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs w-full"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
