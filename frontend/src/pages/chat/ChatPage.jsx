// src/pages/chat/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import ChatInput from '../../components/chat/ChatInput';
import apiService from '../../services/api';
import Toast from '../../components/ui/Toast';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messageListRef = useRef(null);

  const { user, isAdmin } = useAuth();
  const POLL_INTERVAL = 5000; // ms

  // Load left-side conversations list (customers for admin, admin for normal users)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        if (!isAdmin()) {
          // For normal users, fetch admin user and set as only conversation
          const adminRes = await apiService.request('/auth/admin-user');
          if (adminRes && adminRes.success && adminRes.data) {
            const adminUser = adminRes.data;
            const adminConv = {
              userId: adminUser._id,
              name: adminUser.name || 'Admin Support',
              lastMessage: null,
              unreadCount: 0
            };
            setConversations([adminConv]);
            setActiveConversation(adminConv);
          }
        } else {
          // For admin, fetch customer conversations
          const res = await apiService.request('/messages/conversations/list');
          if (res && res.success) {
            const convs = res.data || [];
            setConversations(convs);
            if (convs.length > 0 && !activeConversation) {
              setActiveConversation(convs[0]);
            }
          } else {
            setError('Failed to load conversations');
          }
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchConversations();
    }
  }, [user?._id, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load messages for selected customer (right side)
  const fetchMessages = async (showLoading = true) => {
    if (!activeConversation?.userId) return;    // guard
    try {
      if (showLoading) setLoadingMessages(true);

      const userId = activeConversation.userId;
      const res = await apiService.getAllMessages(userId);
      // Expect: { success: true, data: [ messages... ] }
      if (res && res.success) {
        setMessages(res.data || []);
      } else {
        console.error('Invalid messages response:', res);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const markRead = async () => {
    if (!activeConversation?.userId) return;    // guard
    try {
      const userId = activeConversation.userId;
      await apiService.request(`/messages/read/${userId}`, {
        method: 'PUT'
      });
      // Update unread count locally
      setConversations(prev =>
        prev.map(conv =>
          conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  useEffect(() => {
    if (!activeConversation?.userId) return;

    // Initial load + mark read when conversation changes
    fetchMessages(true);
    markRead();

    // Optional polling (keep commented out for now)
    // const intervalId = setInterval(() => {
    //   fetchMessages(false);
    // }, POLL_INTERVAL);
  //
  // return () => clearInterval(intervalId);
}, [activeConversation?.userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = async (messageText, attachment) => {
    if ((!messageText.trim() && !attachment) || !activeConversation?.userId) return;

    const recipientId = activeConversation.userId;
    const tempId = `temp_${Date.now()}`;

    const tempMessage = {
      _id: tempId,
      senderId: user?._id,
      recipientId,
      message: messageText,
      type: attachment ? 'file' : 'text',
      read: false,
      createdAt: new Date().toISOString(),
      fileUrl: attachment?.fileUrl,
      fileName: attachment?.fileName,
      fileSize: attachment?.fileSize,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const payload = {
        recipientId,
        message: messageText,
      };

      if (attachment) {
        payload.type = 'file';
        payload.fileUrl = attachment.fileUrl;
        payload.fileName = attachment.fileName;
        payload.fileSize = attachment.fileSize;
      }

      const res = await apiService.request('/messages/send', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        const saved = res.data;

        // Replace temp with saved
        setMessages(prev => [
          ...prev.filter(m => m._id !== tempId),
          saved,
        ]);

        // Update lastMessage in left list
        setConversations(prev =>
          prev.map(conv =>
            conv.userId === recipientId
              ? { ...conv, lastMessage: saved }
              : conv
          )
        );
      } else {
        throw new Error('Send failed');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      Toast.error('Failed to send message');
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getGroupedMessages = () => {
    const groups = {};
    messages.forEach(msg => {
      const key = formatDate(msg.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return Object.entries(groups);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* LEFT: Conversations list (hidden for normal users on mobile) */}
            <div className="w-1/3 border-r border-border flex flex-col hidden md:flex">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-medium">
                    {isAdmin() ? 'Customers' : 'Conversations'}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loading && conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <Icon
                        name="MessageCircle"
                        size={48}
                        className="text-muted-foreground mb-4"
                      />
                      <h3 className="font-medium mb-2">
                        {isAdmin() ? 'No customers yet' : 'No conversations yet'}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {isAdmin()
                          ? "You'll see customers who message you here."
                          : 'Start a conversation with our team.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {conversations.map(conv => (
                        <div
                          key={conv.userId}
                          className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted ${activeConversation?.userId === conv.userId ? 'bg-muted' : ''
                            }`}
                          onClick={() => handleSelectConversation(conv)}
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              <Icon name="User" size={18} className="text-primary" />
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-medium truncate">{conv.name}</h3>
                              {conv.lastMessage && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatTime(conv.lastMessage.createdAt)}
                                </span>
                              )}
                            </div>

                            {conv.lastMessage ? (
                              <p className="text-sm text-muted-foreground truncate">
                                {conv.lastMessage.senderId === user?._id && (
                                  <span className="text-xs mr-1">You:</span>
                                )}
                                {conv.lastMessage.message}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                No messages yet
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            
            {/* RIGHT: Chat area */}
            <div className="flex-1 md:w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {activeConversation.name || 'Conversation'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin() ? 'Customer' : 'Support'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    ref={messageListRef}
                  >
                    {loadingMessages && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Icon
                          name="MessageCircle"
                          size={48}
                          className="text-muted-foreground mb-4"
                        />
                        <h3 className="font-medium mb-2">No messages yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Start a conversation with {activeConversation.name || 'this user'}.
                        </p>
                      </div>
                    ) : (
                      getGroupedMessages().map(([date, msgs]) => (
                        <div key={date} className="space-y-3">
                          <div className="flex items-center justify-center">
                            <div className="bg-muted px-4 py-1 rounded-full">
                              <span className="text-xs text-muted-foreground">
                                {date}
                              </span>
                            </div>
                          </div>

                          {msgs.map(msg => (
                            <div
                              key={msg._id || msg.createdAt}
                              className={`flex ${msg.senderId === user?._id
                                ? 'justify-end'
                                : 'justify-start'
                                }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.senderId === user?._id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                                  }`}
                              >
                                <p>{msg.message}</p>
                                <div className="text-right">
                                  <span className="text-xs opacity-70">
                                    {formatTime(msg.createdAt)}
                                    {msg.read && msg.senderId === user?._id && (
                                      <span className="ml-2">✓</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-border p-4">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      disabled={!activeConversation}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <Icon
                      name="MessageSquare"
                      size={64}
                      className="text-muted-foreground mx-auto mb-4"
                    />
                    <h2 className="text-xl font-medium mb-2">Your Messages</h2>
                    <p className="text-muted-foreground max-w-md">
                      {isAdmin()
                        ? 'Select a customer from the list to view and reply to messages.'
                        : 'Select a conversation or start a new one to contact our team.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;