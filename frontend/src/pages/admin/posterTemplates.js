// WORLD'S BEST PROFESSIONAL POSTER TEMPLATES
// Inspired by Apple, Nike, Samsung, Amazon, Flipkart designs
export const getPosterTemplates = (canvasSize) => [
  
  // === APPLE STYLE - Minimalist Premium ===
  {
    id: 'apple-minimal-white',
    name: '🍎 Apple Minimal White',
    description: 'Ultra-clean Apple-inspired design',
    category: 'Premium',
    gradient: ['#ffffff', '#f5f5f7'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'image', x: 10, y: 5, width: 480, height: 480, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 87, content: item?.name || 'Product Name', fontSize: 52, fontWeight: '600', color: '#1d1d1f', textAlign: 'center', fontFamily: 'SF Pro Display, Arial', zIndex: 3 },
      { id: 4, type: 'text', x: 15, y: 93, content: item?.description?.substring(0, 60) || 'The ultimate experience.', fontSize: 18, fontWeight: 'normal', color: '#86868b', textAlign: 'center', fontFamily: 'SF Pro Display, Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 42, y: 97, content: `From ₹${item?.price || '999'}`, fontSize: 24, fontWeight: '500', color: '#1d1d1f', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  
  {
    id: 'apple-dark-premium',
    name: '🌙 Apple Dark Premium',
    description: 'Sleek dark Apple aesthetic',
    category: 'Premium',
    gradient: ['#000000', '#1d1d1f'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#000000', zIndex: 0 },
      { id: 2, type: 'image', x: 10, y: 8, width: 480, height: 480, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 87, content: item?.name || 'Product Name', fontSize: 48, fontWeight: '600', color: '#f5f5f7', textAlign: 'center', fontFamily: 'SF Pro Display, Arial', zIndex: 3 },
      { id: 4, type: 'text', x: 15, y: 93, content: 'Designed to make a difference.', fontSize: 16, fontWeight: 'normal', color: '#a1a1a6', textAlign: 'center', fontFamily: 'SF Pro Display, Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 42, y: 97, content: `₹${item?.price || '999'}`, fontSize: 28, fontWeight: '600', color: '#f5f5f7', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === NIKE STYLE - Bold & Dynamic ===
  {
    id: 'nike-bold-orange',
    name: '⚡ Nike Bold Orange',
    description: 'High-energy Nike-inspired',
    category: 'Sports',
    gradient: ['#ff6b00', '#ff8800'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ff6b00', zIndex: 0 },
      { id: 2, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight * 0.15, backgroundColor: '#000000', zIndex: 1 },
      { id: 3, type: 'title', x: 5, y: 3, content: 'JUST DO IT', fontSize: 32, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', zIndex: 3 },
      { id: 4, type: 'image', x: 15, y: 25, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 5, type: 'title', x: 5, y: 80, content: item?.name || 'PRODUCT NAME', fontSize: 44, fontWeight: 'bold', color: '#000000', textAlign: 'left', fontFamily: 'Arial Black', zIndex: 3 },
      { id: 6, type: 'price', x: 5, y: 92, content: `₹${item?.price || '999'}`, fontSize: 56, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#000000', padding: 10, borderRadius: 0, zIndex: 3 },
    ]
  },

  {
    id: 'nike-black-white',
    name: '⚫ Nike Black & White',
    description: 'Classic Nike monochrome',
    category: 'Sports',
    gradient: ['#000000', '#ffffff'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth * 0.5, height: canvasSize.displayHeight, backgroundColor: '#000000', zIndex: 1 },
      { id: 3, type: 'title', x: 2, y: 10, content: item?.name || 'PRODUCT', fontSize: 38, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial Black', zIndex: 3 },
      { id: 4, type: 'image', x: 52, y: 15, width: 280, height: 280, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 5, type: 'price', x: 5, y: 85, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 6, type: 'badge', x: 55, y: 85, content: 'NEW', fontSize: 28, fontWeight: 'bold', color: '#000000', backgroundColor: '#ffffff', padding: 12, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === SAMSUNG STYLE - Modern Tech ===
  {
    id: 'samsung-gradient-blue',
    name: '📱 Samsung Gradient Blue',
    description: 'Sleek Samsung-inspired tech',
    category: 'Tech',
    gradient: ['#1428a0', '#0c1d7a', '#00d4ff'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#0c1d7a', zIndex: 0 },
      { id: 2, type: 'box', x: 5, y: 5, width: canvasSize.displayWidth * 0.9, height: canvasSize.displayHeight * 0.9, backgroundColor: '#1428a0', borderRadius: 30, zIndex: 1 },
      { id: 3, type: 'image', x: 20, y: 12, width: 350, height: 350, src: item?.images?.[0]?.url || '', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'title', x: 10, y: 72, content: item?.name || 'Galaxy Product', fontSize: 42, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', fontFamily: 'Samsung Sharp Sans', zIndex: 3 },
      { id: 5, type: 'text', x: 15, y: 82, content: 'Innovation that inspires', fontSize: 18, fontWeight: 'normal', color: '#00d4ff', textAlign: 'center', fontFamily: 'Samsung Sharp Sans', zIndex: 3 },
      { id: 6, type: 'price', x: 35, y: 90, content: `₹${item?.price || '999'}`, fontSize: 40, fontWeight: 'bold', color: '#00d4ff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === AMAZON STYLE - E-commerce Pro ===
  {
    id: 'amazon-deal-orange',
    name: '📦 Amazon Deal Style',
    description: 'Amazon-inspired deal card',
    category: 'E-Commerce',
    gradient: ['#ff9900', '#ffb84d'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'badge', x: 5, y: 3, content: "Today's Deal", fontSize: 22, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#c7511f', padding: 10, borderRadius: 5, zIndex: 4 },
      { id: 3, type: 'box', x: 5, y: 12, width: canvasSize.displayWidth * 0.9, height: canvasSize.displayHeight * 0.75, backgroundColor: '#f7f7f7', borderRadius: 15, zIndex: 1 },
      { id: 4, type: 'image', x: 15, y: 20, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 10, zIndex: 2 },
      { id: 5, type: 'title', x: 10, y: 75, content: item?.name || 'Product Name', fontSize: 32, fontWeight: 'bold', color: '#0f1111', textAlign: 'left', fontFamily: 'Amazon Ember', zIndex: 3 },
      { id: 6, type: 'badge', x: 10, y: 84, content: '40% OFF', fontSize: 24, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#cc0c39', padding: 8, borderRadius: 5, zIndex: 3 },
      { id: 7, type: 'price', x: 35, y: 84, content: `₹${item?.price || '999'}`, fontSize: 42, fontWeight: 'bold', color: '#b12704', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === FLIPKART STYLE - Indian E-commerce ===
  {
    id: 'flipkart-blue-card',
    name: '🛒 Flipkart Blue Card',
    description: 'Flipkart-inspired design',
    category: 'E-Commerce',
    gradient: ['#2874f0', '#1c5bbf'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#2874f0', zIndex: 0 },
      { id: 2, type: 'box', x: 5, y: 8, width: canvasSize.displayWidth * 0.9, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 15, zIndex: 1 },
      { id: 3, type: 'badge', x: 10, y: 12, content: 'SUPER SAVER', fontSize: 18, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#ff9f00', padding: 8, borderRadius: 5, zIndex: 4 },
      { id: 4, type: 'image', x: 15, y: 22, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 10, zIndex: 2 },
      { id: 5, type: 'title', x: 10, y: 75, content: item?.name || 'Product Name', fontSize: 34, fontWeight: 'bold', color: '#212121', textAlign: 'left', fontFamily: 'Roboto', zIndex: 3 },
      { id: 6, type: 'price', x: 10, y: 85, content: `₹${item?.price || '999'}`, fontSize: 44, fontWeight: 'bold', color: '#388e3c', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 7, type: 'badge', x: 65, y: 86, content: 'Free Delivery', fontSize: 16, fontWeight: 'bold', color: '#2874f0', backgroundColor: '#e0f0ff', padding: 8, borderRadius: 5, zIndex: 3 },
    ]
  },

  // === INSTAGRAM STYLE - Social Media ===
  {
    id: 'instagram-gradient-card',
    name: '📸 Instagram Gradient',
    description: 'Instagram-inspired gradient',
    category: 'Social',
    gradient: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#f09433', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 25, zIndex: 1 },
      { id: 3, type: 'image', x: 18, y: 15, width: 380, height: 380, src: item?.images?.[0]?.url || '', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'title', x: 12, y: 75, content: item?.name || 'Product Name', fontSize: 36, fontWeight: 'bold', color: '#262626', textAlign: 'center', fontFamily: 'Instagram Sans', zIndex: 3 },
      { id: 5, type: 'text', x: 15, y: 83, content: '❤️ Shop Now', fontSize: 20, fontWeight: '600', color: '#e1306c', textAlign: 'center', fontFamily: 'Instagram Sans', zIndex: 3 },
      { id: 6, type: 'price', x: 38, y: 90, content: `₹${item?.price || '999'}`, fontSize: 38, fontWeight: 'bold', color: '#262626', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === SPOTIFY STYLE - Music/Entertainment ===
  {
    id: 'spotify-green-dark',
    name: '🎵 Spotify Green Dark',
    description: 'Spotify-inspired dark theme',
    category: 'Entertainment',
    gradient: ['#1db954', '#1ed760'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#121212', zIndex: 0 },
      { id: 2, type: 'box', x: 5, y: 5, width: canvasSize.displayWidth * 0.9, height: canvasSize.displayHeight * 0.9, backgroundColor: '#181818', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'image', x: 20, y: 15, width: 350, height: 350, src: item?.images?.[0]?.url || '', borderRadius: 15, zIndex: 2 },
      { id: 4, type: 'title', x: 10, y: 75, content: item?.name || 'Product Name', fontSize: 40, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Circular Std', zIndex: 3 },
      { id: 5, type: 'text', x: 10, y: 84, content: 'Premium Quality', fontSize: 18, fontWeight: 'normal', color: '#b3b3b3', textAlign: 'left', fontFamily: 'Circular Std', zIndex: 3 },
      { id: 6, type: 'price', x: 10, y: 91, content: `₹${item?.price || '999'}`, fontSize: 36, fontWeight: 'bold', color: '#1db954', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === NETFLIX STYLE - Entertainment ===
  {
    id: 'netflix-red-black',
    name: '🎬 Netflix Red Black',
    description: 'Netflix-inspired dramatic',
    category: 'Entertainment',
    gradient: ['#e50914', '#b20710'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#000000', zIndex: 0 },
      { id: 2, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight * 0.12, backgroundColor: '#e50914', zIndex: 1 },
      { id: 3, type: 'title', x: 5, y: 3, content: 'EXCLUSIVE', fontSize: 32, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Netflix Sans', zIndex: 3 },
      { id: 4, type: 'image', x: 10, y: 20, width: 480, height: 480, src: item?.images?.[0]?.url || '', borderRadius: 10, zIndex: 2 },
      { id: 5, type: 'title', x: 10, y: 82, content: item?.name || 'Product Name', fontSize: 42, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Netflix Sans', zIndex: 3 },
      { id: 6, type: 'price', x: 10, y: 92, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#e50914', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },

  // === TESLA STYLE - Futuristic ===
  {
    id: 'tesla-minimal-tech',
    name: '⚡ Tesla Minimal Tech',
    description: 'Tesla-inspired futuristic',
    category: 'Tech',
    gradient: ['#000000', '#171a20'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#000000', zIndex: 0 },
      { id: 2, type: 'image', x: 10, y: 10, width: 480, height: 480, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 85, content: item?.name || 'Product Name', fontSize: 48, fontWeight: '500', color: '#ffffff', textAlign: 'center', fontFamily: 'Gotham', zIndex: 3 },
      { id: 4, type: 'text', x: 15, y: 92, content: 'The Future is Here', fontSize: 16, fontWeight: 'normal', color: '#5c5e62', textAlign: 'center', fontFamily: 'Gotham', zIndex: 3 },
      { id: 5, type: 'price', x: 42, y: 96, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: '500', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  // DARK THEME CARDS (Image 1 Style)
  {
    id: 'dark-blue-product-card',
    name: '🎧 Dark Blue Product Card',
    description: 'Product on top, blue info section below',
    category: 'Dark Cards',
    gradient: ['#0ea5e9', '#0284c7'],
    getLayout: (item) => [
      // Dark navy background
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#0f172a', zIndex: 0 },
      // White card container
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      // Product image area (top 60%)
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#f8fafc', borderRadius: 20, zIndex: 2 },
      // Product image
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      // Blue gradient info section (bottom 40%)
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#0ea5e9', borderRadius: 20, zIndex: 2 },
      // Product name in blue section
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      // Description
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#e0f2fe', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      // Price
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'dark-pink-product-card',
    name: '📷 Dark Pink Product Card',
    description: 'Product on top, pink info section below',
    category: 'Dark Cards',
    gradient: ['#ec4899', '#db2777'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#0f172a', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#fdf2f8', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#ec4899', borderRadius: 20, zIndex: 2 },
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#fce7f3', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'dark-orange-product-card',
    name: '🖱️ Dark Orange Product Card',
    description: 'Product on top, orange info section below',
    category: 'Dark Cards',
    gradient: ['#f97316', '#ea580c'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#0f172a', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#fff7ed', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#f97316', borderRadius: 20, zIndex: 2 },
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#ffedd5', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  
  // LIGHT THEME CARDS (Image 2 Style)
  {
    id: 'light-purple-product-card',
    name: '📱 Light Purple Product Card',
    description: 'Product on top, purple gradient below',
    category: 'Light Cards',
    gradient: ['#a855f7', '#9333ea', '#7e22ce'],
    getLayout: (item) => [
      // Light blurred background
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#f8fafc', zIndex: 0 },
      // White card container
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      // Product image area (top 60%)
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 2 },
      // Product image
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      // Purple gradient info section (bottom 40%)
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#a855f7', borderRadius: 20, zIndex: 2 },
      // Product name in gradient section
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      // Description
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#f3e8ff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      // Price
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      // Badge
      { id: 9, type: 'badge', x: 12, y: 12, content: 'NEW', fontSize: 14, fontWeight: 'bold', color: '#a855f7', backgroundColor: '#ffffff', padding: 6, borderRadius: 8, zIndex: 4 },
    ]
  },
  {
    id: 'light-pink-product-card',
    name: '🎧 Light Pink Product Card',
    description: 'Product on top, pink gradient below',
    category: 'Light Cards',
    gradient: ['#ec4899', '#db2777', '#be185d'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fdf2f8', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#ec4899', borderRadius: 20, zIndex: 2 },
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#fce7f3', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 9, type: 'badge', x: 12, y: 12, content: 'HOT', fontSize: 14, fontWeight: 'bold', color: '#ec4899', backgroundColor: '#ffffff', padding: 6, borderRadius: 8, zIndex: 4 },
    ]
  },
  {
    id: 'light-yellow-product-card',
    name: '✏️ Light Yellow Product Card',
    description: 'Product on top, yellow gradient below',
    category: 'Light Cards',
    gradient: ['#fbbf24', '#f59e0b', '#d97706'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fffbeb', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.5, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 3 },
      { id: 5, type: 'box', x: 8, y: 58, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.26, backgroundColor: '#fbbf24', borderRadius: 20, zIndex: 2 },
      { id: 6, type: 'title', x: 12, y: 62, content: item?.name || 'Product Name', fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 7, type: 'text', x: 12, y: 70, content: item?.description?.substring(0, 50) || 'Premium quality product', fontSize: 14, fontWeight: 'normal', color: '#fef3c7', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 8, type: 'price', x: 12, y: 77, content: `₹${item?.price || '999'}`, fontSize: 32, fontWeight: 'bold', color: '#ffffff', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 9, type: 'badge', x: 12, y: 12, content: 'SALE', fontSize: 14, fontWeight: 'bold', color: '#fbbf24', backgroundColor: '#ffffff', padding: 6, borderRadius: 8, zIndex: 4 },
    ]
  },
  // E-Commerce Focused
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Large product image with clean pricing',
    category: 'E-Commerce',
    gradient: ['#3b82f6', '#1e40af'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'image', x: 10, y: 10, width: 480, height: 480, src: item?.images?.[0]?.url || '', borderRadius: 15, border: true, borderWidth: 3, borderColor: '#e5e7eb', zIndex: 2 },
      { id: 3, type: 'title', x: 5, y: 87, content: item?.name || 'Product Name', fontSize: 36, fontWeight: 'bold', color: '#1e293b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'price', x: 75, y: 88, content: `₹${item?.price || '999'}`, fontSize: 40, fontWeight: 'bold', color: '#3b82f6', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'sale-banner',
    name: 'Sale Banner',
    description: 'Eye-catching sale poster',
    category: 'Promotional',
    gradient: ['#ef4444', '#dc2626'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fef2f2', zIndex: 0 },
      { id: 2, type: 'badge', x: 5, y: 3, content: 'MEGA SALE', fontSize: 52, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#ef4444', padding: 15, borderRadius: 12, zIndex: 3 },
      { id: 3, type: 'image', x: 15, y: 30, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 20, zIndex: 2 },
      { id: 4, type: 'title', x: 5, y: 80, content: item?.name || 'Product Name', fontSize: 38, fontWeight: 'bold', color: '#1e293b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 5, y: 90, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#ef4444', backgroundColor: '#fff1f2', padding: 12, borderRadius: 10, zIndex: 3 },
    ]
  },
  {
    id: 'dual-tone',
    name: 'Dual Tone',
    description: 'Split color background design',
    category: 'Modern',
    gradient: ['#8b5cf6', '#6d28d9'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight / 2, backgroundColor: '#8b5cf6', zIndex: 0 },
      { id: 2, type: 'box', x: 0, y: 50, width: canvasSize.displayWidth, height: canvasSize.displayHeight / 2, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 3, type: 'title', x: 10, y: 8, content: item?.name || 'Product Name', fontSize: 44, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'image', x: 20, y: 25, width: 350, height: 350, src: item?.images?.[0]?.url || '', borderRadius: 20, border: true, borderWidth: 5, borderColor: '#ffffff', zIndex: 2 },
      { id: 5, type: 'price', x: 35, y: 85, content: `₹${item?.price || '999'}`, fontSize: 46, fontWeight: 'bold', color: '#8b5cf6', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'premium-gold',
    name: 'Premium Gold',
    description: 'Luxury golden theme',
    category: 'Luxury',
    gradient: ['#fbbf24', '#d97706'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#1e293b', zIndex: 0 },
      { id: 2, type: 'box', x: 5, y: 5, width: canvasSize.displayWidth * 0.9, height: canvasSize.displayHeight * 0.9, backgroundColor: '#0f172a', borderRadius: 20, border: true, borderWidth: 4, borderColor: '#fbbf24', zIndex: 1 },
      { id: 3, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 15, border: true, borderWidth: 3, borderColor: '#fbbf24', zIndex: 2 },
      { id: 4, type: 'title', x: 10, y: 70, content: item?.name || 'Product Name', fontSize: 40, fontWeight: 'bold', color: '#fbbf24', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 35, y: 85, content: `₹${item?.price || '999'}`, fontSize: 44, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#fbbf24', padding: 15, borderRadius: 10, zIndex: 3 },
    ]
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean white background',
    category: 'Minimal',
    gradient: ['#ffffff', '#f8fafc'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'title', x: 10, y: 8, content: item?.name || 'Product Name', fontSize: 48, fontWeight: 'bold', color: '#000000', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 3, type: 'box', x: 10, y: 18, width: canvasSize.displayWidth * 0.8, height: 2, backgroundColor: '#000000', zIndex: 1 },
      { id: 4, type: 'image', x: 15, y: 30, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 5, type: 'price', x: 10, y: 85, content: `₹${item?.price || '999'}`, fontSize: 52, fontWeight: 'bold', color: '#000000', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'gradient-wave',
    name: 'Gradient Wave',
    description: 'Smooth gradient background',
    category: 'Modern',
    gradient: ['#06b6d4', '#0891b2'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#0891b2', zIndex: 0 },
      { id: 2, type: 'image', x: 25, y: 20, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 20, border: true, borderWidth: 4, borderColor: '#ffffff', zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 70, content: item?.name || 'Product Name', fontSize: 42, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'price', x: 35, y: 85, content: `₹${item?.price || '999'}`, fontSize: 46, fontWeight: 'bold', color: '#000000', backgroundColor: '#ffffff', padding: 15, borderRadius: 50, zIndex: 3 },
      { id: 5, type: 'badge', x: 10, y: 5, content: 'HOT DEAL', fontSize: 24, fontWeight: 'bold', color: '#06b6d4', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, zIndex: 3 },
    ]
  },
  {
    id: 'card-style',
    name: 'Card Style',
    description: 'Floating card design',
    category: 'Modern',
    gradient: ['#10b981', '#059669'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ecfdf5', zIndex: 0 },
      { id: 2, type: 'box', x: 8, y: 8, width: canvasSize.displayWidth * 0.84, height: canvasSize.displayHeight * 0.84, backgroundColor: '#ffffff', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'image', x: 18, y: 15, width: 380, height: 380, src: item?.images?.[0]?.url || '', borderRadius: 15, zIndex: 2 },
      { id: 4, type: 'title', x: 12, y: 77, content: item?.name || 'Product Name', fontSize: 34, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 38, y: 88, content: `₹${item?.price || '999'}`, fontSize: 40, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#10b981', padding: 12, borderRadius: 10, zIndex: 3 },
    ]
  },
  {
    id: 'bold-typography',
    name: 'Bold Typography',
    description: 'Large text focus',
    category: 'Typography',
    gradient: ['#f97316', '#ea580c'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fed7aa', zIndex: 0 },
      { id: 2, type: 'title', x: 5, y: 5, content: item?.name || 'PRODUCT NAME', fontSize: 56, fontWeight: 'bold', color: '#1e293b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 3, type: 'image', x: 30, y: 30, width: 250, height: 250, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 4, type: 'price', x: 5, y: 80, content: `₹${item?.price || '999'}`, fontSize: 72, fontWeight: 'bold', color: '#f97316', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 5, type: 'badge', x: 70, y: 90, content: 'BUY NOW', fontSize: 28, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1e293b', padding: 12, borderRadius: 8, zIndex: 3 },
    ]
  },
  {
    id: 'corner-image',
    name: 'Corner Image',
    description: 'Image in corner layout',
    category: 'Creative',
    gradient: ['#ec4899', '#db2777'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'image', x: 45, y: 5, width: 320, height: 320, src: item?.images?.[0]?.url || '', borderRadius: 20, border: true, borderWidth: 4, borderColor: '#ec4899', zIndex: 2 },
      { id: 3, type: 'title', x: 5, y: 65, content: item?.name || 'Product Name', fontSize: 46, fontWeight: 'bold', color: '#ec4899', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'text', x: 5, y: 80, content: item?.description?.substring(0, 80) || 'Amazing product description here', fontSize: 18, fontWeight: 'normal', color: '#64748b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 5, y: 90, content: `₹${item?.price || '999'}`, fontSize: 52, fontWeight: 'bold', color: '#1e293b', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Vibrant neon style',
    category: 'Creative',
    gradient: ['#a855f7', '#9333ea'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#18181b', zIndex: 0 },
      { id: 2, type: 'image', x: 20, y: 15, width: 350, height: 350, src: item?.images?.[0]?.url || '', borderRadius: 15, border: true, borderWidth: 4, borderColor: '#a855f7', zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 75, content: item?.name || 'Product Name', fontSize: 42, fontWeight: 'bold', color: '#a855f7', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'price', x: 35, y: 88, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#000000', backgroundColor: '#a855f7', padding: 15, borderRadius: 12, zIndex: 3 },
    ]
  },
  {
    id: 'magazine-style',
    name: 'Magazine Style',
    description: 'Editorial layout',
    category: 'Editorial',
    gradient: ['#1e293b', '#0f172a'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 0 },
      { id: 2, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth * 0.4, height: canvasSize.displayHeight, backgroundColor: '#1e293b', zIndex: 1 },
      { id: 3, type: 'title', x: 2, y: 10, content: item?.name || 'PRODUCT', fontSize: 36, fontWeight: 'bold', color: '#ffffff', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'image', x: 45, y: 20, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 5, type: 'price', x: 5, y: 85, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#fbbf24', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Geometric shapes design',
    category: 'Modern',
    gradient: ['#14b8a6', '#0d9488'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#f0fdfa', zIndex: 0 },
      { id: 2, type: 'box', x: 65, y: 5, width: 250, height: 250, backgroundColor: '#14b8a6', borderRadius: 20, zIndex: 1 },
      { id: 3, type: 'image', x: 15, y: 25, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 20, border: true, borderWidth: 4, borderColor: '#14b8a6', zIndex: 2 },
      { id: 4, type: 'title', x: 10, y: 75, content: item?.name || 'Product Name', fontSize: 38, fontWeight: 'bold', color: '#1e293b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 10, y: 88, content: `₹${item?.price || '999'}`, fontSize: 46, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#14b8a6', padding: 12, borderRadius: 10, zIndex: 3 },
    ]
  },
  {
    id: 'retro-vintage',
    name: 'Retro Vintage',
    description: 'Classic vintage style',
    category: 'Vintage',
    gradient: ['#d97706', '#b45309'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fef3c7', zIndex: 0 },
      { id: 2, type: 'box', x: 10, y: 10, width: canvasSize.displayWidth * 0.8, height: canvasSize.displayHeight * 0.8, backgroundColor: '#ffffff', borderRadius: 0, border: true, borderWidth: 8, borderColor: '#d97706', zIndex: 1 },
      { id: 3, type: 'title', x: 15, y: 15, content: item?.name || 'Product Name', fontSize: 40, fontWeight: 'bold', color: '#d97706', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'image', x: 25, y: 35, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 0, zIndex: 2 },
      { id: 5, type: 'price', x: 35, y: 80, content: `₹${item?.price || '999'}`, fontSize: 44, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#d97706', padding: 12, borderRadius: 0, zIndex: 3 },
    ]
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Futuristic tech design',
    category: 'Tech',
    gradient: ['#6366f1', '#4f46e5'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#1e1b4b', zIndex: 0 },
      { id: 2, type: 'box', x: 5, y: 5, width: canvasSize.displayWidth * 0.9, height: 80, backgroundColor: '#6366f1', borderRadius: 15, zIndex: 1 },
      { id: 3, type: 'title', x: 10, y: 8, content: item?.name || 'PRODUCT NAME', fontSize: 36, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'image', x: 15, y: 25, width: 400, height: 400, src: item?.images?.[0]?.url || '', borderRadius: 15, border: true, borderWidth: 3, borderColor: '#6366f1', zIndex: 2 },
      { id: 5, type: 'price', x: 35, y: 88, content: `₹${item?.price || '999'}`, fontSize: 48, fontWeight: 'bold', color: '#1e1b4b', backgroundColor: '#6366f1', padding: 15, borderRadius: 12, zIndex: 3 },
    ]
  },
  {
    id: 'split-diagonal',
    name: 'Split Diagonal',
    description: 'Diagonal split design',
    category: 'Creative',
    gradient: ['#fb7185', '#f43f5e'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fb7185', zIndex: 0 },
      { id: 2, type: 'box', x: 40, y: 0, width: canvasSize.displayWidth * 0.6, height: canvasSize.displayHeight, backgroundColor: '#ffffff', zIndex: 1 },
      { id: 3, type: 'image', x: 5, y: 20, width: 200, height: 200, src: item?.images?.[0]?.url || '', borderRadius: 15, border: true, borderWidth: 4, borderColor: '#ffffff', zIndex: 2 },
      { id: 4, type: 'title', x: 45, y: 30, content: item?.name || 'Product Name', fontSize: 42, fontWeight: 'bold', color: '#1e293b', textAlign: 'left', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 45, y: 70, content: `₹${item?.price || '999'}`, fontSize: 52, fontWeight: 'bold', color: '#fb7185', backgroundColor: 'transparent', padding: 0, borderRadius: 0, zIndex: 3 },
      { id: 6, type: 'badge', x: 5, y: 65, content: 'NEW', fontSize: 28, fontWeight: 'bold', color: '#fb7185', backgroundColor: '#ffffff', padding: 12, borderRadius: 10, zIndex: 3 },
    ]
  },
  {
    id: 'elegant-frame',
    name: 'Elegant Frame',
    description: 'Bordered frame design',
    category: 'Elegant',
    gradient: ['#64748b', '#475569'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#f1f5f9', zIndex: 0 },
      { id: 2, type: 'box', x: 7, y: 7, width: canvasSize.displayWidth * 0.86, height: canvasSize.displayHeight * 0.86, backgroundColor: '#ffffff', borderRadius: 0, border: true, borderWidth: 3, borderColor: '#64748b', zIndex: 1 },
      { id: 3, type: 'image', x: 20, y: 20, width: 350, height: 350, src: item?.images?.[0]?.url || '', borderRadius: 10, zIndex: 2 },
      { id: 4, type: 'title', x: 12, y: 77, content: item?.name || 'Product Name', fontSize: 38, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 5, type: 'price', x: 37, y: 88, content: `₹${item?.price || '999'}`, fontSize: 42, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#64748b', padding: 12, borderRadius: 8, zIndex: 3 },
    ]
  },
  {
    id: 'bubble-style',
    name: 'Bubble Style',
    description: 'Playful bubble design',
    category: 'Playful',
    gradient: ['#fbbf24', '#f59e0b'],
    getLayout: (item) => [
      { id: 1, type: 'box', x: 0, y: 0, width: canvasSize.displayWidth, height: canvasSize.displayHeight, backgroundColor: '#fffbeb', zIndex: 0 },
      { id: 2, type: 'image', x: 25, y: 15, width: 300, height: 300, src: item?.images?.[0]?.url || '', borderRadius: 150, border: true, borderWidth: 5, borderColor: '#fbbf24', zIndex: 2 },
      { id: 3, type: 'title', x: 10, y: 70, content: item?.name || 'Product Name', fontSize: 40, fontWeight: 'bold', color: '#92400e', textAlign: 'center', fontFamily: 'Arial', zIndex: 3 },
      { id: 4, type: 'price', x: 35, y: 85, content: `₹${item?.price || '999'}`, fontSize: 46, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#fbbf24', padding: 15, borderRadius: 50, zIndex: 3 },
    ]
  },
  // Add more templates to reach 35+...
];
