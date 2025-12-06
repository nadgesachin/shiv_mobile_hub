# Frontend-Backend Integration Guide

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
MONGODB_URI=mongodb://localhost:27017/shiv_mobile_hub
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=http://localhost:3000

# Seed the database
npm run seed

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Create .env file for frontend
cp .env.example .env

# Update .env with backend URL:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Install frontend dependencies (if not already installed)
npm install

# Start the frontend
npm start
```

## 🔑 Default Admin Credentials

After seeding the database, you can login with:

- **Email**: admin@shivmobilehub.com
- **Password**: admin123
- **Role**: Admin

## 📱 Access Points

### Frontend URLs
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Products Management**: http://localhost:3000/admin/products
- **Services Management**: http://localhost:3000/admin/services

### Backend API
- **Base URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/auth/me

## 🛠️ Features Implemented

### Authentication
- ✅ User registration and login
- ✅ JWT token management
- ✅ Role-based access control (Admin/User)
- ✅ Google OAuth integration
- ✅ Protected routes

### Admin Dashboard
- ✅ Products CRUD operations
- ✅ Services CRUD operations
- ✅ Image upload to Cloudinary
- ✅ User management
- ✅ Real-time data updates

### Frontend Integration
- ✅ Dynamic service categories
- ✅ Product showcase from database
- ✅ Responsive design
- ✅ Loading and error states
- ✅ Search and filtering

## 🔧 Testing the Integration

### 1. Test Authentication
1. Navigate to http://localhost:3000/login
2. Login with admin credentials
3. Verify redirect to admin dashboard

### 2. Test Product Management
1. Go to Admin Dashboard → Products
2. Create a new product with image upload
3. Edit the product details
4. Toggle product status
5. Delete the product

### 3. Test Service Management
1. Go to Admin Dashboard → Services
2. Create a new service with features
3. Mark service as popular
4. Update service details
5. Delete the service

### 4. Test Frontend Display
1. Visit homepage to see dynamic services
2. Check product showcase for real data
3. Verify search and filtering works

## 🐛 Common Issues & Solutions

### CORS Issues
If you get CORS errors, ensure your backend `.env` has:
```
FRONTEND_URL=http://localhost:3000
```

### MongoDB Connection
Make sure MongoDB is running:
```bash
# On macOS/Linux
sudo systemctl start mongod

# Or using Homebrew
brew services start mongodb-community

# Check status
sudo systemctl status mongod
```

### Image Upload Issues
Verify Cloudinary credentials in `.env`:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### JWT Token Issues
Clear browser localStorage if facing auth issues:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## 📊 Database Schema

### Products
- name, description, price, originalPrice
- category, subcategory, brand
- images (Cloudinary URLs)
- specs, detailedSpecs
- badge, rating, reviewCount
- stockStatus, stockCount
- sections (homepage placement)

### Services
- name, description, icon
- category, subcategory
- price, priceType, duration
- features, requirements, process
- isPopular, displayOrder

### Users
- name, email, password
- role (admin/user)
- profile information
- isActive status

## 🚀 Next Steps

1. **Add More Admin Features**:
   - Order management
   - Analytics dashboard
   - Customer support
   - Email notifications

2. **Enhance Frontend**:
   - Product detail pages
   - Shopping cart functionality
   - Payment integration
   - Customer reviews

3. **Improve Performance**:
   - Add caching (Redis)
   - Implement pagination
   - Optimize image loading
   - Add SEO optimization

4. **Security Enhancements**:
   - Rate limiting
   - Input validation
   - Security headers
   - Audit logging

## 📞 Support

For any issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check network connectivity
5. Review the logs in both frontend and backend

---

**Happy Coding! 🎉**
