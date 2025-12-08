const socketIO = require('socket.io');
const User = require('./models/User');

let io;
const connectedUsers = new Map(); // Maps userId to socketId
const adminSockets = new Set(); // Set of admin socket IDs

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*', // You might want to restrict this in production
      methods: ['GET', 'POST']
    }
  });
  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle user authentication
    socket.on('authenticate', async (data) => {
      try {
        const { userId, role } = data;
        
        if (userId) {
          // Store the user connection
          connectedUsers.set(userId, socket.id);
          socket.userId = userId;
          
          // If admin, add to admin sockets
          if (role === 'admin') {
            adminSockets.add(socket.id);
            socket.isAdmin = true;
            
            // Send currently active users to admin
            const activeUsers = Array.from(connectedUsers.keys());
            const usersData = await User.find(
              { _id: { $in: activeUsers } },
              'name email avatar'
            );
            
            socket.emit('active_users', usersData);
          }
          
          console.log(`User authenticated: ${userId}, Role: ${role}`);
          socket.emit('authenticated', { success: true });
          
          // Notify admins of new user connection
          if (role !== 'admin') {
            notifyAdmins('user_connected', { userId });
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authenticated', { success: false, error: 'Authentication failed' });
      }
    });
    
    // Handle private messages
    socket.on('private_message', async (data) => {
      try {
        const { recipientId, message, type = 'text' } = data;
        
        if (!socket.userId) {
          socket.emit('error', { message: 'You are not authenticated' });
          return;
        }
        
        // Find sender info
        const sender = await User.findById(socket.userId, 'name role avatar');
        
        // Create message object
        const messageObject = {
          senderId: socket.userId,
          senderName: sender.name,
          senderRole: sender.role,
          senderAvatar: sender.avatar,
          message,
          type,
          timestamp: new Date()
        };
        
        // Send to recipient if online
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_message', {
            ...messageObject,
            conversationId: socket.userId // For non-admins, the conversationId is the sender's ID
          });
        }
        
        // If sender is not admin, also notify all admins
        if (sender.role !== 'admin') {
          notifyAdmins('new_message', {
            ...messageObject,
            conversationId: socket.userId
          });
        }
        
        // Confirm message was sent
        socket.emit('message_sent', { success: true, timestamp: new Date() });
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle notifications
    socket.on('send_notification', (data) => {
      const { targetUserIds, notification } = data;
      
      if (!socket.userId) {
        socket.emit('error', { message: 'You are not authenticated' });
        return;
      }
      
      // Send to specific users if provided
      if (targetUserIds && Array.isArray(targetUserIds)) {
        targetUserIds.forEach(userId => {
          const targetSocketId = connectedUsers.get(userId);
          if (targetSocketId) {
            io.to(targetSocketId).emit('notification', notification);
          }
        });
      } 
      // If no specific users, broadcast to all admins or users
      else if (notification.audienceType === 'admin') {
        notifyAdmins('notification', notification);
      } else {
        // Send to all non-admin users
        connectedUsers.forEach((socketId, userId) => {
          const isAdmin = adminSockets.has(socketId);
          if (!isAdmin) {
            io.to(socketId).emit('notification', notification);
          }
        });
      }
    });
    
    // Handle typing indicators
    socket.on('typing', (data) => {
      const { recipientId, isTyping } = data;
      
      if (!socket.userId) {
        return;
      }
      
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_typing', {
          senderId: socket.userId,
          isTyping
        });
      }
      
      // If sender is not admin, also notify admins about typing
      if (!socket.isAdmin) {
        notifyAdmins('user_typing', {
          senderId: socket.userId,
          isTyping
        });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        
        // Remove from admin sockets if applicable
        if (socket.isAdmin) {
          adminSockets.delete(socket.id);
        } else {
          // Notify admins that user disconnected
          notifyAdmins('user_disconnected', { userId: socket.userId });
        }
      }
    });
  });
  
  return io;
};

// Helper function to notify all admin sockets
const notifyAdmins = (event, data) => {
  adminSockets.forEach(socketId => {
    io.to(socketId).emit(event, data);
  });
};

// Helper to get the IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
