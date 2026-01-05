import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError, user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && token) {
      // If admin user, redirect to admin dashboard
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // For regular users, redirect to previous location or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [user, token, navigate]);

  // Clear any existing errors on component mount
  useEffect(() => {
    clearError();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const result = await login(formData.email, formData.password, formData.role);
      
      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth login
  // Google Sign-In Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: credential }),
      });
      
      const data = await response.json();
      
      if (data.success && data.token && data.user) {
        // Update auth context (this will save to localStorage and update state)
        login(data.user, data.token);
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setLoginError(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Google login failed. Please try again.');
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google login failed');
    setLoginError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow">
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="Lock" size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your Shiv Mobile Hub account
              </p>
            </div>

            {/* Login Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {(loginError || error) && (
                <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
                  <Icon name="AlertCircle" size={20} />
                  <span className="text-sm">{loginError || error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Login as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    name="role"
                    value="user"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-smooth ${
                      formData.role === 'user'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="User" size={18} />
                    <span className="font-medium">User</span>
                  </button>
                  <button
                    type="button"
                    name="role"
                    value="admin"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-smooth ${
                      formData.role === 'admin'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="Shield" size={18} />
                    <span className="font-medium">Admin</span>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSubmitting || isLoading}
                className="w-full"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Google OAuth */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                  type="standard"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="384"
                />
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
