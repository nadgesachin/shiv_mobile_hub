import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false
      };
      
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
      
    case NOTIFICATION_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
      
    case NOTIFICATION_ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };
      
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };
      
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  const hasLoadedRef = useRef(false);
  
  // Load notifications once when user is authenticated
  useEffect(() => {
    if (isAuthenticated() && user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      
      // Load notifications and unread count
      loadNotifications();
      loadUnreadCount();
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    
    // Reset on logout
    if (!isAuthenticated() || !user) {
      hasLoadedRef.current = false;
    }
  }, [user, isAuthenticated]);
  
  // Load notifications
  const loadNotifications = async () => {
    if (!isAuthenticated()) return;
    
    dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await apiService.request('/notifications');
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: response.data
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load notifications'
      });
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!isAuthenticated()) return;
    
    try {
      await apiService.request(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_NOTIFICATION_READ,
        payload: notificationId
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to mark notification as read'
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuthenticated()) return;
    
    try {
      await apiService.request('/notifications/read-all', {
        method: 'PUT'
      });
      
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to mark all notifications as read'
      });
    }
  };
  
  // Delete notification
  const deleteNotification = async (notificationId) => {
    if (!isAuthenticated()) return;
    
    try {
      await apiService.request(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      // Update state by filtering out the deleted notification
      const updatedNotifications = state.notifications.filter(
        notification => notification._id !== notificationId
      );
      
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: updatedNotifications
      });
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = state.notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        loadUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to delete notification'
      });
    }
  };
  
  // Load unread notification count
  const loadUnreadCount = async () => {
    if (!isAuthenticated()) return;
    
    try {
      const response = await apiService.request('/notifications/unread/count');
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
        payload: response.data.count
      });
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };
  
  // Send notification (for admin users)
  const sendNotification = async (data) => {
    if (!isAuthenticated() || user.role !== 'admin') return;
    
    try {
      await apiService.request('/notifications', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to send notification'
      });
      return false;
    }
  };
  
  // Clear error
  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };
  
  const value = {
    ...state,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    loadUnreadCount,
    clearError
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
