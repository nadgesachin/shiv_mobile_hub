import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // wait for AuthContext to finish loading user

    const check = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/login');
          return;
        }

        if (!isAdmin()) {
          navigate('/');
          return;
        }

        // Verify with the server that the user is still an admin
        const res = await apiService.getCurrentUser();
        if (res.data.user.role !== 'admin') {
          navigate('/');
        }
      } catch (error) {
        console.error('Admin authentication error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [navigate, isAuthenticated, isAdmin, isLoading]);

  if (isLoading || loading) return <div className="p-6 text-center">Checking access…</div>;
  return children;
};

export default AdminGuard;