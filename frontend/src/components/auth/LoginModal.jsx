import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toast from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ onClose, onLoginSuccess, redirectAfterLogin = false }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        Toast.success('Login successful!');
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        if (!redirectAfterLogin) {
          onClose();
        }
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { register } = useAuth();
      const result = await register({
        name: registerFormData.name,
        email: registerFormData.email,
        phone: registerFormData.phone,
        password: registerFormData.password
      });
      
      if (result.success) {
        Toast.success('Registration successful!');
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        if (!redirectAfterLogin) {
          onClose();
        }
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium">{showRegister ? 'Create an Account' : 'Login to Your Account'}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded bg-error/10 border border-error/20 text-error text-sm">
              <p className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </p>
            </div>
          )}

          {!showRegister ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />

              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-primary"
                >
                  Forgot Password?
                </Button>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Logging in...</span>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary p-0"
                    onClick={() => setShowRegister(true)}
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={registerFormData.name}
                onChange={handleRegisterChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={registerFormData.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={registerFormData.phone}
                onChange={handleRegisterChange}
                placeholder="Enter your phone number"
                required
                disabled={loading}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={registerFormData.password}
                onChange={handleRegisterChange}
                placeholder="Create a password"
                required
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={registerFormData.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />

              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Creating Account...</span>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary p-0"
                    onClick={() => setShowRegister(false)}
                  >
                    Login
                  </Button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
