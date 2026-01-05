import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import { motion } from 'framer-motion';

const PosterGenerator = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [step, setStep] = useState(1); // 1: Select Item, 2: Choose Template, 3: Design
  const [posterType, setPosterType] = useState('product'); // 'product' or 'service'
  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedSize, setSelectedSize] = useState('instagram-square');
  
  // Poster elements with drag-drop support
  const [posterElements, setPosterElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const posterRef = useRef(null);
  
  const posterSizes = {
    'instagram-square': { width: 1080, height: 1080, name: 'Instagram Square (1:1)', icon: 'Square' },
    'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story (9:16)', icon: 'Smartphone' },
    'facebook-post': { width: 1200, height: 630, name: 'Facebook Post (1.91:1)', icon: 'Facebook' },
    'twitter-post': { width: 1200, height: 675, name: 'Twitter Post (16:9)', icon: 'Twitter' },
    'whatsapp-status': { width: 1080, height: 1920, name: 'WhatsApp Status (9:16)', icon: 'MessageCircle' },
    'youtube-thumbnail': { width: 1280, height: 720, name: 'YouTube Thumbnail (16:9)', icon: 'Youtube' },
    'pinterest-pin': { width: 1000, height: 1500, name: 'Pinterest Pin (2:3)', icon: 'Image' },
    'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post', icon: 'Linkedin' },
    'a4-portrait': { width: 2480, height: 3508, name: 'A4 Portrait Print', icon: 'FileText' },
    'mobile-wallpaper': { width: 1080, height: 2340, name: 'Mobile Wallpaper', icon: 'Smartphone' }
  };
  
  const canvasSize = posterSizes[selectedSize];
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  // Load items based on poster type
  useEffect(() => {
    if (step === 1) {
      setSelectedItem(null);
      loadItems();
    }
  }, [posterType]);
  
  // Auto-open modal when items are loaded and no item is selected
  useEffect(() => {
    if (step === 1 && items.length > 0 && !selectedItem && !loading) {
      setShowModal(true);
    }
  }, [items, step, selectedItem, loading]);
  
  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadItems = async () => {
    try {
      setLoading(true);
      setItemsError(null);
      const response = await apiService.request(`/${posterType}s`);
      
      // Backend returns: { success: true, data: { products: [...], pagination: {...} } }
      // apiService.request returns the full response
      // So we need: response.data.products or response.data.services
      
      let itemsArray = [];
      
      if (response?.data?.[`${posterType}s`]) {
        // response.data.products or response.data.services
        itemsArray = response.data[`${posterType}s`];
      } else if (Array.isArray(response?.data)) {
        // Fallback: if data is directly an array
        itemsArray = response.data;
      } else if (response?.[`${posterType}s`]) {
        // Another fallback: response.products directly
        itemsArray = response[`${posterType}s`];
      }
      
      if (Array.isArray(itemsArray) && itemsArray.length > 0) {
        console.log(`✅ Loaded ${itemsArray.length} ${posterType}s`);
        setItems(itemsArray);
        setItemsError(null);
      } else {
        console.warn(`⚠️ No ${posterType}s found in response:`, response);
        setItems([]);
        setItemsError(`No ${posterType}s available. Please add some ${posterType}s first.`);
      }
    } catch (error) {
      console.error(`❌ Error loading ${posterType}s:`, error);
      setItems([]);
      setItemsError(error.message || 'Failed to load items');
      Toast.error(`Failed to load ${posterType}s`);
    } finally {
      setLoading(false);
    }
  };
  
  const loadSettings = async () => {
    try {
      const response = await apiService.request('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setPosterConfig(prev => ({ ...prev, title: item.name }));
    setShowModal(false);
    Toast.success(`${item.name} selected!`);
    setStep(2);
  };
  
  const openModal = () => {
    setShowModal(true);
    if (items.length === 0 || loading) {
      loadItems();
    }
  };
  
  const handlePosterTypeChange = (type) => {
    setPosterType(type);
    setSelectedItem(null);
    setItems([]);
  };
  
  const handleTemplateSelect = (templateId) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (!selectedTemplate) return;
    
    setTemplate(templateId);
    setStep(3);
    
    // Set colors and gradient based on template
    setPosterConfig({
      ...posterConfig,
      backgroundColor: selectedTemplate.gradient[0],
      textColor: selectedTemplate.textColor,
      accentColor: selectedTemplate.accentColor,
      gradient: selectedTemplate.gradient
    });
  };
  
  // Draw poster on canvas
  useEffect(() => {
    if (step === 3 && canvasRef.current && selectedItem && settings) {
      drawPoster();
    }
  }, [step, selectedItem, posterConfig, settings, template]);
  
  const drawPoster = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    // Background with multi-color gradient from template
    const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
    const gradient = posterConfig.gradient || [posterConfig.backgroundColor, adjustBrightness(posterConfig.backgroundColor, -10)];
    gradient.forEach((color, index) => {
      bgGradient.addColorStop(index / (gradient.length - 1), color);
    });
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);
    
    // Load and draw product/service image if available
    let productImageHeight = 0;
    if (posterConfig.showImage && selectedItem.images && selectedItem.images.length > 0) {
      try {
        const imgUrl = selectedItem.images[0].url || selectedItem.images[0];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Draw image at top with rounded corners
            const imgWidth = w * 0.8;
            const imgHeight = (w < h) ? h * 0.35 : h * 0.25;
            const imgX = (w - imgWidth) / 2;
            const imgY = 60;
            
            // Create rounded corners mask
            ctx.save();
            roundRect(ctx, imgX, imgY, imgWidth, imgHeight, 20);
            ctx.clip();
            
            // Draw image
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            ctx.restore();
            
            // Add border
            ctx.strokeStyle = posterConfig.accentColor;
            ctx.lineWidth = 4;
            roundRect(ctx, imgX, imgY, imgWidth, imgHeight, 20);
            ctx.stroke();
            
            productImageHeight = imgHeight + 100;
            resolve();
          };
          img.onerror = reject;
          img.src = imgUrl;
        });
      } catch (error) {
        console.log('Error loading product image:', error);
      }
    }
    
    // Start position after image or from top
    let yPos = productImageHeight > 0 ? productImageHeight + 40 : 100;
    
    // Logo/Brand Name (top)
    if (posterConfig.showLogo) {
      ctx.fillStyle = posterConfig.textColor;
      ctx.font = 'bold 52px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 4;
      ctx.fillText('SHIV MOBILE HUB', w / 2, yPos);
      ctx.shadowBlur = 0;
      yPos += 70;
    }
    
    // Decorative line
    ctx.strokeStyle = posterConfig.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 200, yPos);
    ctx.lineTo(w / 2 + 200, yPos);
    ctx.stroke();
    yPos += 50;
    
    // Item Name with shadow
    ctx.fillStyle = posterConfig.accentColor;
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 6;
    const itemName = selectedItem.name || '';
    wrapText(ctx, itemName, w / 2, yPos, w - 120, 70);
    ctx.shadowBlur = 0;
    yPos += itemName.length > 20 ? 140 : 90;
    
    // Description
    if (selectedItem.description) {
      ctx.fillStyle = posterConfig.textColor;
      ctx.font = '28px Arial, sans-serif';
      ctx.textAlign = 'center';
      const desc = selectedItem.description.substring(0, 120);
      wrapText(ctx, desc, w / 2, yPos, w - 160, 38);
      yPos += 120;
    }
    
    // Price badge (if product and enabled)
    if (posterType === 'product' && posterConfig.showPrice && selectedItem.price) {
      // Price background circle
      ctx.fillStyle = posterConfig.accentColor;
      ctx.beginPath();
      ctx.arc(w / 2, yPos + 60, 100, 0, Math.PI * 2);
      ctx.fill();
      
      // Price text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`₹${selectedItem.price}`, w / 2, yPos + 75);
      
      // "Only" text
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('ONLY', w / 2, yPos + 30);
      
      yPos += 180;
    }
    
    // Features box with rounded corners
    const boxY = yPos;
    const boxHeight = 160;
    ctx.fillStyle = posterConfig.accentColor + '15';
    roundRect(ctx, 60, boxY, w - 120, boxHeight, 15);
    ctx.fill();
    
    // Features text
    ctx.fillStyle = posterConfig.textColor;
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'left';
    const features = [
      '✓ Premium Quality',
      '✓ Best Price Guarantee',
      '✓ Expert Support 24/7'
    ];
    features.forEach((feature, i) => {
      ctx.fillText(feature, 100, boxY + 50 + (i * 45));
    });
    
    yPos = boxY + boxHeight + 60;
    
    // Contact Section with icons
    if (posterConfig.showContact && settings?.contact?.phone) {
      ctx.fillStyle = posterConfig.textColor;
      ctx.font = 'bold 38px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`📞 ${settings.contact.phone}`, w / 2, yPos);
      yPos += 55;
    }
    
    if (posterConfig.showWebsite && settings?.socialMedia?.website) {
      ctx.fillStyle = posterConfig.accentColor;
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      const website = settings.socialMedia.website.replace(/^https?:\/\//, '');
      ctx.fillText(`🌐 ${website}`, w / 2, yPos);
      yPos += 50;
    }
    
    if (posterConfig.showAddress && settings?.contact?.address) {
      ctx.fillStyle = posterConfig.textColor;
      ctx.font = '26px Arial, sans-serif';
      ctx.textAlign = 'center';
      const address = `📍 ${settings.contact.address}, ${settings.contact.city}`;
      wrapText(ctx, address, w / 2, yPos, w - 100, 35);
    }
  };
  
  // Helper: Adjust color brightness
  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };
  
  // Helper: Draw rounded rectangle
  const roundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };
  
  // Helper function to wrap text
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };
  
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `poster-${selectedItem.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      Toast.success('Poster exported successfully!');
    });
  };
  
  const handleSavePoster = async () => {
    try {
      setLoading(true);
      
      const posterData = {
        title: posterConfig.title,
        type: posterType,
        [posterType === 'product' ? 'productId' : 'serviceId']: selectedItem._id,
        template,
        design: posterConfig,
        size: canvasSize
      };
      
      await apiService.request('/posters', {
        method: 'POST',
        body: JSON.stringify(posterData)
      });
      
      Toast.success('Poster saved successfully!');
      setTimeout(() => navigate('/admin/posters'), 1500);
    } catch (error) {
      console.error('Error saving poster:', error);
      Toast.error('Failed to save poster');
    } finally {
      setLoading(false);
    }
  };
  
  const templates = [
    // Modern & Professional
    { id: 'modern-blue', name: 'Modern Blue', description: 'Clean and professional', gradient: ['#3b82f6', '#1e40af'], textColor: '#ffffff', accentColor: '#60a5fa' },
    { id: 'elegant-gold', name: 'Elegant Gold', description: 'Luxury and premium', gradient: ['#fbbf24', '#d97706'], textColor: '#ffffff', accentColor: '#fcd34d' },
    { id: 'fresh-green', name: 'Fresh Green', description: 'Natural and fresh', gradient: ['#10b981', '#059669'], textColor: '#ffffff', accentColor: '#34d399' },
    { id: 'royal-purple', name: 'Royal Purple', description: 'Elegant and bold', gradient: ['#8b5cf6', '#6d28d9'], textColor: '#ffffff', accentColor: '#a78bfa' },
    { id: 'sunset-orange', name: 'Sunset Orange', description: 'Warm and energetic', gradient: ['#f97316', '#ea580c'], textColor: '#ffffff', accentColor: '#fb923c' },
    
    // Vibrant & Colorful
    { id: 'vibrant-pink', name: 'Vibrant Pink', description: 'Bold and playful', gradient: ['#ec4899', '#db2777'], textColor: '#ffffff', accentColor: '#f9a8d4' },
    { id: 'electric-cyan', name: 'Electric Cyan', description: 'Modern and tech', gradient: ['#06b6d4', '#0891b2'], textColor: '#ffffff', accentColor: '#22d3ee' },
    { id: 'fire-red', name: 'Fire Red', description: 'Passionate and strong', gradient: ['#ef4444', '#dc2626'], textColor: '#ffffff', accentColor: '#f87171' },
    { id: 'ocean-blue', name: 'Ocean Blue', description: 'Deep and calming', gradient: ['#0ea5e9', '#0284c7'], textColor: '#ffffff', accentColor: '#38bdf8' },
    { id: 'neon-lime', name: 'Neon Lime', description: 'Fresh and energetic', gradient: ['#84cc16', '#65a30d'], textColor: '#ffffff', accentColor: '#a3e635' },
    
    // Dark & Sophisticated
    { id: 'midnight-dark', name: 'Midnight Dark', description: 'Sleek and modern', gradient: ['#1e293b', '#0f172a'], textColor: '#ffffff', accentColor: '#3b82f6' },
    { id: 'carbon-black', name: 'Carbon Black', description: 'Premium and bold', gradient: ['#18181b', '#09090b'], textColor: '#ffffff', accentColor: '#fbbf24' },
    { id: 'dark-purple', name: 'Dark Purple', description: 'Mysterious luxury', gradient: ['#581c87', '#3b0764'], textColor: '#ffffff', accentColor: '#c084fc' },
    { id: 'navy-night', name: 'Navy Night', description: 'Professional dark', gradient: ['#1e3a8a', '#1e40af'], textColor: '#ffffff', accentColor: '#60a5fa' },
    { id: 'forest-dark', name: 'Forest Dark', description: 'Natural elegance', gradient: ['#14532d', '#166534'], textColor: '#ffffff', accentColor: '#4ade80' },
    
    // Light & Minimal
    { id: 'pure-white', name: 'Pure White', description: 'Minimal and clean', gradient: ['#ffffff', '#f8fafc'], textColor: '#000000', accentColor: '#3b82f6' },
    { id: 'soft-beige', name: 'Soft Beige', description: 'Warm and cozy', gradient: ['#fef3c7', '#fde68a'], textColor: '#78350f', accentColor: '#d97706' },
    { id: 'pastel-pink', name: 'Pastel Pink', description: 'Soft and feminine', gradient: ['#fce7f3', '#fbcfe8'], textColor: '#831843', accentColor: '#ec4899' },
    { id: 'mint-fresh', name: 'Mint Fresh', description: 'Cool and light', gradient: ['#d1fae5', '#a7f3d0'], textColor: '#064e3b', accentColor: '#10b981' },
    { id: 'sky-blue', name: 'Sky Blue', description: 'Bright and airy', gradient: ['#dbeafe', '#bfdbfe'], textColor: '#1e3a8a', accentColor: '#3b82f6' },
    
    // Gradient Specials
    { id: 'rainbow-gradient', name: 'Rainbow Burst', description: 'Colorful celebration', gradient: ['#ec4899', '#8b5cf6', '#3b82f6'], textColor: '#ffffff', accentColor: '#fbbf24' },
    { id: 'tropical-sunset', name: 'Tropical Sunset', description: 'Warm paradise', gradient: ['#f97316', '#ec4899', '#8b5cf6'], textColor: '#ffffff', accentColor: '#fbbf24' },
    { id: 'aurora-lights', name: 'Aurora Lights', description: 'Magical glow', gradient: ['#06b6d4', '#8b5cf6', '#ec4899'], textColor: '#ffffff', accentColor: '#fbbf24' },
    { id: 'summer-vibes', name: 'Summer Vibes', description: 'Bright and happy', gradient: ['#fbbf24', '#f97316', '#ec4899'], textColor: '#ffffff', accentColor: '#ffffff' },
    { id: 'cool-breeze', name: 'Cool Breeze', description: 'Fresh and calm', gradient: ['#10b981', '#06b6d4', '#3b82f6'], textColor: '#ffffff', accentColor: '#fbbf24' },
    
    // Special Effects
    { id: 'metallic-silver', name: 'Metallic Silver', description: 'Sleek and shiny', gradient: ['#e5e7eb', '#9ca3af'], textColor: '#000000', accentColor: '#3b82f6' },
    { id: 'rose-gold', name: 'Rose Gold', description: 'Elegant and trendy', gradient: ['#fecaca', '#fca5a5'], textColor: '#7f1d1d', accentColor: '#dc2626' },
    { id: 'champagne', name: 'Champagne', description: 'Luxury celebration', gradient: ['#fef3c7', '#fde68a'], textColor: '#78350f', accentColor: '#d97706' },
    { id: 'cosmic-purple', name: 'Cosmic Purple', description: 'Space and mystery', gradient: ['#312e81', '#1e1b4b'], textColor: '#ffffff', accentColor: '#c084fc' },
    { id: 'emerald-dream', name: 'Emerald Dream', description: 'Rich and vibrant', gradient: ['#059669', '#047857'], textColor: '#ffffff', accentColor: '#34d399' },
    
    // Business & Corporate
    { id: 'corporate-blue', name: 'Corporate Blue', description: 'Professional trust', gradient: ['#1e40af', '#1e3a8a'], textColor: '#ffffff', accentColor: '#60a5fa' },
    { id: 'business-gray', name: 'Business Gray', description: 'Sleek corporate', gradient: ['#4b5563', '#374151'], textColor: '#ffffff', accentColor: '#3b82f6' },
    { id: 'executive-black', name: 'Executive Black', description: 'Premium business', gradient: ['#27272a', '#18181b'], textColor: '#ffffff', accentColor: '#fbbf24' }
  ];
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Poster Generator
          </h1>
          <p className="text-muted-foreground">
            Create stunning posters for social media and WhatsApp status
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Select Item' },
            { num: 2, label: 'Choose Template' },
            { num: 3, label: 'Design & Export' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= s.num ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                }`}>
                  {s.num}
                </div>
                <span className="ml-2 font-medium">{s.label}</span>
              </div>
              {idx < 2 && <div className={`w-20 h-0.5 mx-4 ${step > s.num ? 'bg-primary' : 'bg-muted-foreground'}`} />}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step 1: Select Item */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select Item Type</h2>
            
            <div className="flex gap-4 mb-6">
              <Button
                variant={posterType === 'product' ? 'default' : 'outline'}
                onClick={() => handlePosterTypeChange('product')}
                className="flex-1"
              >
                <Icon name="ShoppingBag" size={18} className="mr-2" />
                Product Poster
              </Button>
              <Button
                variant={posterType === 'service' ? 'default' : 'outline'}
                onClick={() => handlePosterTypeChange('service')}
                className="flex-1"
              >
                <Icon name="Wrench" size={18} className="mr-2" />
                Service Poster
              </Button>
            </div>
            
            {/* Selected Item Display */}
            {selectedItem ? (
              <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Selected {posterType === 'product' ? 'Product' : 'Service'}</h3>
                  <Button onClick={openModal} variant="outline" size="sm">
                    <Icon name="Edit" size={16} className="mr-2" />
                    Change
                  </Button>
                </div>
                <div className="flex gap-4">
                  {selectedItem.images && selectedItem.images[0] && (
                    <img
                      src={selectedItem.images[0].url || selectedItem.images[0]}
                      alt={selectedItem.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">{selectedItem.name}</h4>
                    {posterType === 'product' && selectedItem.price && (
                      <p className="text-primary font-bold">₹{selectedItem.price}</p>
                    )}
                    {selectedItem.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{selectedItem.description}</p>
                    )}
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="mt-4 w-full">
                  Continue to Template Selection
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No {posterType} Selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a {posterType} to create a poster
                </p>
                <Button onClick={openModal} size="lg">
                  <Icon name="Search" size={18} className="mr-2" />
                  Browse {posterType === 'product' ? 'Products' : 'Services'}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Select {posterType === 'product' ? 'Product' : 'Service'}</h2>
                  <p className="text-muted-foreground">Choose an item to create a poster</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : itemsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-3" />
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Items</h3>
                    <p className="text-red-700">{itemsError}</p>
                    <Button onClick={loadItems} className="mt-4">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : items.length === 0 ? (
                  <div className="bg-muted/30 border border-border rounded-lg p-12 text-center">
                    <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold mb-2">No {posterType}s Available</h3>
                    <p className="text-muted-foreground mb-4">
                      There are no {posterType}s in the database. Please add some {posterType}s first from the {posterType}s management page.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can add {posterType}s from: Admin Menu → {posterType === 'product' ? 'Products' : 'Services'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectItem(item)}
                        className={`border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
                          selectedItem?._id === item._id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {item.images && item.images[0] && (
                          <img
                            src={item.images[0].url || item.images[0]}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-md mb-3"
                          />
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            {posterType === 'product' && item.price && (
                              <p className="text-primary font-bold">₹{item.price}</p>
                            )}
                          </div>
                          {selectedItem?._id === item._id && (
                            <Icon name="CheckCircle2" size={20} className="text-primary" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Choose Size & Template */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-lg p-6">
            {/* Size Selector */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Poster Size</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(posterSizes).map(([key, size]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSize === key 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon name={size.icon} size={24} className={`mx-auto mb-2 ${selectedSize === key ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`text-xs text-center font-medium ${selectedSize === key ? 'text-primary' : ''}`}>
                      {size.name}
                    </p>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      {size.width} × {size.height}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Template Selector */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose Template ({templates.length} Beautiful Designs)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleTemplateSelect(t.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
                      template === t.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {/* Gradient Preview */}
                    <div
                      className="w-full h-24 rounded-lg mb-3"
                      style={{
                        background: t.gradient.length === 1 
                          ? t.gradient[0]
                          : `linear-gradient(135deg, ${t.gradient.join(', ')})`
                      }}
                    />
                    <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                    {template === t.id && (
                      <div className="mt-2 flex items-center justify-center">
                        <Icon name="CheckCircle2" size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Back
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Design & Export */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Preview */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                
                <div className="flex justify-center bg-muted/30 p-6 rounded-lg">
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="max-w-full h-auto border-2 border-border shadow-2xl"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleExportPNG} className="flex-1">
                    <Icon name="Download" size={18} className="mr-2" />
                    Export as PNG
                  </Button>
                  <Button onClick={handleSavePoster} variant="outline" disabled={loading}>
                    <Icon name="Save" size={18} className="mr-2" />
                    Save Poster
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Poster Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={posterConfig.title}
                      onChange={(e) => setPosterConfig({ ...posterConfig, title: e.target.value })}
                      placeholder="Poster title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <input
                      type="color"
                      value={posterConfig.backgroundColor}
                      onChange={(e) => setPosterConfig({ ...posterConfig, backgroundColor: e.target.value })}
                      className="w-full h-10 rounded border border-border cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <input
                      type="color"
                      value={posterConfig.textColor}
                      onChange={(e) => setPosterConfig({ ...posterConfig, textColor: e.target.value })}
                      className="w-full h-10 rounded border border-border cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Accent Color</label>
                    <input
                      type="color"
                      value={posterConfig.accentColor}
                      onChange={(e) => setPosterConfig({ ...posterConfig, accentColor: e.target.value })}
                      className="w-full h-10 rounded border border-border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Show Elements</h3>
                
                <div className="space-y-2">
                  {[
                    { key: 'showLogo', label: 'Logo/Brand' },
                    { key: 'showPrice', label: 'Price', condition: posterType === 'product' },
                    { key: 'showContact', label: 'Contact' },
                    { key: 'showAddress', label: 'Address' },
                    { key: 'showWebsite', label: 'Website' }
                  ].map((item) => {
                    if (item.condition === false) return null;
                    return (
                      <label key={item.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={posterConfig[item.key]}
                          onChange={(e) => setPosterConfig({ ...posterConfig, [item.key]: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <Button variant="outline" onClick={() => setStep(2)} className="w-full">
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Change Template
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterGenerator;
