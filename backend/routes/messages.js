const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    // Find all users this user has had conversations with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { recipientId: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", req.user._id] },
              "$recipientId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          userId: '$_id',
          name: '$userDetails.name',
          avatar: '$userDetails.avatar',
          role: '$userDetails.role',
          lastMessage: {
            _id: '$lastMessage._id',
            message: '$lastMessage.message',
            senderId: '$lastMessage.senderId',
            type: '$lastMessage.type',
            createdAt: '$lastMessage.createdAt',
            read: '$lastMessage.read'
          }
        }
      }
    ]);

    // Get unread counts for each conversation
    for (let conv of conversations) {
      const unreadCount = await Message.countDocuments({
        senderId: conv.userId,
        recipientId: req.user._id,
        read: false
      });
      conv.unreadCount = unreadCount;
    }

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages between current user and another user
router.get('/conversations/:userId', auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Get messages
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, recipientId: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { recipientId, message, type, fileUrl, fileName, fileSize } = req.body;

    // Validate recipient ID
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Create new message
    const newMessage = new Message({
      senderId: req.user._id,
      recipientId,
      message,
      type: type || 'text',
      fileUrl,
      fileName,
      fileSize
    });

    await newMessage.save();

    // If using socket.io, emit event
    try {
      const socketIO = require('../socket').getIO();
      socketIO.to(recipientId).emit('new_message', newMessage);
    } catch (err) {
      console.error('Socket notification error:', err);
    }

    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark messages as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    const senderId = req.params.senderId;

    // Update all unread messages from this sender
    const result = await Message.updateMany(
      { senderId, recipientId: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: `Marked ${result.nModified} messages as read`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a message (soft delete)
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is allowed to delete this message
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }

    // Soft delete
    message.isDeleted = true;
    await message.save();

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipientId: req.user._id,
      read: false
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
