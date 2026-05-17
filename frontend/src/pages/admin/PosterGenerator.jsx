import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import { motion } from 'framer-motion';
import { getPosterTemplates } from './posterTemplates';

// Draggable Element Component
const DraggableElement = ({ element, isSelected, onSelect, onUpdate, posterSize }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnd = (event, info) => {
    const newX = Math.max(0, Math.min(100, element.x + (info.offset.x / posterSize.width) * 100));
    const newY = Math.max(0, Math.min(100, element.y + (info.offset.y / posterSize.height) * 100));
    
    onUpdate(element.id, { x: newX, y: newY });
    setIsDragging(false);
  };
  
  const renderContent = () => {
    switch (element.type) {
      case 'title':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              textAlign: element.textAlign,
              fontFamily: element.fontFamily,
            }}
          >
            {element.content}
          </div>
        );
      
      case 'text':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              textAlign: element.textAlign,
              fontFamily: element.fontFamily,
            }}
          >
            {element.content}
          </div>
        );
      
      case 'image':
        return (
          <img
            src={element.src}
            alt="Product"
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              objectFit: 'cover',
              borderRadius: `${element.borderRadius}px`,
              border: element.border ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
            }}
          />
        );
      
      case 'price':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
              padding: `${element.padding}px`,
              borderRadius: `${element.borderRadius}px`,
              textAlign: 'center',
            }}
          >
            ₹{element.content}
          </div>
        );
      
      case 'badge':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
              padding: `${element.padding}px ${element.padding * 2}px`,
              borderRadius: `${element.borderRadius}px`,
            }}
          >
            {element.content}
          </div>
        );
      
      case 'box':
        return (
          <div
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor: element.backgroundColor,
              borderRadius: `${element.borderRadius}px`,
              border: element.border ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
            }}
          />
        );
      
      default:
        return <div>{element.content}</div>;
    }
  };
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setIsDragging(true);
        onSelect(element.id);
      }}
      onDragEnd={handleDragEnd}
      onClick={() => !isDragging && onSelect(element.id)}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        cursor: 'move',
        zIndex: element.zIndex || 1,
        opacity: element.opacity || 1,
        transform: `rotate(${element.rotation || 0}deg)`,
      }}
      className={`${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} ${element.type === 'box' ? '' : 'inline-block'}`}
      whileHover={{ scale: 1.02 }}
    >
      {renderContent()}
    </motion.div>
  );
};

