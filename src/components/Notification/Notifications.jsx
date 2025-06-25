import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../Context/NotificationContextProvider';
import { AuthContext } from '../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function Notifications() {
  const { notifications, loading, error, markAsRead, clearNotifications, fetchNotifications } = useContext(NotificationContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    console.log('Notifications component mounted, fetching notifications...');
    fetchNotifications();
  }, [token, navigate]);

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'unread') return !notification.isRead;
    if (selectedFilter === 'read') return notification.isRead;
    return true;
  });

  console.log('Current notifications state:', notifications);
  console.log('Current filter:', selectedFilter);
  console.log('Filtered notifications:', filteredNotifications);

  const handleMarkAllAsRead = async () => {
    try {
      console.log('Marking all as read...'); // Debug log
      const response = await fetch('http://localhost:3000/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        console.log('Successfully marked all as read'); // Debug log
        fetchNotifications();
      } else {
        console.error('Failed to mark all as read:', await response.text()); // Debug log
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      console.log('Deleting notification:', id); // Debug log
      const response = await fetch(`http://localhost:3000/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        console.log('Successfully deleted notification'); // Debug log
        fetchNotifications();
      } else {
        console.error('Failed to delete notification:', await response.text()); // Debug log
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    console.log('Loading state active');
    return <Loader />;
  }

  if (error) {
    console.error('Error state:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  console.log('Rendering notifications component with data:', {
    notificationsCount: notifications.length,
    filteredCount: filteredNotifications.length,
    selectedFilter
  });

  return (
    <div className="container pt-30 mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  console.log('Filter changed to:', e.target.value);
                  setSelectedFilter(e.target.value);
                }}
                className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              <button
                onClick={handleMarkAllAsRead}
                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              console.log('Rendering notification:', notification);
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{notification.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'No date'}</span>
                        <span className="mx-2">•</span>
                        <span>{notification.isRead ? 'Read' : 'Unread'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
