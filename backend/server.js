const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');
const http = require('http');
const { initializeSocket } = require('./socket');

// Import routes
const seedRoutes = require('./routes/seed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const sectionRoutes = require('./routes/sections');
const serviceRoutes = require('./routes/services');
const uploadRoutes = require('./routes/upload');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const categoryRoutes = require('./routes/categories');
const pageRoutes = require('./routes/pages');
const bannerRoutes = require('./routes/banners');
const reviewRoutes = require('./routes/reviews');
const { auth, adminOnly } = require('./middleware/auth');

// All admin routes require login + admin role
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
// initializeSocket(server);

// Security middleware
// app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:4029', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Failed to connect to MongoDB. Please ensure MongoDB is running.');
  process.exit(1);
});

// Routes
app.use('/api/admin', auth, adminOnly, require('./routes/admin'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', auth, uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', auth, notificationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/posters', require('./routes/posters'));
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Shiv Mobile Hub API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
