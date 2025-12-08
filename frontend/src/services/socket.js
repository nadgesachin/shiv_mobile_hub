import { io } from 'socket.io-client';

// Create a class for socket handling
class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {
      newMessage: [],
      notification: [],
      userConnected: [],
      userDisconnected: [],
      userTyping: [],
      error: []
    };
    this.connected = false;
  }
  
  // Initialize socket connection
  initialize() {
    if (this.socket) {
      return;
    }
    
    const SOCKET_URL = 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Setup event listeners
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.triggerCallbacks('error', error);
    });
    
    this.socket.on('new_message', (message) => {
      this.triggerCallbacks('newMessage', message);
    });
    
    this.socket.on('notification', (notification) => {
      this.triggerCallbacks('notification', notification);
    });
    
    this.socket.on('user_connected', (data) => {
      this.triggerCallbacks('userConnected', data);
    });
    
    this.socket.on('user_disconnected', (data) => {
      this.triggerCallbacks('userDisconnected', data);
    });
    
    this.socket.on('user_typing', (data) => {
      this.triggerCallbacks('userTyping', data);
    });
  }
  
  // Connect and authenticate
  connect(userId, role) {
    if (!this.socket) {
      this.initialize();
    }
    
    this.socket.connect();
    
    if (userId) {
      this.socket.emit('authenticate', { userId, role });
    }
  }
  
  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
  // Send a private message
  sendPrivateMessage(recipientId, message, type = 'text') {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return false;
    }
    
    this.socket.emit('private_message', {
      recipientId,
      message,
      type
    });
    
    return true;
  }
  
  // Send typing indicator
  sendTypingStatus(recipientId, isTyping) {
    if (!this.socket || !this.connected) return;
    
    this.socket.emit('typing', {
      recipientId,
      isTyping
    });
  }
  
  // Send notification
  sendNotification(notification, targetUserIds = null) {
    if (!this.socket || !this.connected) return;
    
    this.socket.emit('send_notification', {
      notification,
      targetUserIds
    });
  }
  
  // Register event handlers
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    
    this.callbacks[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    };
  }
  
  // Trigger callbacks for an event
  triggerCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }
  
  // Check if socket is connected
  isConnected() {
    return this.connected;
  }
}

// Create and export singleton instance
const socketService = new SocketService();
export default socketService;
