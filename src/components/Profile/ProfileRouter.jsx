import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrainerProfile from './TrainerProfile';
import ClientProfile from './ClientProfile';

export default function ProfileRouter() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!token && !localStorage.getItem('token')) {
        navigate('/login');
        return;
      }

      try {
        const tokenToUse = token || localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${tokenToUse}`
          }
        });

        if (response.data.success) {
          setUserRole(response.data.data.role);
        } else {
          logout();
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [token, navigate, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
        </div>
      </div>
    );
  }

  return userRole === 'trainer' ? <TrainerProfile /> : <ClientProfile />;
} 