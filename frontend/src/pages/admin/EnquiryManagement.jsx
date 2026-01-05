import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import apiService from '../../services/api';
import { TableRowSkeleton } from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: '',
    productId: 'all'
  });

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enquiries, filters]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/enquiries');
      if (response.success) {
        const enquiriesData = response.data || [];
        setEnquiries(enquiriesData);
        
        // Calculate stats
        setStats({
          total: enquiriesData.length,
          new: enquiriesData.filter(e => e.status === 'new').length,
          contacted: enquiriesData.filter(e => e.status === 'contacted').length,
          converted: enquiriesData.filter(e => e.status === 'converted').length,
          closed: enquiriesData.filter(e => e.status === 'closed').length
        });
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      Toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enquiries];
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateLimit = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          dateLimit.setHours(0, 0, 0, 0);
          break;
        case 'week':
          dateLimit.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateLimit.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(e => new Date(e.createdAt) >= dateLimit);
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.name?.toLowerCase().includes(searchLower) ||
        e.email?.toLowerCase().includes(searchLower) ||
        e.phone?.includes(filters.search) ||
        e.productName?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by most recent
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredEnquiries(filtered);
  };

  const updateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      const response = await apiService.request(`/enquiries/${enquiryId}/status`, 'PATCH', {
        status: newStatus
      });
      
      if (response.success) {
        Toast.success('Status updated successfully');
        setEnquiries(prev => prev.map(e => 
          e._id === enquiryId ? { ...e, status: newStatus } : e
        ));
        if (selectedEnquiry?._id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Toast.error('Failed to update status');
    }
  };

  const deleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      const response = await apiService.request(`/enquiries/${enquiryId}`, 'DELETE');
      
      if (response.success) {
        Toast.success('Enquiry deleted successfully');
        setEnquiries(prev => prev.filter(e => e._id !== enquiryId));
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      Toast.error('Failed to delete enquiry');
    }
  };

  const exportEnquiries = () => {
    const csvData = filteredEnquiries.map(e => ({
      Date: new Date(e.createdAt).toLocaleDateString(),
      Name: e.name,
      Phone: e.phone,
      Email: e.email || '-',
      Product: e.productName || 'General',
      Status: e.status,
      Message: e.message || '-'
    }));
    
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    Toast.success('Enquiries exported successfully');
  };

  const openWhatsApp = (phone, name, productName) => {
    const message = `Hi ${name}, This is regarding your enquiry for ${productName || 'our products'}. How can I help you?`;
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      converted: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[status] || statusColors.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const EnquiryDetailsModal = () => {
    if (!selectedEnquiry) return null;
    
    return (
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon name="X" size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status & Actions */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedEnquiry.status} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => openWhatsApp(selectedEnquiry.phone, selectedEnquiry.name, selectedEnquiry.productName)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Icon name="MessageCircle" size={18} />
                    </button>
                    <button
                      onClick={() => deleteEnquiry(selectedEnquiry._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedEnquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">+91 {selectedEnquiry.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedEnquiry.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEnquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {selectedEnquiry.productId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                    <p className="font-medium text-gray-900">{selectedEnquiry.productName}</p>
                    {selectedEnquiry.productPrice && (
                      <p className="text-lg font-bold text-primary mt-1">
                        ₹{selectedEnquiry.productPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                )}

                {/* Message */}
                {selectedEnquiry.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                )}

                {/* Status Update */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'contacted', 'converted', 'closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateEnquiryStatus(selectedEnquiry._id, status)}
                        disabled={selectedEnquiry.status === status}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedEnquiry.status === status
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <TableRowSkeleton key={i} columns={6} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enquiry Management</h1>
        <p className="text-gray-600">Manage and track all customer enquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
          <p className="text-sm text-blue-600">New</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.contacted}</p>
          <p className="text-sm text-yellow-600">Contacted</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
          <p className="text-sm text-green-600">Converted</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-700">{stats.closed}</p>
          <p className="text-sm text-gray-600">Closed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Name, phone, email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={exportEnquiries}
              variant="outline"
              className="w-full"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <EmptyState
            icon="MessageSquare"
            title="No enquiries found"
            description="No enquiries match your current filters"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-xs text-gray-500">+91 {enquiry.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {enquiry.productName || 'General Enquiry'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={enquiry.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => openWhatsApp(enquiry.phone, enquiry.name, enquiry.productName)}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="WhatsApp"
                        >
                          <Icon name="MessageCircle" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <EnquiryDetailsModal />
    </div>
  );
};

export default EnquiryManagement;
