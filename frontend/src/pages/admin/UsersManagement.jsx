import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });
  const [viewUser, setViewUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'user', name: 'User' },
    { id: 'admin', name: 'Admin' }
  ];

  // Fetch users
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getAdminUsers({
        page: pagination.current,
        limit: pagination.limit,
        ...params
      });
      
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole]);

  // Handle toggle user status
  const handleToggleStatus = async (id) => {
    try {
      await apiService.toggleUserStatus(id);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to toggle user status');
    }
  };

  // Handle role update
  const handleRoleUpdate = async (id, role) => {
    try {
      await apiService.updateUserRole(id, role);
      await fetchUsers();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
    fetchUsers({ page });
  };

  // View user details
  const handleViewUser = (user) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewUser(null);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Users Management</h2>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
          <Icon name="AlertCircle" size={20} />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Role Filter */}
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" onClick={() => fetchUsers()}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedRole !== 'all' 
              ? 'Try adjusting your filters' 
              : 'There are no users in the system'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="User" size={14} className="text-primary" />
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStatus(user._id)}
                      >
                        <Icon name={user.isActive ? 'Ban' : 'Check'} size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRoleUpdate(
                          user._id, 
                          user.role === 'admin' ? 'user' : 'admin'
                        )}
                      >
                        <Icon name={user.role === 'admin' ? 'UserMinus' : 'UserPlus'} size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === 1}
              onClick={() => handlePageChange(pagination.current - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.current} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === pagination.pages}
              onClick={() => handlePageChange(pagination.current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isViewModalOpen && viewUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">User Details</h3>
                <Button variant="ghost" size="sm" onClick={handleCloseViewModal}>
                  <Icon name="X" size={16} />
                </Button>
              </div>

              <div className="flex flex-col items-center mb-4 pb-4 border-b border-border">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                  {viewUser.avatar ? (
                    <img src={viewUser.avatar} alt={viewUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="User" size={32} className="text-primary" />
                  )}
                </div>
                <h4 className="text-lg font-medium">{viewUser.name}</h4>
                <p className="text-muted-foreground">{viewUser.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      viewUser.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {viewUser.role}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      viewUser.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {viewUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="text-sm font-mono">{viewUser._id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm">{viewUser.phone || 'Not provided'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <span className="text-sm">{viewUser.isEmailVerified ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Joined On</span>
                  <span className="text-sm">{new Date(viewUser.createdAt).toLocaleDateString()}</span>
                </div>
                
                {viewUser.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="text-sm">{new Date(viewUser.lastLogin).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {viewUser.address && Object.values(viewUser.address).some(v => v) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Address</h4>
                  <div className="space-y-2">
                    {viewUser.address.street && (
                      <p className="text-sm">{viewUser.address.street}</p>
                    )}
                    <p className="text-sm">
                      {[
                        viewUser.address.city,
                        viewUser.address.state,
                        viewUser.address.pincode
                      ].filter(Boolean).join(', ')}
                    </p>
                    {viewUser.address.country && (
                      <p className="text-sm">{viewUser.address.country}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={handleCloseViewModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
