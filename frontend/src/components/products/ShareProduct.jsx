import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

const ShareProduct = ({ product, className = '' }) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  // Generate the product URL
  const getProductUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/products/${product._id}`;
  };

  // Copy product link to clipboard
  const copyToClipboard = () => {
    const url = getProductUrl();
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopiedTooltip(true);
        setTimeout(() => setShowCopiedTooltip(false), 2000);
        Toast.success('Product link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        Toast.error('Failed to copy link');
      });
  };

  // Share product via different platforms
  const shareVia = (platform) => {
    const url = encodeURIComponent(getProductUrl());
    const title = encodeURIComponent(`Check out ${product.name}`);
    const text = encodeURIComponent(`I found this amazing product: ${product.name}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20-%20${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copyToClipboard()}
          className="flex items-center gap-2"
          aria-label="Copy product link"
        >
          <Icon name="Link" size={16} />
          <span>Share</span>
        </Button>
        
        {showCopiedTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded shadow">
            Copied!
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shareVia('whatsapp')}
          className="rounded-full w-8 h-8 text-green-500"
          aria-label="Share on WhatsApp"
        >
          <Icon name="Phone" size={14} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shareVia('facebook')}
          className="rounded-full w-8 h-8 text-blue-600"
          aria-label="Share on Facebook"
        >
          <Icon name="Facebook" size={14} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shareVia('twitter')}
          className="rounded-full w-8 h-8 text-sky-500"
          aria-label="Share on Twitter"
        >
          <Icon name="Twitter" size={14} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shareVia('email')}
          className="rounded-full w-8 h-8 text-purple-500"
          aria-label="Share via Email"
        >
          <Icon name="Mail" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ShareProduct;
