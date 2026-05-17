import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Toast from '../../components/ui/Toast';
import apiService from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        setSent(true);
        // In development, show the reset link
        if (response.resetUrl) {
          setResetLink(response.resetUrl);
        }
        Toast.success(response.message);
      } else {
        Toast.error(response.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
              <Icon name="Lock" size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              {sent 
                ? 'Check your email for the reset link' 
                : 'No worries, we\'ll send you reset instructions'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  iconName="Mail"
                />
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-1">Email Sent!</h3>
                    <p className="text-sm text-emerald-700">
                      We've sent a password reset link to <strong>{email}</strong>. 
                      The link will expire in 5 minutes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Development only - show reset link */}
              {resetLink && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertCircle" size={24} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900 mb-1">Development Mode</h3>
                      <p className="text-sm text-yellow-700 mb-2">
                        In production, this link would be sent via email:
                      </p>
                      <div className="bg-white rounded-lg p-2 border border-yellow-300">
                        <a 
                          href={resetLink} 
                          className="text-xs text-primary hover:underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resetLink}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What's next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Check your email inbox</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Click the reset link (expires in 5 minutes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Create a new password</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                    setResetLink('');
                  }}
                >
                  Try Another Email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" fullWidth>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? {' '}
            <Link to="/contact" className="text-primary hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
