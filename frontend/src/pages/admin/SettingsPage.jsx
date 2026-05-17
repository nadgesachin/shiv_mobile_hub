import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import apiService from '../../services/api';

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  
  const [settings, setSettings] = useState({
    socialMedia: {
      website: '',
      whatsapp: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      telegram: '',
      snapchat: '',
      tiktok: '',
      pinterest: ''
    },
    contact: {
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    businessHours: {
      weekdays: '',
      weekends: ''
    },
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    }
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchSettings();
  }, [isAdmin, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/settings');
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await apiService.request('/settings', {
        method: 'PUT',
        data: settings
      });
      
      if (response.success) {
        Toast.success('Settings saved successfully!');
      } else {
        Toast.error(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'social', label: 'Social Media', icon: 'Share2' },
    { id: 'contact', label: 'Contact Info', icon: 'Phone' },
    { id: 'business', label: 'Business Hours', icon: 'Clock' },
    { id: 'location', label: 'Location', icon: 'MapPin' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your store settings and social media links
            </p>
          </div>
          <Button
            onClick={handleSaveSettings}
            loading={saving}
            iconName="Save"
          >
            Save Changes
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-6">
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Share2" size={20} className="mr-2 text-primary" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Online Platform Links</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your online platform URLs. These will be displayed throughout the website.
                    </p>
                  </div>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Globe" size={16} className="inline mr-2" />
                    Website URL
                  </label>
                  <Input
                    name="website"
                    value={settings.socialMedia.website}
                    onChange={(e) => handleInputChange('socialMedia', 'website', e.target.value)}
                    placeholder="https://www.yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="MessageCircle" size={16} className="inline mr-2" />
                    WhatsApp
                  </label>
                  <Input
                    name="whatsapp"
                    value={settings.socialMedia.whatsapp}
                    onChange={(e) => handleInputChange('socialMedia', 'whatsapp', e.target.value)}
                    placeholder="https://wa.me/919876543210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Facebook" size={16} className="inline mr-2" />
                    Facebook
                  </label>
                  <Input
                    name="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Instagram" size={16} className="inline mr-2" />
                    Instagram
                  </label>
                  <Input
                    name="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Twitter" size={16} className="inline mr-2" />
                    Twitter / X
                  </label>
                  <Input
                    name="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Youtube" size={16} className="inline mr-2" />
                    YouTube
                  </label>
                  <Input
                    name="youtube"
                    value={settings.socialMedia.youtube}
                    onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Linkedin" size={16} className="inline mr-2" />
                    LinkedIn
                  </label>
                  <Input
                    name="linkedin"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => handleInputChange('socialMedia', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Send" size={16} className="inline mr-2" />
                    Telegram
                  </label>
                  <Input
                    name="telegram"
                    value={settings.socialMedia.telegram}
                    onChange={(e) => handleInputChange('socialMedia', 'telegram', e.target.value)}
                    placeholder="https://t.me/yourchannel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Camera" size={16} className="inline mr-2" />
                    Snapchat
                  </label>
                  <Input
                    name="snapchat"
                    value={settings.socialMedia.snapchat}
                    onChange={(e) => handleInputChange('socialMedia', 'snapchat', e.target.value)}
                    placeholder="https://snapchat.com/add/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Music" size={16} className="inline mr-2" />
                    TikTok
                  </label>
                  <Input
                    name="tiktok"
                    value={settings.socialMedia.tiktok}
                    onChange={(e) => handleInputChange('socialMedia', 'tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Icon name="Image" size={16} className="inline mr-2" />
                    Pinterest
                  </label>
                  <Input
                    name="pinterest"
                    value={settings.socialMedia.pinterest}
                    onChange={(e) => handleInputChange('socialMedia', 'pinterest', e.target.value)}
                    placeholder="https://pinterest.com/yourprofile"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium">Pro Tip</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Make sure to enter complete URLs including https://. Leave blank if you don't want to display a particular social link.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Phone" size={20} className="mr-2 text-primary" />
                  Contact Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Update your shop's contact details displayed on the website.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={settings.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  icon="Phone"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="info@shivmobilehub.com"
                  value={settings.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  icon="Mail"
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    placeholder="Shop No. 12, Main Market"
                    value={settings.contact.address}
                    onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                    icon="MapPin"
                  />
                </div>
                
                <Input
                  label="City"
                  placeholder="Mumbai"
                  value={settings.contact.city}
                  onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                />
                
                <Input
                  label="State"
                  placeholder="Maharashtra"
                  value={settings.contact.state}
                  onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                />
                
                <Input
                  label="Pincode"
                  placeholder="400001"
                  value={settings.contact.pincode}
                  onChange={(e) => handleInputChange('contact', 'pincode', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="Clock" size={20} className="mr-2 text-primary" />
                  Business Hours
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Set your shop's opening hours for customers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Weekdays (Mon-Fri)"
                  placeholder="10:00 AM - 8:00 PM"
                  value={settings.businessHours.weekdays}
                  onChange={(e) => handleInputChange('businessHours', 'weekdays', e.target.value)}
                  icon="Calendar"
                />
                
                <Input
                  label="Weekends (Sat-Sun)"
                  placeholder="10:00 AM - 9:00 PM"
                  value={settings.businessHours.weekends}
                  onChange={(e) => handleInputChange('businessHours', 'weekends', e.target.value)}
                  icon="CalendarDays"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900 font-medium">Note</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      These hours will be displayed on your contact page and footer. Make sure they're accurate and up to date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Icon name="MapPin" size={20} className="mr-2 text-primary" />
                  Shop Location
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Set your shop's GPS coordinates for Google Maps integration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="0.000001"
                  placeholder="28.6139"
                  value={settings.location.latitude}
                  onChange={(e) => handleInputChange('location', 'latitude', parseFloat(e.target.value))}
                  icon="Navigation"
                />
                
                <Input
                  label="Longitude"
                  type="number"
                  step="0.000001"
                  placeholder="77.2090"
                  value={settings.location.longitude}
                  onChange={(e) => handleInputChange('location', 'longitude', parseFloat(e.target.value))}
                  icon="Navigation"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 font-medium">How to find coordinates</p>
                    <p className="text-sm text-green-700 mt-1">
                      Open Google Maps → Right-click on your shop location → Click on the coordinates to copy them
                    </p>
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Open Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button (Bottom) */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            loading={saving}
            iconName="Save"
            size="lg"
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
