const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get conversations list (customers who have chatted with admin) with last message
// GET /api/messages/conversations/list
router.get('/conversations/list', auth, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    // For admin: show customers (non-admin)
    // For customer: show only admin
    const roleMatch =
      req.user.role === 'admin'
        ? { 'userDetails.role': { $ne: 'admin' } }
        : { 'userDetails.role': 'admin' };

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { recipientId: currentUserId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', currentUserId] },
              '$recipientId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
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
      { $unwind: '$userDetails' },
      {
        // Apply role-based filter depending on current user
        $match: roleMatch
      },
      {
        $project: {
          _id: 0,
          userId: '$userDetails._id',
          name: '$userDetails.name',
          role: '$userDetails.role',
          avatar: '$userDetails.avatar',
          email: '$userDetails.email',
          lastMessage: {
            _id: '$lastMessage._id',
            message: '$lastMessage.message',
            senderId: '$lastMessage.senderId',
            recipientId: '$lastMessage.recipientId',
            type: '$lastMessage.type',
            createdAt: '$lastMessage.createdAt',
            read: '$lastMessage.read'
          }
        }
      }
    ]);

    // Per-conversation unread count (messages from that user to admin that are unread)
    for (let conv of conversations) {
      const unreadCount = await Message.countDocuments({
        senderId: conv.userId,
        recipientId: req.user.id,
        read: false
      });
      conv.unreadCount = unreadCount;
    }

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

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              senderId: new mongoose.Types.ObjectId(otherUserId),
              recipientId: new mongoose.Types.ObjectId(req.user.id)
            },
            {
              senderId: new mongoose.Types.ObjectId(req.user.id),
              recipientId: new mongoose.Types.ObjectId(otherUserId)
            }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: 0 },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      { $unwind: '$sender' },
      {
        $lookup: {
          from: 'users',
          localField: 'recipientId',
          foreignField: '_id',
          as: 'recipient'
        }
      },
      { $unwind: '$recipient' },
      {
        $project: {
          _id: 1,
          message: 1,
          type: 1,
          read: 1,
          createdAt: 1,
          senderId: 1,
          recipientId: 1,
          sender: {
            _id: '$sender._id',
            name: '$sender.name',
            email: '$sender.email',
            avatar: '$sender.avatar',
            role: '$sender.role'
          },
          recipient: {
            _id: '$recipient._id',
            name: '$recipient.name',
            email: '$recipient.email',
            avatar: '$recipient.avatar',
            role: '$recipient.role'
          }
        }
      },
      { $sort: { createdAt: 1 } }
    ]);

    res.json({ success: true, data: conversations });
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

    try {
      const socketIO = require('../socket').getIO();
      socketIO.to(recipientId).emit('new_message', newMessage);
    } catch (err) {
      console.error('Socket notification error:', err);
    }

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

    const result = await Message.updateMany(
      { senderId, recipientId: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount || result.nModified} messages as read`
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

// (Optional) Delete / soft delete routes left as in your original if needed...

module.exports = router;