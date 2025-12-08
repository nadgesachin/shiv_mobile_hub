const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const filter = { userId: req.user._id };
    if (unreadOnly === 'true') {
      filter.read = false;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a notification
router.post('/', auth, async (req, res) => {
  try {
    const { userId, type, title, message, data, icon, url } = req.body;
    
    // Check if sender has permission to create notification for userId
    const isAdmin = req.user.role === 'admin';
    const isSelfNotification = req.user._id.toString() === userId;
    
    if (!isAdmin && !isSelfNotification) {
      return res.status(403).json({ success: false, message: 'Not authorized to create notifications for other users' });
    }
    
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
      icon,
      url
    });
    
    await notification.save();
    
    // If using socket.io, emit event
    try {
      const socketIO = require('../socket').getIO();
      socketIO.to(userId).emit('notification', notification);
    } catch (err) {
      console.error('Socket notification error:', err);
    }
    
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    // Check if user owns the notification
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notification' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ 
      success: true, 
      message: `Marked ${result.nModified} notifications as read` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    // Check if user owns the notification
    if (notification.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notification' });
    }
    
    await notification.delete();
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread notification count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });
    
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
