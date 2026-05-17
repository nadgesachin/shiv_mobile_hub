import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Toast from '../../components/ui/Toast';
import apiService from '../../services/api';

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Fetch latest user data
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.request('/auth/me', {
        method: 'GET',
        requiresAuth: true
      });
      
      if (response.success) {
        const userData = response.data.user;
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiService.request('/auth/update-profile', {
        method: 'PUT',
        data: {
          name: profileData.name,
          phone: profileData.phone
        },
        requiresAuth: true
      });

      if (response.success) {
        Toast.success('Profile updated successfully!');
        updateUser(response.data.user);
        setIsEditing(false);
      } else {
        Toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      Toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (user?.password && !passwordData.currentPassword) {
      Toast.error('Current password is required');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      Toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = user?.password ? '/auth/change-password' : '/auth/set-password';
      const data = user?.password 
        ? {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          }
        : {
            password: passwordData.newPassword
          };

      const response = await apiService.request(endpoint, {
        method: 'POST',
        data,
        requiresAuth: true
      });

      if (response.success) {
        Toast.success(user?.password ? 'Password changed successfully!' : 'Password set successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Refresh user data
        fetchUserProfile();
      } else {
        Toast.error(response.message || 'Failed to update password');
      }
    } catch (error) {
      Toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'messages', label: 'Messages', icon: 'MessageCircle' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6">
                {/* User Avatar */}
                <div className="flex flex-col items-center mb-6">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-24 h-24 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-3">
                      {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  {user?.googleId && (
                    <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                      <Icon name="Check" size={12} />
                      Google Account
                    </span>
                  )}
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">Profile Information</h2>
                        <p className="text-sm text-muted-foreground">Update your personal details</p>
                      </div>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                        >
                          <Icon name="Edit2" size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing || loading}
                        required
                      />
                      
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        helper="Email cannot be changed"
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing || loading}
                        placeholder="+91 XXXXX XXXXX"
                      />

                      {isEditing && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="submit"
                            disabled={loading}
                            loading={loading}
                          >
                            Save Changes
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              fetchUserProfile();
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">Security Settings</h2>
                      <p className="text-sm text-muted-foreground">
                        {user?.password 
                          ? 'Change your password to keep your account secure'
                          : 'Set a password for your account'
                        }
                      </p>
                    </div>

                    {user?.googleId && !user?.password && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-blue-900">Set a Password</h3>
                            <p className="text-sm text-blue-700">
                              You signed in with Google. Set a password to enable email/password login as well.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {user?.password && (
                        <Input
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          disabled={loading}
                          required
                        />
                      )}
                      
                      <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        disabled={loading}
                        helper="At least 6 characters"
                        required
                      />
                      
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        disabled={loading}
                        required
                      />

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          loading={loading}
                        >
                          {user?.password ? 'Change Password' : 'Set Password'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">Messages</h2>
                      <p className="text-sm text-muted-foreground">View and manage your conversations</p>
                    </div>

                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                        <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Your conversations will appear here
                      </p>
                      <Button
                        onClick={() => navigate('/chat')}
                      >
                        Go to Chat
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
