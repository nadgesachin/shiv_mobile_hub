import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Contact from './pages/contact';
import CSCPortal from './pages/csc-portal';
import ServicesHub from './pages/services-hub';
import CustomerDashboard from './pages/customer-dashboard';
import ProductsCatalog from './pages/products-catalog';
import Homepage from './pages/homepage';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import ServicesManagement from './pages/admin/ServicesManagement';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Admin Dashboard Overview</div>} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="sections" element={<div>Sections Management</div>} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="users" element={<div>User Management</div>} />
          <Route path="orders" element={<div>Order Management</div>} />
          <Route path="analytics" element={<div>Analytics Dashboard</div>} />
          <Route path="settings" element={<div>Admin Settings</div>} />
        </Route>
        
        {/* Customer Dashboard - Protected */}
        <Route path="/customer-dashboard" element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/csc-portal" element={<CSCPortal />} />
        <Route path="/services-hub" element={<ServicesHub />} />
        <Route path="/products-catalog" element={<ProductsCatalog />} />
        <Route path="/homepage" element={<Homepage />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
