import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: userData?.name,
    email: userData?.email,
    phone: userData?.phone,
    address: userData?.address,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e?.target?.name]: e?.target?.value });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">
        Account Settings
      </h2>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-smooth ${
              activeTab === tab?.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={18} />
            <span className="font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData?.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
          <Input
            label="Address"
            type="text"
            name="address"
            value={formData?.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
          />
          <div className="flex items-center space-x-3 pt-4">
            <Button variant="default" iconName="Save" iconPosition="left">
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      )}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
              <div>
                <p className="font-medium text-foreground mb-1">
                  Two-Factor Authentication Enabled
                </p>
                <p className="text-sm text-muted-foreground">
                  Your account is protected with 2FA
                </p>
              </div>
            </div>
          </div>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          <div className="flex items-center space-x-3 pt-4">
            <Button variant="default" iconName="Lock" iconPosition="left">
              Update Password
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      )}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Receive updates about your orders and services via email"
            checked
            onChange={() => {}}
          />
          <Checkbox
            label="SMS Notifications"
            description="Get instant alerts about service status via SMS"
            checked
            onChange={() => {}}
          />
          <Checkbox
            label="Push Notifications"
            description="Receive real-time notifications in your browser"
           
            onChange={() => {}}
          />
          <Checkbox
            label="Promotional Offers"
            description="Get notified about exclusive deals and offers"
            checked
            onChange={() => {}}
          />
          <div className="flex items-center space-x-3 pt-4">
            <Button variant="default" iconName="Save" iconPosition="left">
              Save Preferences
            </Button>
          </div>
        </div>
      )}
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Language Preference
            </label>
            <select className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground">
              <option>English</option>
              <option>हिंदी (Hindi)</option>
              <option>मराठी (Marathi)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Currency
            </label>
            <select className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground">
              <option>₹ INR - Indian Rupee</option>
            </select>
          </div>
          <Checkbox
            label="Show Service Recommendations"
            description="Display personalized service suggestions based on your history"
            checked
            onChange={() => {}}
          />
          <Checkbox
            label="Auto-Reorder Reminders"
            description="Get reminders for frequently ordered services"
            checked
            onChange={() => {}}
          />
          <div className="flex items-center space-x-3 pt-4">
            <Button variant="default" iconName="Save" iconPosition="left">
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;