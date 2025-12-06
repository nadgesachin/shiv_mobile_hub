# Shiv Mobile Hub Backend

A comprehensive backend API for the Shiv Mobile Hub e-commerce platform with admin functionality.

## Features

- **Authentication System**: JWT-based auth with Google OAuth support
- **Role-based Access Control**: Admin and regular user roles
- **Product Management**: CRUD operations for products with categories and sections
- **Section Management**: Dynamic sections (Flash Deals, New Arrivals, etc.)
- **Service Management**: Manage services offered on the platform
- **Image Upload**: Cloudinary integration for image storage
- **User Management**: Admin can manage all users
- **Search & Filtering**: Advanced product search and filtering
- **Pagination**: Efficient data pagination

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Cloudinary** - Image storage
- **Multer** - File upload handling

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (make sure it's running on your system)

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shiv-mobile-hub

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Default Credentials
ADMIN_EMAIL=admin@shivmobilehub.com
ADMIN_PASSWORD=admin123456
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/meta/categories` - Get categories and brands
- `PUT /api/products/:id/toggle-status` - Toggle product status (Admin only)

### Sections
- `GET /api/sections` - Get all sections with products
- `GET /api/sections/:name` - Get specific section
- `POST /api/sections` - Create section (Admin only)
- `PUT /api/sections/:id` - Update section (Admin only)
- `PUT /api/sections/:id/add-product` - Add product to section (Admin only)
- `PUT /api/sections/:id/remove-product` - Remove product from section (Admin only)
- `PUT /api/sections/:id/auto-update` - Auto-update section products (Admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (Admin only)
- `PUT /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)
- `GET /api/services/meta/categories` - Get service categories
- `PUT /api/services/:id/toggle-status` - Toggle service status (Admin only)
- `PUT /api/services/:id/toggle-popular` - Toggle popular status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/:id/toggle-status` - Toggle user status (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Upload
- `POST /api/upload/single` - Upload single image (Admin only)
- `POST /api/upload/multiple` - Upload multiple images (Admin only)
- `DELETE /api/upload/:publicId` - Delete image (Admin only)
- `POST /api/upload/transform` - Get transformed image URL (Admin only)

## Default Admin Credentials

After seeding the database, you can login with:
- Email: `admin@shivmobilehub.com`
- Password: `admin123456`

## Database Schema

### User Model
- name, email, password, role, avatar, googleId, isEmailVerified, phone, address, isActive, lastLogin

### Product Model
- name, description, price, originalPrice, images, category, brand, badge, rating, reviewCount, specs, detailedSpecs, stockStatus, stockCount, sections, isActive

### Section Model
- name, title, subtitle, description, products, maxProducts, isActive, displayOrder, settings

### Service Model
- name, description, icon, category, price, priceType, duration, image, features, requirements, process, faqs, isActive, isPopular, displayOrder

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js for security headers
- Input validation
- File upload restrictions

## Development

The API includes comprehensive error handling and validation. All admin routes require authentication and admin role verification.

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set up production Cloudinary credentials
4. Configure production Google OAuth
5. Update JWT secret with a strong random string
6. Set up proper CORS origins

## License

MIT
