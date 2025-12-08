// src/utils/ChatUtil.js
export const openChatWithLink = (productOrService, action) => {
  // Prepare message text based on action
  let messageText = '';
  const url = window.location.href; // Current page URL

  if (action === 'book') {
    messageText = `I would like to book this service: ${productOrService.name}\n${url}`;
  } else if (action === 'cart') {
    messageText = `I'm interested in this product: ${productOrService.name}\n${url}`;
  } else {
    messageText = `I have a question about: ${productOrService.name}\n${url}`;
  }

  // Store the pre-filled message in localStorage 
  localStorage.setItem('chatPrefilledMessage', messageText);

  // Navigate to chat page (no hooks)
  window.location.href = '/chat';     // or use window.location.assign('/chat')
};