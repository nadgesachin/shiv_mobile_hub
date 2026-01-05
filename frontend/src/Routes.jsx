import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import Contact from './pages/contact';
import CSCPortal from './pages/csc-portal';
import ServicesHub from './pages/services-hub';
import ServiceDetailPage from './pages/services-hub/ServiceDetailPage';
import ProductsCatalog from './pages/products-catalog';
import ProductDetailPage from './pages/products-catalog/ProductDetailPage';
import Homepage from './pages/homepage';
import MobileHomepageContainer from './pages/homepage/MobileHomepageContainer';
import PremiumMobileContainer from './pages/homepage/PremiumMobileContainer';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPassword from './pages/auth/ResetPassword';
import GoogleCallback from './pages/auth/GoogleCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './pages/profile/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import AdminLayout from './pages/admin/AdminLayout';
import AdminGuard from './pages/admin/AdminGuard';
import UsersManagement from './pages/admin/UsersManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import SectionsManagement from './pages/admin/SectionsManagement';
import BannersManagement from './pages/admin/BannersManagement';
import PagesManagement from './pages/admin/PagesManagement';
import Settings from './pages/admin/Settings';
import PosterGenerator from './pages/admin/PosterGenerator';
import PostersManagement from './pages/admin/PostersManagement';
import ChatPage from './pages/chat/ChatPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ChatWidget from './components/chat/ChatWidget';
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <ChatProvider>
      <NotificationProvider>
      <RouterRoutes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<div>Order Management</div>} />
          <Route path="analytics" element={<div>Analytics Dashboard</div>} />
          <Route path="pages" element={<PagesManagement />} />
          <Route path="sections" element={<SectionsManagement />} />
          <Route path="banners" element={<BannersManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posters" element={<PostersManagement />} />
          <Route path="poster-generator" element={<PosterGenerator />} />
        </Route>
        
        {/* Chat & Notifications - Protected */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/premium" element={<PremiumMobileContainer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/csc-portal" element={<CSCPortal />} />
        <Route path="/services-hub" element={<ServicesHub />} />
        <Route path="/services-hub/:id" element={<ServiceDetailPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/products-catalog" element={<ProductsCatalog />} />
        <Route path="/products-catalog/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/homepage" element={<Homepage />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      
      {/* Floating Chat Widget */}
      {/* <ChatWidget /> */}
      
      </NotificationProvider>
      </ChatProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
