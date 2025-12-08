import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ChatInput = ({ onSendMessage, onTyping, disabled = false, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle input change
  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Trigger typing event
    if (onTyping) {
      onTyping(true);
    }
  };
  
  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && !isUploading) return;
    
    // Send message to parent component
    onSendMessage(message);
    
    // Clear input
    setMessage('');
    
    // Reset typing status
    if (onTyping) {
      onTyping(false);
    }
  };
  
  // Handle file upload button click
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // In a real implementation, upload the file to a server and get a URL
      // Here we're just simulating with a timeout
      setTimeout(() => {
        // Send a message with the "file" attached
        onSendMessage(`Sent file: ${file.name}`, {
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file) // This is temporary and will not persist
        });
        
        setIsUploading(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };
  
  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };
  
  // Simple emoji picker
  const emojis = ['😊', '👍', '❤️', '🙏', '😂', '🎉', '👋', '🤔', '😅', '🔥'];
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-muted rounded-lg px-3 border border-border">
        <button
          type="button"
          onClick={handleFileClick}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Attach file"
          disabled={disabled}
        >
          <Icon name="Paperclip" size={18} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 py-3 bg-transparent focus:outline-none min-w-0"
          disabled={disabled}
        />
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="text-muted-foreground hover:text-foreground transition-colors mr-1"
            aria-label="Emoji"
            disabled={disabled}
          >
            <Icon name="Smile" size={18} />
          </button>
          
          {showEmojis && (
            <div className="absolute right-0 bottom-full mb-2 p-2 bg-background border border-border rounded-lg shadow-md grid grid-cols-5 gap-2 z-50">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full p-0 flex items-center justify-center"
        disabled={(!message.trim() && !isUploading) || disabled}
        aria-label="Send message"
      >
        {isUploading ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Icon name="Send" size={16} />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;
