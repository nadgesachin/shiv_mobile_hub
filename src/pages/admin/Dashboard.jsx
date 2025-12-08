import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, sections: 0, services: 0, users: 0 });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await apiService.getAdminStats();
        const { counts } = response.data;
        setStats({
          products: counts.products || 0,
          sections: counts.sections || 0,
          services: counts.services || 0,
          users: counts.users || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };
    fetchAdminStats();
  }, []);

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [stockStats, setStockStats] = useState({ low: 0, out: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch admin stats which includes recent data
        const adminStatsResponse = await apiService.getAdminStats();
        const { recent, stock } = adminStatsResponse.data;
        
        // Get recent products and users
        setRecentProducts(recent.products || []);
        
        // Get recent users separately since they're not in the stats
        const usersResponse = await apiService.getAdminUsers({ limit: 5, sort: 'createdAt' });
        setRecentUsers(usersResponse.data?.users || []);
        
        // Set stock stats
        setStockStats({
          low: stock?.low || 0,
          out: stock?.out || 0,
        });
      } catch (error) {
        console.error('Error fetching recent data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={stats.products} icon="Package" color="blue" />
        <StatCard label="Sections" value={stats.sections} icon="Grid3x3" color="green" />
        <StatCard label="Services" value={stats.services} icon="Wrench" color="purple" />
        <StatCard label="Users" value={stats.users} icon="Users" color="amber" />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-card border border-border rounded-lg p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Products</h3>
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => window.location.href = '/admin/products'}>
              View All
              <Icon name="ArrowRight" size={14} className="ml-1" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Package" size={24} className="mx-auto mb-2" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProducts.map(product => (
                <div key={product._id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <Icon name="Package" size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${product.stockStatus === 'in-stock' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {product.stockStatus === 'in-stock' ? 'In Stock' : 'Low Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-lg p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => window.location.href = '/admin/users'}>
              View All
              <Icon name="ArrowRight" size={14} className="ml-1" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Users" size={24} className="mx-auto mb-2" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentUsers.map(user => (
                <div key={user._id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Icon name="User" size={18} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const bgClass = colorClasses[color] || "bg-card";

  return (
    <div className={`border rounded-lg p-4 flex flex-col ${bgClass}`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium">{label}</p>
        <div className="p-2 rounded-md bg-white/70 border">
          <Icon name={icon} size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;