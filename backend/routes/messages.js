const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');


// Get conversations list (customers who have chatted with admin) with last message
// GET /api/messages/conversations/list
router.get('/conversations/list', auth, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    const isAdmin = req.user.role === 'admin';

    // Get unique user IDs who have chatted with current user
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId },
        { recipientId: currentUserId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(1000) // Reasonable limit
    .lean();

    // Group by other user
    const conversationMap = new Map();
    
    for (const msg of messages) {
      const otherUserId = msg.senderId.equals(currentUserId) 
        ? msg.recipientId.toString() 
        : msg.senderId.toString();
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      
      // Count unread messages (from other user to current user)
      if (!msg.read && msg.recipientId.equals(currentUserId)) {
        conversationMap.get(otherUserId).unreadCount++;
      }
    }

    // Get user details for all conversations
    const userIds = Array.from(conversationMap.keys()).map(id => new mongoose.Types.ObjectId(id));
    const users = await User.find({ _id: { $in: userIds } })
      .select('_id name email avatar role')
      .lean();

    // Build conversations array
    const conversations = users
      .filter(user => {
        // For admin: show non-admin users, for users: show admin
        if (isAdmin) {
          return user.role !== 'admin';
        } else {
          return user.role === 'admin';
        }
      })
      .map(user => {
        const conv = conversationMap.get(user._id.toString());
        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount
        };
      })
      .sort((a, b) => {
        // Sort by last message time
        return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
      });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error in GET /conversations/list', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all messages between current user (admin) and a specific customer
// GET /api/messages/conversations/:userId
router.get('/conversations/:userId', auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Simple query with populate - much faster than aggregation
    const messages = await Message.find({
      $or: [
        {
          senderId: new mongoose.Types.ObjectId(otherUserId),
          recipientId: new mongoose.Types.ObjectId(currentUserId)
        },
        {
          senderId: new mongoose.Types.ObjectId(currentUserId),
          recipientId: new mongoose.Types.ObjectId(otherUserId)
        }
      ]
    })
    .populate('senderId', 'name email avatar role')
    .populate('recipientId', 'name email avatar role')
    .sort({ createdAt: 1 }) // Ascending order (oldest first)
    .limit(100) // Increased limit
    .lean(); // Convert to plain JS objects for better performance

    // Transform to match expected format
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      message: msg.message,
      type: msg.type,
      read: msg.read,
      createdAt: msg.createdAt,
      senderId: msg.senderId?._id || msg.senderId,
      recipientId: msg.recipientId?._id || msg.recipientId,
      sender: msg.senderId,
      recipient: msg.recipientId
    }));

    res.json({ success: true, data: formattedMessages });
  } catch (error) {
    console.error('Error in GET /conversations/:userId', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { recipientId, message, type, fileUrl, fileName, fileSize } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const newMessage = new Message({
      senderId: req.user.id,
      recipientId,
      message,
      type: type || 'text',
      fileUrl,
      fileName,
      fileSize
    });

    await newMessage.save();

    res.json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error in POST /send', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark messages from a sender as read
// PUT /api/messages/read/:senderId
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    const senderId = req.params.senderId;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid sender ID format' 
      });
    }

    const result = await Message.updateMany(
      { 
        senderId: new mongoose.Types.ObjectId(senderId), 
        recipientId: new mongoose.Types.ObjectId(req.user.id), 
        read: false 
      },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      count: result.modifiedCount || result.nModified || 0,
      message: `Marked ${result.modifiedCount || result.nModified || 0} messages as read`
    });
  } catch (error) {
    console.error('Error in PUT /read/:senderId', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread message count for current user
// GET /api/messages/unread/count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipientId: req.user.id,
      read: false
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Error in GET /unread/count', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;