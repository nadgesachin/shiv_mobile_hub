import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
  typingUsers: {}
};

// Action types
const CHAT_ACTIONS = {
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_ACTIVE_CONVERSATION: 'SET_ACTIVE_CONVERSATION',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER_TYPING: 'SET_USER_TYPING'
};

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
        loading: false
      };
      
    case CHAT_ACTIONS.SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        activeConversation: action.payload,
        loading: false
      };
      
    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
      
    case CHAT_ACTIONS.ADD_MESSAGE:
      const newMessage = action.payload;
      
      // Update unread count if message is to current user and from another conversation
      let newUnreadCount = state.unreadCount;
      if (!newMessage.read && 
          (state.activeConversation?.userId !== newMessage.senderId) && 
          (newMessage.recipientId === action.currentUserId)) {
        newUnreadCount++;
      }
      
      // Update conversations with last message
      const updatedConversations = state.conversations.map(conv => {
        if ((conv.userId === newMessage.senderId) || (conv.userId === newMessage.recipientId)) {
          return {
            ...conv,
            lastMessage: {
              message: newMessage.message,
              senderId: newMessage.senderId,
              createdAt: newMessage.createdAt,
              type: newMessage.type,
              read: newMessage.read
            },
            unreadCount: conv.userId === newMessage.senderId ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      });
      
      // Add message to current conversation's messages if applicable
      const updatedMessages = (
        state.activeConversation?.userId === newMessage.senderId || 
        state.activeConversation?.userId === newMessage.recipientId
      ) 
        ? [...state.messages, newMessage]
        : state.messages;
      
      return {
        ...state,
        messages: updatedMessages,
        conversations: updatedConversations,
        unreadCount: newUnreadCount
      };
      
    case CHAT_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };
      
    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case CHAT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case CHAT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case CHAT_ACTIONS.SET_USER_TYPING:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.senderId]: action.payload.isTyping
        }
      };
      
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext();

// Chat provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      socketService.initialize();
      socketService.connect(user._id, user.role);
      
      // Load conversations and unread count
      loadConversations();
      loadUnreadCount();
      
      // Socket event listeners
      const newMessageUnsub = socketService.on('newMessage', message => {
        dispatch({ 
          type: CHAT_ACTIONS.ADD_MESSAGE, 
          payload: message,
          currentUserId: user._id
        });
      });
      
      const typingUnsub = socketService.on('userTyping', data => {
        dispatch({
          type: CHAT_ACTIONS.SET_USER_TYPING,
          payload: data
        });
      });
      
      // Cleanup function
      return () => {
        newMessageUnsub();
        typingUnsub();
      };
    }
  }, []);
  
  // Load conversations
  const loadConversations = async () => {
    if (!isAuthenticated()) return;
    
    dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await apiService.request('/messages/conversations');
      dispatch({
        type: CHAT_ACTIONS.SET_CONVERSATIONS,
        payload: response.data
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load conversations'
      });
    }
  };
  
  // Load messages for a specific conversation
  const loadMessages = async (userId) => {
    if (!isAuthenticated()) return;
    
    dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Find conversation in state or fetch it
      let conversation = state.conversations.find(c => c.userId === userId);
      
      if (!conversation) {
        // Get user details if conversation not found
        const userResponse = await apiService.request(`/users/${userId}`);
        if (userResponse.success && userResponse.data) {
          conversation = {
            userId,
            name: userResponse.data.name,
            avatar: userResponse.data.avatar,
            role: userResponse.data.role,
            unreadCount: 0
          };
        }
      }
      
      // Set active conversation
      dispatch({
        type: CHAT_ACTIONS.SET_ACTIVE_CONVERSATION,
        payload: conversation
      });
      
      // Get messages
      const messagesResponse = await apiService.request(`/messages/conversations/${userId}`);
      
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: messagesResponse.data
      });
      
      // Update unread count after marking messages as read
      loadUnreadCount();
      
    } catch (error) {
      console.error('Error loading messages:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load messages'
      });
    }
  };
  
  // Send message
  const sendMessage = async (recipientId, message, type = 'text') => {
    if (!isAuthenticated()) return false;
    
    try {
      // Try to send via socket first
      const socketSent = socketService.sendPrivateMessage(recipientId, message, type);
      
      // If socket fails, send via API
      if (!socketSent) {
        await apiService.request('/messages/send', {
          method: 'POST',
          body: JSON.stringify({
            recipientId,
            message,
            type
          })
        });
      }
      
      // Add message to state (optimistic update)
      const newMessage = {
        senderId: user._id,
        recipientId,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: newMessage,
        currentUserId: user._id
      });
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to send message'
      });
      return false;
    }
  };
  
  // Send typing indicator
  const sendTypingStatus = (recipientId, isTyping) => {
    socketService.sendTypingStatus(recipientId, isTyping);
  };
  
  // Mark messages as read
  const markMessagesAsRead = async (senderId) => {
    if (!isAuthenticated()) return;
    
    try {
      await apiService.request(`/messages/read/${senderId}`, {
        method: 'PUT'
      });
      
      // Update conversation unread count
      const updatedConversations = state.conversations.map(conv => {
        if (conv.userId === senderId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      
      dispatch({
        type: CHAT_ACTIONS.SET_CONVERSATIONS,
        payload: updatedConversations
      });
      
      // Update total unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  // Load unread message count
  const loadUnreadCount = async () => {
    if (!isAuthenticated()) return;
    
    try {
      const response = await apiService.request('/messages/unread/count');
      dispatch({
        type: CHAT_ACTIONS.SET_UNREAD_COUNT,
        payload: response.data.count
      });
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };
  
  // Clear error
  const clearError = () => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  };
  
  const value = {
    ...state,
    loadConversations,
    loadMessages,
    sendMessage,
    markMessagesAsRead,
    loadUnreadCount,
    sendTypingStatus,
    clearError
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
