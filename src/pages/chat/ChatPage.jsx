import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
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
  const [pollingInterval, setPollingInterval] = useState(null);
  const messageListRef = useRef(null);
  
  const { user, isAdmin } = useAuth();
  
  // Polling interval in ms (5 seconds)
  const POLL_INTERVAL = 5000;
  
  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    
    // Clean up polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);
  
  // Fetch conversations
  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/api/messages/conversations');
      if (response.data && response.data.success) {
        setConversations(response.data.data);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };
  
  // Start polling for new messages when a conversation is active
  useEffect(() => {
    if (activeConversation) {
      // Load initial messages
      loadMessages(activeConversation.userId);
      
      // Set up polling
      const interval = setInterval(() => {
        loadMessages(activeConversation.userId, false);
      }, POLL_INTERVAL);
      
      setPollingInterval(interval);
      
      // Mark messages as read
      markMessagesAsRead(activeConversation.userId);
    } else {
      // Clear polling interval when no active conversation
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [activeConversation]);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Load messages for a specific conversation
  const loadMessages = async (userId, showLoading = true) => {
    if (showLoading) {
      setLoadingMessages(true);
    }
    
    try {
      const response = await apiService.get(`/api/messages/conversations/${userId}`);
      if (response.data && response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      if (showLoading) {
        setLoadingMessages(false);
      }
    }
  };
  
  // Mark messages as read
  const markMessagesAsRead = async (userId) => {
    try {
      await apiService.put(`/api/messages/read/${userId}`);
      
      // Update unread count in conversations list
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.userId === userId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        });
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (messageText, attachment) => {
    if ((!messageText.trim() && !attachment) || !activeConversation) return;
    
    try {
      // Optimistically add message to UI
      const tempMessage = {
        _id: `temp_${Date.now()}`,
        senderId: user._id,
        recipientId: activeConversation.userId,
        message: messageText,
        type: attachment ? 'file' : 'text',
        read: false,
        createdAt: new Date().toISOString(),
        fileUrl: attachment?.fileUrl,
        fileName: attachment?.fileName,
        fileSize: attachment?.fileSize
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Send to server
      const payload = {
        recipientId: activeConversation.userId,
        message: messageText
      };
      
      if (attachment) {
        payload.type = 'file';
        payload.fileUrl = attachment.fileUrl;
        payload.fileName = attachment.fileName;
        payload.fileSize = attachment.fileSize;
      }
      
      const response = await apiService.post('/api/messages/send', payload);
      
      // Replace temp message with actual message
      if (response.data && response.data.success) {
        setMessages(prev => [
          ...prev.filter(msg => msg._id !== tempMessage._id),
          response.data.data
        ]);
        
        // Update the conversation with last message
        updateConversationLastMessage(activeConversation.userId, response.data.data);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error sending message:', err);
      Toast.error('Failed to send message');
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg._id !== `temp_${Date.now()}`));
      return false;
    }
  };
  
  // Update conversation with last message
  const updateConversationLastMessage = (userId, message) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.userId === userId) {
          return {
            ...conv,
            lastMessage: message
          };
        }
        return conv;
      });
    });
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };
  
  // Format timestamp to a readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const getGroupedMessages = () => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return Object.entries(groups);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-medium">Messages</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading && conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {isAdmin() ? 
                        "You'll see messages from your customers here." :
                        "Start a conversation with our team for inquiries or support."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.userId}
                        className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-muted ${
                          activeConversation?.userId === conversation.userId ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {conversation.avatar ? (
                              <img
                                src={conversation.avatar}
                                alt={conversation.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon name="User" size={24} className="text-primary" />
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium truncate">{conversation.name}</h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground ml-2">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          
                          {conversation.lastMessage ? (
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.senderId === user?._id ? (
                                <span className="text-xs mr-1">You:</span>
                              ) : null}
                              {conversation.lastMessage.message}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">No messages yet</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {activeConversation.avatar ? (
                        <img
                          src={activeConversation.avatar}
                          alt={activeConversation.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={20} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{activeConversation.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.role === 'admin' ? 'Admin' : 'Customer'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div 
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    ref={messageListRef}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">No messages yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Start a conversation with {activeConversation.name}
                        </p>
                      </div>
                    ) : (
                      getGroupedMessages().map(([date, msgs]) => (
                        <div key={date} className="space-y-3">
                          <div className="flex items-center justify-center">
                            <div className="bg-muted px-4 py-1 rounded-full">
                              <span className="text-xs text-muted-foreground">{date}</span>
                            </div>
                          </div>
                          
                          {msgs.map((msg) => (
                            <div
                              key={msg._id || msg.createdAt}
                              className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  msg.senderId === user?._id
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
                    
                    {/* Typing indicator removed since we're not using socket.io */}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-border p-4">
                    <ChatInput 
                      onSendMessage={handleSendMessage}
                      disabled={!activeConversation}
                    />
                    
                    {/* Alternative Contact Methods */}
                    <div className="mt-3 flex items-center gap-3 justify-end text-sm text-muted-foreground">
                      <span>Or contact via:</span>
                      <a href="https://wa.me/917123456789" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" aria-label="WhatsApp">
                        <Icon name="Phone" size={14} className="mr-1" />
                        WhatsApp
                      </a>
                      <a href="mailto:info@shivmobilehub.com" className="hover:text-foreground" aria-label="Email">
                        <Icon name="Mail" size={14} className="mr-1" />
                        Email
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <Icon name="MessageSquare" size={64} className="text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-medium mb-2">Your Messages</h2>
                    <p className="text-muted-foreground max-w-md">
                      {isAdmin() ?
                        "Select a conversation to view messages or respond to customer inquiries." :
                        "Select a conversation or start a new one to get in touch with our team."
                      }
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
