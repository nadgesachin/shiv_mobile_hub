#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Frontend-Backend Integration...\n');

// Check if all required files exist
const requiredFiles = [
  // Backend files
  'backend/package.json',
  'backend/server.js',
  'backend/scripts/seed.js',
  'backend/models/User.js',
  'backend/models/Product.js',
  'backend/models/Service.js',
  'backend/models/Section.js',
  'backend/routes/auth.js',
  'backend/routes/products.js',
  'backend/routes/services.js',
  'backend/routes/sections.js',
  'backend/routes/users.js',
  'backend/routes/upload.js',
  
  // Frontend files
  'src/services/api.js',
  'src/contexts/AuthContext.js',
  'src/components/auth/ProtectedRoute.js',
  'src/pages/auth/LoginPage.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/admin/ProductsManagement.jsx',
  'src/pages/admin/ServicesManagement.jsx',
  'src/components/admin/ProductForm.jsx',
  'src/components/admin/ProductCard.jsx',
  'src/components/admin/ServiceForm.jsx',
  'src/components/admin/ServiceCard.jsx',
  
  // Updated files
  'src/App.jsx',
  'src/Routes.jsx',
  'src/pages/homepage/components/ServiceCategories.jsx',
  'src/pages/homepage/components/MobileShowcase.jsx',
  
  // Configuration
  '.env.example',
  'INTEGRATION_GUIDE.md'
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json for required dependencies
console.log('\n📦 Checking backend dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const requiredDeps = [
    'express',
    'mongoose',
    'jsonwebtoken',
    'passport',
    'passport-google-oauth20',
    'passport-jwt',
    'multer',
    'multer-storage-cloudinary',
    'cloudinary',
    'bcryptjs',
    'cors',
    'helmet',
    'express-rate-limit'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Could not read backend/package.json');
  allFilesExist = false;
}

// Check if frontend has React and Router
console.log('\n⚛️ Checking frontend dependencies...');
try {
  const frontendPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom'
  ];
  
  requiredDeps.forEach(dep => {
    if (frontendPackageJson.dependencies && frontendPackageJson.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Could not read frontend package.json');
  allFilesExist = false;
}

// Check environment files
console.log('\n🔐 Checking environment setup...');
if (fs.existsSync('backend/.env.example')) {
  console.log('✅ Backend .env.example exists');
} else {
  console.log('❌ Backend .env.example missing');
  allFilesExist = false;
}

if (fs.existsSync('.env.example')) {
  console.log('✅ Frontend .env.example exists');
} else {
  console.log('❌ Frontend .env.example missing');
  allFilesExist = false;
}

// Summary
console.log('\n📋 Integration Status:');
if (allFilesExist) {
  console.log('🎉 All integration components are properly set up!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Set up your environment variables (.env files)');
  console.log('2. Start MongoDB service');
  console.log('3. Run: cd backend && npm install && npm run seed');
  console.log('4. Run: npm start (in root directory)');
  console.log('5. Visit: http://localhost:3000/login');
  console.log('6. Login with: admin@shivmobilehub.com / admin123');
} else {
  console.log('⚠️ Some components are missing. Please review the errors above.');
  process.exit(1);
}

console.log('\n📚 For detailed setup instructions, see: INTEGRATION_GUIDE.md');
