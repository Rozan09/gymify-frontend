import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextProvider';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markAsRead: () => {},
  clearNotifications: () => {},
  fetchNotifications: () => {}
});

const API_BASE_URL = 'http://localhost:3000/api/v1/notifications';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function NotificationContextProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, logout } = useContext(AuthContext);

  // Add request interceptor to add token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle common errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else if (error.response?.status === 401) {
        logout();
        setError('Session expired. Please login again.');
      } else {
        setError(error.response?.data?.message || error.message || 'An error occurred');
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch notifications...');

      const response = await api.get('/');
      console.log('Raw API Response:', response);
      console.log('API Response Data:', response.data);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      // Match the exact API response structure
      const notificationData = response.data.notifications || [];
      const count = response.data.unreadCount || 0;
      
      console.log('Processed Notification Data:', notificationData);
      console.log('Processed Unread Count:', count);
      
      setNotifications(notificationData);
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      console.error('Notifications fetch error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      setNotifications([]);
      setUnreadCount(0);
      setError(err.response?.data?.message || err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Add effect to log state changes
  useEffect(() => {
    console.log('Notifications state updated:', notifications);
    console.log('Unread count updated:', unreadCount);
  }, [notifications, unreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      setError(null);
      await api.put(`/${notificationId}/read`);
      await fetchNotifications();
      return true;
    } catch (err) {
      console.error('Mark as read error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to mark notification as read');
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      setError(null);
      await api.put('/read-all');
      await fetchNotifications();
      return true;
    } catch (err) {
      console.error('Mark all as read error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to mark all notifications as read');
      return false;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setError(null);
      await api.delete(`/${notificationId}`);
      await fetchNotifications();
      return true;
    } catch (err) {
      console.error('Delete notification error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete notification');
      return false;
    }
  };

  const clearNotifications = async () => {
    try {
      setError(null);
      const promises = notifications.map(notification => deleteNotification(notification.id));
      await Promise.all(promises);
      setNotifications([]);
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Clear notifications error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to clear notifications');
      return false;
    }
  };

  const contextValue = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}