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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/csc-portal" element={<CSCPortal />} />
        <Route path="/services-hub" element={<ServicesHub />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/products-catalog" element={<ProductsCatalog />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
