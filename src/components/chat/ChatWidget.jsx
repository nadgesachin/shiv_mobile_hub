import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { 
    conversations, 
    activeConversation, 
    messages, 
    unreadCount, 
    typingUsers,
    loadConversations, 
    loadMessages, 
    sendMessage, 
    sendTypingStatus
  } = useChat();
  
  const { user, isAdmin } = useAuth();
  
  // Scroll to bottom of messages when new messages come in
  useEffect(() => {
    if (messageListRef.current && isOpen) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  // Load conversations when widget is opened
  useEffect(() => {
    if (isOpen && !conversations.length) {
      loadConversations();
    }
  }, [isOpen, conversations.length, loadConversations]);
  
  // Handle typing indication with debounce
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      if (activeConversation) {
        sendTypingStatus(activeConversation.userId, true);
      }
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeConversation) {
        sendTypingStatus(activeConversation.userId, false);
      }
    }, 2000);
  };
  
  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !activeConversation) return;
    
    const success = await sendMessage(activeConversation.userId, message);
    if (success) {
      setMessage('');
    }
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    loadMessages(conversation.userId);
  };
  
  // Format timestamp to a readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-lg"
        aria-label="Chat"
      >
        <Icon name={isOpen ? 'X' : 'MessageCircle'} size={24} />
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </Button>
      
      {/* Chat Widget */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[30rem] bg-card border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Widget Header */}
          <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
            <h3 className="font-medium">
              {activeConversation ? activeConversation.name : 'Messages'}
            </h3>
            {activeConversation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadConversations()}
                aria-label="Back to conversations"
              >
                <Icon name="ArrowLeft" size={16} />
              </Button>
            )}
          </div>
          
          {/* Chat Content */}
          {!activeConversation ? (
            // Conversations List
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <Icon name="MessageCircle" size={40} className="mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet.</p>
                  {isAdmin() && (
                    <p className="text-xs mt-2">
                      Wait for customers to message you or start a conversation from the users panel.
                    </p>
                  )}
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted ${
                      conversation.unreadCount > 0 ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {conversation.avatar ? (
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon name="User" size={20} className="text-primary" />
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{conversation.name}</p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.senderId === user?._id ? (
                            <span className="text-xs mr-1">You:</span>
                          ) : null}
                          {conversation.lastMessage.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Active Conversation
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messageListRef}>
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.senderId === user?._id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 text-right">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {typingUsers[activeConversation.userId] && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t border-border p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-md bg-muted focus:outline-none"
                  />
                  <Button type="submit" size="sm" disabled={!message.trim()}>
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </form>
            </>
          )}
          
          {/* Social Links */}
          <div className="border-t border-border bg-card p-2 flex items-center justify-center space-x-3">
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="WhatsApp"
              title="Continue on WhatsApp"
            >
              <Icon name="Phone" size={16} />
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
              title="Email us"
            >
              <Icon name="Mail" size={16} />
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
              title="Message on Facebook"
            >
              <Icon name="Facebook" size={16} />
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
              title="Contact on Twitter"
            >
              <Icon name="Twitter" size={16} />
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
              title="Message on Instagram"
            >
              <Icon name="Instagram" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
