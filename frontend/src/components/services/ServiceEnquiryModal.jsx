import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toast from '../ui/Toast';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { openChatWithLink } from '../../utils/ChatUtil';
import LoginModal from '../auth/LoginModal';

const ServiceEnquiryModal = ({ service, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: `I'm interested in ${service.name} service. Please provide more information.`
  });
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChatInApp = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    openChatWithLink(
      {
        name: service.name,
        url: `${window.location.origin}/services-hub/${service._id}`,
      },
      'book'
    );
    onClose();
  };

  const copyServiceLink = () => {
    const url = `${window.location.origin}/services-hub/${service._id}`;
    navigator.clipboard.writeText(url)
      .then(() => Toast.success('Service link copied to clipboard'))
      .catch(() => Toast.error('Failed to copy link'));
  };

  const sendEnquiryMessage = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    setLoading(true);

    try {
      // If user is logged in, send as chat message
      if (isAuthenticated()) {
        await apiService.post('/api/messages/send', {
          recipientId: 'admin', // Replace with actual admin ID or use a special identifier
          message: formData.message,
          type: 'service_enquiry',
          serviceId: service._id
        });
      } else {
        // Send as anonymous enquiry
        await apiService.post('/api/enquiries', {
          ...formData,
          serviceId: service._id,
          type: 'service'
        });
      }

      Toast.success('Enquiry sent successfully! We will contact you shortly.');
      onClose();
    } catch (error) {
      console.error('Error sending enquiry:', error);
      Toast.error('Failed to send enquiry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const shareVia = (platform) => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    const url = encodeURIComponent(`${window.location.origin}/services-hub/${service._id}`);
    const title = encodeURIComponent(`Check out ${service.name}`);
    const text = encodeURIComponent(`I found this amazing service: ${service.name}`);
    const serviceInfo = encodeURIComponent(`
      Service: ${service.name}
      Description: ${service.description || 'No description available'}
      Price: ₹${service.price}
      Duration: ${service.duration || 'N/A'}
      Link: ${window.location.origin}/services-hub/${service._id}
    `);

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?phone=+917123456789&text=${serviceInfo}`;
        break;
      case 'facebook':
        shareUrl = `https://m.me/shivmobilehub?text=${serviceInfo}`;
        break;
      case 'instagram':
        // Usually opens Instagram profile, DM not directly supported via URL
        shareUrl = `https://instagram.com/shivmobilehub`;
        Toast.info('Instagram opened. Please send us a DM with your enquiry');
        break;
      case 'email':
        shareUrl = `mailto:info@shivmobilehub.com?subject=Enquiry about ${title}&body=${serviceInfo}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // You can perform additional actions after successful login if needed
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-medium">Book This Service</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <Icon name="X" size={18} />
            </Button>
          </div>

          <div className="p-4">
            {/* Service Info */}
            <div className="flex gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: `${service.iconColor || '#4f46e5'}15` }}
              >
                <Icon 
                  name={service.icon || 'Settings'} 
                  size={28} 
                  color={service.iconColor || 'var(--color-primary)'}
                />
              </div>
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{service.price?.toLocaleString() || 'Price varies'}
                  {service.duration && ` • ${service.duration}`}
                </p>
              </div>
            </div>

            {/* Contact Options */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Book via:</h3>
              <div className="grid grid-cols-5 gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={() => shareVia('whatsapp')}
                >
                  <Icon name="Phone" size={18} className="text-green-600" />
                  <span className="text-xs mt-1">WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={() => shareVia('facebook')}
                >
                  <Icon name="Facebook" size={18} className="text-blue-600" />
                  <span className="text-xs mt-1">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={() => shareVia('instagram')}
                >
                  <Icon name="Instagram" size={18} className="text-pink-600" />
                  <span className="text-xs mt-1">Instagram</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={() => shareVia('email')}
                >
                  <Icon name="Mail" size={18} className="text-purple-600" />
                  <span className="text-xs mt-1">Email</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={handleChatInApp}
                >
                  <Icon name="MessageCircle" size={18} className="text-primary" />
                  <span className="text-xs mt-1">Chat in App</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16"
                  onClick={copyServiceLink}
                >
                  <Icon name="Copy" size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">Copy Link</span>
                </Button>
              </div>
            </div>

            {/* Send Message Form */}
            <form onSubmit={sendEnquiryMessage}>
              <h3 className="font-medium mb-2">Send us a message:</h3>
              <div className="space-y-3">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  disabled={loading}
                />

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  disabled={loading}
                />

                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  disabled={loading}
                />

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={3}
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    </>
                  ) : (
                    'Send Enquiry'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default ServiceEnquiryModal;
