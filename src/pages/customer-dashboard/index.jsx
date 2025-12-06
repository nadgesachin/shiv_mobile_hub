import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardStats from './components/DashboardStats';
import ServiceTimeline from './components/ServiceTimeline';
import LoyaltyCard from './components/LoyaltyCard';
import QuickActions from './components/QuickActions';
import RecommendedServices from './components/RecommendedServices';
import AccountSettings from './components/AccountSettings';
import SupportTickets from './components/SupportTickets';

const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const userData = {
    name: "Rajesh Kumar Sharma",
    email: "rajesh.sharma@email.com",
    phone: "+91 98765 43210",
    address: "Shop No. 15, Main Market, Sector 12, Mumbai, Maharashtra 400001",
    memberSince: "January 2023",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_162f7d819-1763295612623.png",
    avatarAlt: "Professional headshot of Indian man with short black hair wearing blue shirt and warm smile"
  };

  const statsData = [
  {
    id: 1,
    icon: "ShoppingBag",
    iconColor: "var(--color-primary)",
    bgColor: "bg-primary/10",
    value: "24",
    label: "Total Orders",
    trend: "+12%",
    trendDirection: "up"
  },
  {
    id: 2,
    icon: "Wrench",
    iconColor: "var(--color-secondary)",
    bgColor: "bg-secondary/10",
    value: "8",
    label: "Active Services",
    trend: "+3",
    trendDirection: "up"
  },
  {
    id: 3,
    icon: "Award",
    iconColor: "var(--color-success)",
    bgColor: "bg-success/10",
    value: "2,450",
    label: "Loyalty Points",
    trend: "+450",
    trendDirection: "up"
  },
  {
    id: 4,
    icon: "IndianRupee",
    iconColor: "var(--color-warning)",
    bgColor: "bg-warning/10",
    value: "₹45,280",
    label: "Total Spent",
    trend: "+8%",
    trendDirection: "up"
  }];


  const serviceHistory = [
  {
    id: 1,
    title: "iPhone 13 Screen Replacement",
    description: "Complete screen replacement with original Apple display and installation",
    date: "28 Nov 2025",
    orderId: "ORD-2025-1128",
    status: "in-progress",
    progress: 75,
    amount: 8500
  },
  {
    id: 2,
    title: "Aadhaar Card Update Service",
    description: "Address and mobile number update in Aadhaar card through CSC portal",
    date: "25 Nov 2025",
    orderId: "ORD-2025-1125",
    status: "completed",
    amount: 150
  },
  {
    id: 3,
    title: "Samsung Galaxy S23 Purchase",
    description: "Brand new Samsung Galaxy S23 5G 256GB with warranty and accessories",
    date: "20 Nov 2025",
    orderId: "ORD-2025-1120",
    status: "completed",
    amount: 74999
  },
  {
    id: 4,
    title: "Mobile Recharge - Jio",
    description: "Prepaid recharge for Jio number with unlimited data and calls",
    date: "18 Nov 2025",
    orderId: "ORD-2025-1118",
    status: "completed",
    amount: 599
  },
  {
    id: 5,
    title: "PAN Card Application",
    description: "New PAN card application with document verification and submission",
    date: "15 Nov 2025",
    orderId: "ORD-2025-1115",
    status: "pending",
    amount: 250
  }];


  const loyaltyData = {
    tier: "Gold",
    nextTier: "Platinum",
    currentPoints: 2450,
    nextTierPoints: 5000,
    rewardsAvailable: 5,
    activeOffers: 8
  };

  const quickActions = [
  { id: 1, icon: "Smartphone", label: "Book Repair" },
  { id: 2, icon: "ShoppingCart", label: "Buy Products" },
  { id: 3, icon: "FileText", label: "CSC Services" },
  { id: 4, icon: "Zap", label: "Recharge" },
  { id: 5, icon: "CreditCard", label: "Pay Bills" },
  { id: 6, icon: "Package", label: "Track Order" }];


  const recommendedServices = [
  {
    id: 1,
    title: "Premium Screen Guard",
    description: "Tempered glass screen protector with anti-fingerprint coating",
    image: "https://images.unsplash.com/photo-1694878873195-369e68121046",
    imageAlt: "Clear tempered glass screen protector with anti-fingerprint coating displayed on white background",
    price: 499,
    discount: 20
  },
  {
    id: 2,
    title: "Fast Charging Cable",
    description: "Type-C fast charging cable with 3A output and braided design",
    image: "https://images.unsplash.com/photo-1631755218195-8d8e7b2c04d6",
    imageAlt: "Black braided USB Type-C charging cable coiled on wooden surface with metallic connectors",
    price: 299,
    discount: 15
  },
  {
    id: 3,
    title: "Passport Size Photos",
    description: "Professional passport size photographs for official documents",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d527db47-1764490678315.png",
    imageAlt: "Professional passport size photograph sheets arranged on blue background showing standard photo dimensions",
    price: 100,
    discount: null
  }];


  const supportTickets = [
  {
    id: 1,
    ticketId: "TKT-2025-0045",
    title: "Screen replacement warranty query",
    description: "Need clarification about warranty coverage for screen replacement service",
    priority: "medium",
    status: "in-progress",
    createdDate: "27 Nov 2025",
    replies: 3,
    assignedTo: "Support Team"
  },
  {
    id: 2,
    ticketId: "TKT-2025-0038",
    title: "Aadhaar update status",
    description: "Checking the status of my Aadhaar card address update application",
    priority: "low",
    status: "resolved",
    createdDate: "24 Nov 2025",
    replies: 5,
    assignedTo: "CSC Team"
  }];


  const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'services', label: 'Service History', icon: 'Clock' },
  { id: 'loyalty', label: 'Loyalty & Rewards', icon: 'Award' },
  { id: 'settings', label: 'Account Settings', icon: 'Settings' },
  { id: 'support', label: 'Support Tickets', icon: 'MessageSquare' }];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={userData?.avatar}
                  alt={userData?.avatarAlt}
                  className="w-full h-full object-cover" />

              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-headline font-bold text-foreground">
                  Welcome back, {userData?.name?.split(' ')?.[0]}!
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {userData?.memberSince}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Bell" iconPosition="left">
                Notifications
              </Button>
              <Link to="/contact">
                <Button variant="default" iconName="Headphones" iconPosition="left">
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
              <nav className="space-y-2">
                {menuItems?.map((item) =>
                <button
                  key={item?.id}
                  onClick={() => setActiveSection(item?.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-smooth touch-target ${
                  activeSection === item?.id ?
                  'bg-primary text-primary-foreground' :
                  'text-foreground hover:bg-muted'}`
                  }>

                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </button>
                )}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'overview' &&
            <>
                <DashboardStats stats={statsData} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ServiceTimeline services={serviceHistory?.slice(0, 3)} />
                  </div>
                  <div className="space-y-6">
                    <QuickActions actions={quickActions} />
                    <RecommendedServices services={recommendedServices} />
                  </div>
                </div>
              </>
            }

            {activeSection === 'services' &&
            <ServiceTimeline services={serviceHistory} />
            }

            {activeSection === 'loyalty' &&
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LoyaltyCard loyaltyData={loyaltyData} />
                <RecommendedServices services={recommendedServices} />
              </div>
            }

            {activeSection === 'settings' &&
            <AccountSettings userData={userData} />
            }

            {activeSection === 'support' &&
            <SupportTickets tickets={supportTickets} />
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>);

};

export default CustomerDashboard;