const PosterGenerator = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [posterType, setPosterType] = useState('product');
  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedSize, setSelectedSize] = useState('instagram-square');
  
  const [posterElements, setPosterElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const posterRef = useRef(null);
  
  const posterSizes = {
    'instagram-square': { width: 1080, height: 1080, name: 'Instagram Square (1:1)', icon: 'Square', displayWidth: 600, displayHeight: 600 },
    'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story (9:16)', icon: 'Smartphone', displayWidth: 400, displayHeight: 711 },
    'facebook-post': { width: 1200, height: 630, name: 'Facebook Post (1.91:1)', icon: 'Facebook', displayWidth: 600, displayHeight: 315 },
    'twitter-post': { width: 1200, height: 675, name: 'Twitter Post (16:9)', icon: 'Twitter', displayWidth: 600, displayHeight: 338 },
    'whatsapp-status': { width: 1080, height: 1920, name: 'WhatsApp Status (9:16)', icon: 'MessageCircle', displayWidth: 400, displayHeight: 711 },
    'youtube-thumbnail': { width: 1280, height: 720, name: 'YouTube Thumbnail (16:9)', icon: 'Youtube', displayWidth: 600, displayHeight: 338 },
    'pinterest-pin': { width: 1000, height: 1500, name: 'Pinterest Pin (2:3)', icon: 'Image', displayWidth: 500, displayHeight: 750 },
    'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post', icon: 'Linkedin', displayWidth: 600, displayHeight: 314 },
  };
  
  const canvasSize = posterSizes[selectedSize];

  // 16+ Professional Template Designs
  const templates = getPosterTemplates(canvasSize);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Load items
  useEffect(() => {
    if (step === 1 && items.length === 0 && !loading) {
      loadItems();
    }
  }, [posterType, step]);

  // Auto-open modal on step 1
  useEffect(() => {
    if (step === 1 && !selectedItem && items.length > 0 && !loading) {
      setShowModal(true);
    }
  }, [step, items, selectedItem, loading]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setItemsError(null);
      const response = await apiService.request(`/${posterType}s`);
      
      let itemsArray = [];
      if (response?.data?.[`${posterType}s`]) {
        itemsArray = response.data[`${posterType}s`];
      } else if (Array.isArray(response?.data)) {
        itemsArray = response.data;
      } else if (response?.[`${posterType}s`]) {
        itemsArray = response[`${posterType}s`];
      }
      
      if (Array.isArray(itemsArray) && itemsArray.length > 0) {
        setItems(itemsArray);
        setItemsError(null);
      } else {
        setItems([]);
        setItemsError(`No ${posterType}s available. Please add some ${posterType}s first.`);
      }
    } catch (error) {
      console.error(`Error loading ${posterType}s:`, error);
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
    
    // Initialize poster elements from template layout
    const layout = selectedTemplate.getLayout(selectedItem);
    setPosterElements(layout);
    setSelectedElement(null);
    setStep(3);
  };

  const handleElementUpdate = (elementId, updates) => {
    setPosterElements(prev =>
      prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
    );
  };

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
  };

  const updateSelectedElementProperty = (property, value) => {
    if (!selectedElement) return;
    handleElementUpdate(selectedElement, { [property]: value });
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    setPosterElements(prev => prev.filter(el => el.id !== selectedElement));
    setSelectedElement(null);
  };

  const addNewElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 25,
      y: 25,
      zIndex: posterElements.length + 1,
      ...getDefaultPropertiesForType(type)
    };
    setPosterElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const getDefaultPropertiesForType = (type) => {
    switch (type) {
      case 'text':
        return {
          content: 'New Text',
          fontSize: 24,
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left',
          fontFamily: 'Arial',
        };
      case 'title':
        return {
          content: 'New Title',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'center',
          fontFamily: 'Arial',
        };
      case 'price':
        return {
          content: '999',
          fontSize: 36,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#3b82f6',
          padding: 15,
          borderRadius: 10,
        };
      case 'badge':
        return {
          content: 'NEW',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#ef4444',
          padding: 8,
          borderRadius: 5,
        };
      case 'box':
        return {
          width: 200,
          height: 100,
          backgroundColor: '#3b82f6',
          borderRadius: 10,
          border: false,
          borderWidth: 2,
          borderColor: '#000000',
        };
      default:
        return {};
    }
  };

  const exportPoster = async () => {
    try {
      const posterElement = document.getElementById('poster-canvas');
      if (!posterElement) {
        Toast.error('Poster not found');
        return;
      }

      // Use html2canvas if available, otherwise use native canvas
      if (window.html2canvas) {
        const canvas = await window.html2canvas(posterElement, {
          backgroundColor: null,
          scale: 2, // Higher quality
          logging: false
        });
        
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Toast.success('Poster exported successfully!');
      } else {
        // Fallback: Manual canvas rendering
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width * 2; // 2x for better quality
        canvas.height = canvasSize.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        // Draw each element
        for (const element of posterElements) {
          await drawElement(ctx, element);
        }

        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Toast.success('Poster exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      Toast.error('Export failed: ' + error.message);
    }
  };

  // Helper function to draw elements on canvas
  const drawElement = async (ctx, element) => {
    const x = (element.x / 100) * canvasSize.displayWidth;
    const y = (element.y / 100) * canvasSize.displayHeight;

    switch (element.type) {
      case 'box':
        ctx.fillStyle = element.backgroundColor || '#ffffff';
        if (element.borderRadius) {
          drawRoundedRect(ctx, x, y, element.width || canvasSize.displayWidth, element.height || canvasSize.displayHeight, element.borderRadius);
        } else {
          ctx.fillRect(x, y, element.width || canvasSize.displayWidth, element.height || canvasSize.displayHeight);
        }
        break;

      case 'image':
        if (element.src) {
          try {
            const img = await loadImage(element.src);
            const width = element.width || 300;
            const height = element.height || 300;
            
            ctx.save();
            if (element.borderRadius) {
              drawRoundedRect(ctx, x, y, width, height, element.borderRadius, true);
              ctx.clip();
            }
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
          } catch (err) {
            console.error('Failed to load image:', element.src, err);
          }
        }
        break;

      case 'title':
      case 'text':
      case 'price':
      case 'badge':
        ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.color || '#000000';
        ctx.textAlign = element.textAlign || 'left';
        
        if (element.backgroundColor && element.backgroundColor !== 'transparent') {
          const metrics = ctx.measureText(element.content || '');
          const padding = element.padding || 0;
          ctx.fillStyle = element.backgroundColor;
          if (element.borderRadius) {
            drawRoundedRect(ctx, x - padding, y - element.fontSize, metrics.width + (padding * 2), element.fontSize + (padding * 2), element.borderRadius);
          } else {
            ctx.fillRect(x - padding, y - element.fontSize, metrics.width + (padding * 2), element.fontSize + (padding * 2));
          }
          ctx.fillStyle = element.color || '#000000';
        }
        
        ctx.fillText(element.content || '', x, y);
        break;
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawRoundedRect = (ctx, x, y, width, height, radius, clip = false) => {
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
    if (!clip) {
      ctx.fill();
    }
  };

  const savePoster = async () => {
    try {
      setLoading(true);
      
      const posterData = {
        title: selectedItem.name,
        type: posterType,
        [posterType === 'product' ? 'productId' : 'serviceId']: selectedItem._id,
        template,
        design: {
          elements: posterElements,
          size: canvasSize,
        },
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

  const selectedElementData = posterElements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Poster Generator</h1>
          <p className="text-muted-foreground mt-2">Create beautiful posters with drag & drop editor</p>
        </div>

        {/* Steps */}
        <div className="mb-8 flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              <span className={step >= s ? 'font-semibold' : 'text-muted-foreground'}>
                {s === 1 ? 'Select Item' : s === 2 ? 'Choose Template' : 'Design'}
              </span>
              {s < 3 && <Icon name="ChevronRight" size={20} className="text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Item */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Poster Type</h2>
              <div className="flex gap-4">
                <Button
                  variant={posterType === 'product' ? 'default' : 'outline'}
                  onClick={() => handlePosterTypeChange('product')}
                >
                  <Icon name="Package" size={18} className="mr-2" />
                  Product Poster
                </Button>
                <Button
                  variant={posterType === 'service' ? 'default' : 'outline'}
                  onClick={() => handlePosterTypeChange('service')}
                >
                  <Icon name="Briefcase" size={18} className="mr-2" />
                  Service Poster
                </Button>
              </div>
            </div>

            {selectedItem ? (
              <div className="text-center py-8">
                <div className="inline-block">
                  {selectedItem.images && selectedItem.images.length > 0 && (
                    <img
                      src={selectedItem.images[0].url || selectedItem.images[0]}
                      alt={selectedItem.name}
                      className="w-48 h-48 object-cover rounded-lg mb-4 mx-auto"
                    />
                  )}
                  <h3 className="text-2xl font-bold mb-2">{selectedItem.name}</h3>
                  {posterType === 'product' && selectedItem.price && (
                    <p className="text-xl text-primary font-semibold mb-4">₹{selectedItem.price}</p>
                  )}
                  <div className="flex gap-2 justify-center">
                    <Button onClick={openModal} variant="outline" size="sm">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Change
                    </Button>
                    <Button onClick={() => setStep(2)} size="lg">
                      Continue to Template Selection
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No {posterType} Selected</h3>
                <p className="text-muted-foreground mb-6">Select a {posterType} to create a poster</p>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">
                  Select {posterType === 'product' ? 'Product' : 'Service'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
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
                        {item.images && item.images.length > 0 && (
                          <img
                            src={item.images[0].url || item.images[0]}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                          {selectedItem?._id === item._id && (
                            <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0" />
                          )}
                        </div>
                        {posterType === 'product' && item.price && (
                          <p className="text-primary font-semibold mt-2">₹{item.price}</p>
                        )}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <h2 className="text-xl font-semibold mb-4">Choose Design Template ({templates.length} Layouts)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleTemplateSelect(t.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
                      template === t.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${t.gradient.join(', ')})`
                      }}
                    >
                      {t.category || t.name}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{t.name}</h3>
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

        {/* Step 3: Design with Drag & Drop */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Poster Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Design Your Poster</h2>
                    <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                      <Icon name="Palette" size={16} className="mr-2" />
                      Change Template
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportPoster}>
                      <Icon name="Download" size={16} className="mr-2" />
                      Export PNG
                    </Button>
                    <Button onClick={savePoster} disabled={loading}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Save Poster
                    </Button>
                  </div>
                </div>
                
                {/* Canvas */}
                <div className="flex justify-center bg-muted/30 p-8 rounded-lg">
                  <div
                    ref={posterRef}
                    className="relative bg-white shadow-2xl overflow-hidden"
                    style={{
                      width: `${canvasSize.displayWidth}px`,
                      height: `${canvasSize.displayHeight}px`,
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setSelectedElement(null);
                      }
                    }}
                  >
                    {posterElements.map((element) => (
                      <DraggableElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElement === element.id}
                        onSelect={handleElementSelect}
                        onUpdate={handleElementUpdate}
                        posterSize={canvasSize}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Add Elements Toolbar */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => addNewElement('text')}>
                    <Icon name="Type" size={16} className="mr-2" />
                    Add Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addNewElement('title')}>
                    <Icon name="Heading" size={16} className="mr-2" />
                    Add Title
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addNewElement('price')}>
                    <Icon name="DollarSign" size={16} className="mr-2" />
                    Add Price
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addNewElement('badge')}>
                    <Icon name="Tag" size={16} className="mr-2" />
                    Add Badge
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addNewElement('box')}>
                    <Icon name="Square" size={16} className="mr-2" />
                    Add Box
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedElementData ? 'Element Properties' : 'Select an element'}
                </h3>
                
                {selectedElementData ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <div className="px-3 py-2 bg-muted rounded capitalize">
                        {selectedElementData.type}
                      </div>
                    </div>
                    
                    {/* Text/Title Content */}
                    {['text', 'title', 'price', 'badge'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Input
                          value={selectedElementData.content || ''}
                          onChange={(e) => updateSelectedElementProperty('content', e.target.value)}
                        />
                      </div>
                    )}
                    
                    {/* Font Size */}
                    {['text', 'title', 'price', 'badge'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Font Size: {selectedElementData.fontSize}px</label>
                        <input
                          type="range"
                          min="12"
                          max="120"
                          value={selectedElementData.fontSize || 24}
                          onChange={(e) => updateSelectedElementProperty('fontSize', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {/* Font Weight */}
                    {['text', 'title', 'price', 'badge'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Font Weight</label>
                        <select
                          value={selectedElementData.fontWeight || 'normal'}
                          onChange={(e) => updateSelectedElementProperty('fontWeight', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="lighter">Light</option>
                        </select>
                      </div>
                    )}
                    
                    {/* Text Color */}
                    {['text', 'title', 'price', 'badge'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Text Color</label>
                        <input
                          type="color"
                          value={selectedElementData.color || '#000000'}
                          onChange={(e) => updateSelectedElementProperty('color', e.target.value)}
                          className="w-full h-10 rounded"
                        />
                      </div>
                    )}
                    
                    {/* Background Color */}
                    {['price', 'badge', 'box'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Background Color</label>
                        <input
                          type="color"
                          value={selectedElementData.backgroundColor || '#ffffff'}
                          onChange={(e) => updateSelectedElementProperty('backgroundColor', e.target.value)}
                          className="w-full h-10 rounded"
                        />
                      </div>
                    )}
                    
                    {/* Border Radius */}
                    {['price', 'badge', 'box', 'image'].includes(selectedElementData.type) && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Border Radius: {selectedElementData.borderRadius || 0}px</label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={selectedElementData.borderRadius || 0}
                          onChange={(e) => updateSelectedElementProperty('borderRadius', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {/* Size for Box */}
                    {['box'].includes(selectedElementData.type) && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Width: {selectedElementData.width}px</label>
                          <input
                            type="range"
                            min="50"
                            max="800"
                            value={selectedElementData.width || 200}
                            onChange={(e) => updateSelectedElementProperty('width', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Height: {selectedElementData.height}px</label>
                          <input
                            type="range"
                            min="50"
                            max="800"
                            value={selectedElementData.height || 100}
                            onChange={(e) => updateSelectedElementProperty('height', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Z-Index */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Layer (Z-Index): {selectedElementData.zIndex || 1}</label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={selectedElementData.zIndex || 1}
                        onChange={(e) => updateSelectedElementProperty('zIndex', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Delete */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={deleteSelectedElement}
                      className="w-full"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Delete Element
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click on any element in the poster to edit its properties
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterGenerator;
