import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import apiService from '../../services/api';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    todayEnquiries: 0,
    pendingEnquiries: 0,
    totalCategories: 0,
    totalServices: 0,
    activeProducts: 0,
    lowStockProducts: 0
  });
  
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({
    enquiriesByDay: [],
    productsByCategory: [],
    enquiryStatus: []
  });
  
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        productsRes,
        enquiriesRes,
        categoriesRes,
        servicesRes
      ] = await Promise.all([
        apiService.request('/products'),
        apiService.request('/enquiries'),
        apiService.request('/categories'),
        apiService.request('/services')
      ]);

      // Calculate stats
      const products = productsRes.data || [];
      const enquiries = enquiriesRes.data || [];
      const categories = categoriesRes.data || [];
      const services = servicesRes.data || [];

      const today = new Date().setHours(0, 0, 0, 0);
      const todayEnquiries = enquiries.filter(e => 
        new Date(e.createdAt).setHours(0, 0, 0, 0) === today
      );
      
      const pendingEnquiries = enquiries.filter(e => 
        e.status === 'new' || e.status === 'pending'
      );

      const activeProducts = products.filter(p => p.isActive !== false);
      const lowStockProducts = products.filter(p => p.stock && p.stock < 10);

      setStats({
        totalProducts: products.length,
        totalEnquiries: enquiries.length,
        todayEnquiries: todayEnquiries.length,
        pendingEnquiries: pendingEnquiries.length,
        totalCategories: categories.length,
        totalServices: services.length,
        activeProducts: activeProducts.length,
        lowStockProducts: lowStockProducts.length
      });

      // Set recent enquiries (last 5)
      setRecentEnquiries(enquiries.slice(0, 5));

      // Calculate top products by enquiry count
      const productEnquiryCounts = {};
      enquiries.forEach(e => {
        if (e.productId) {
          productEnquiryCounts[e.productId] = (productEnquiryCounts[e.productId] || 0) + 1;
        }
      });
      
      const topProductsList = Object.entries(productEnquiryCounts)
        .map(([productId, count]) => {
          const product = products.find(p => p._id === productId);
          return product ? { ...product, enquiryCount: count } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.enquiryCount - a.enquiryCount)
        .slice(0, 5);
      
      setTopProducts(topProductsList);

      // Prepare chart data
      prepareChartData(enquiries, products, categories);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (enquiries, products, categories) => {
    // Enquiries by day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      const dayEnquiries = enquiries.filter(e => {
        const eDate = new Date(e.createdAt);
        return eDate.toDateString() === date.toDateString();
      });
      last7Days.push({ day: dateStr, enquiries: dayEnquiries.length });
    }

    // Products by category
    const productsByCategory = categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.category?._id === cat._id).length
    }));

    // Enquiry status distribution
    const statusCounts = {
      New: enquiries.filter(e => e.status === 'new').length,
      Contacted: enquiries.filter(e => e.status === 'contacted').length,
      Converted: enquiries.filter(e => e.status === 'converted').length,
      Closed: enquiries.filter(e => e.status === 'closed').length
    };
    
    const enquiryStatus = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));

    setChartData({
      enquiriesByDay: last7Days,
      productsByCategory,
      enquiryStatus
    });
  };

  const StatCard = ({ title, value, icon, color, change, link }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon name={icon} size={24} className="text-white" />
        </div>
        {link && (
          <Link to={link} className="text-sm text-primary hover:underline">
            View All →
          </Link>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{loading ? <Skeleton className="h-8 w-20" /> : value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      {change !== undefined && (
        <p className={`text-xs mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <Icon name={change >= 0 ? 'TrendingUp' : 'TrendingDown'} size={14} className="inline mr-1" />
          {Math.abs(change)}% from yesterday
        </p>
      )}
    </motion.div>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading && !stats.totalProducts) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="Package"
          color="from-blue-500 to-blue-600"
          link="/admin/products"
        />
        <StatCard
          title="Total Enquiries"
          value={stats.totalEnquiries}
          icon="MessageSquare"
          color="from-green-500 to-green-600"
          link="/admin/enquiries"
        />
        <StatCard
          title="Today's Enquiries"
          value={stats.todayEnquiries}
          icon="Calendar"
          color="from-purple-500 to-purple-600"
          change={25}
        />
        <StatCard
          title="Pending Enquiries"
          value={stats.pendingEnquiries}
          icon="Clock"
          color="from-orange-500 to-orange-600"
          link="/admin/enquiries?status=pending"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon="CheckCircle"
          color="from-teal-500 to-teal-600"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon="AlertTriangle"
          color="from-red-500 to-red-600"
          link="/admin/products?filter=low-stock"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="Grid"
          color="from-indigo-500 to-indigo-600"
          link="/admin/categories"
        />
        <StatCard
          title="Services"
          value={stats.totalServices}
          icon="Tool"
          color="from-pink-500 to-pink-600"
          link="/admin/services"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enquiries Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enquiries Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.enquiriesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enquiries" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enquiry Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enquiry Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.enquiryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.enquiryStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Enquiries & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentEnquiries.map((enquiry) => (
              <div key={enquiry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{enquiry.name}</p>
                  <p className="text-sm text-gray-600">{enquiry.productName || 'General Enquiry'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {enquiry.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentEnquiries.length === 0 && (
              <p className="text-center text-gray-500 py-8">No enquiries yet</p>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Products by Enquiries</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{product.enquiryCount}</p>
                  <p className="text-xs text-gray-500">enquiries</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center text-gray-500 py-8">No product enquiries yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
