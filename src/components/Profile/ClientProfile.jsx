import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContextProvider';
import { useFitnessData } from '../Context/FitnessDataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import img5 from '../../assets/images/img1.jpg';
import Loader from '../Loader/Loader';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000
});

// Add retry logic for rate limiting
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || 30;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return api.request(error.config);
  }
  return Promise.reject(error);
});

// Mock data for orders, achievements, and activity feed
const mockOrders = [
  {
    id: 1,
    date: '2024-05-01',
    items: ['Protein Powder', 'Yoga Mat'],
    status: 'Delivered',
    total: 75.99,
  },
  {
    id: 2,
    date: '2024-04-15',
    items: ['Resistance Bands'],
    status: 'Shipped',
    total: 19.99,
  },
];

const mockAchievements = [
  { id: 1, label: '10 Sessions', icon: '🏅' },
  { id: 2, label: 'First Booking', icon: '🎉' },
  { id: 3, label: 'Goal Achiever', icon: '💪' },
];

const mockActivity = [
  { id: 1, date: '2024-05-10', text: 'Completed a training session with Coach Mike.' },
  { id: 2, date: '2024-05-08', text: 'Booked a new bundle: Summer Shred.' },
  { id: 3, date: '2024-05-05', text: 'Left a review for Trainer Sarah.' },
];

export default function ClientProfile() {
  const { token, logout } = useAuth();
  const { fitnessData } = useFitnessData();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bundles');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    phone: '',
    profilePhoto: null
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const tokenToUse = token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
        headers: { 'Authorization': `Bearer ${tokenToUse}` }
      });
      if (response.data.success) {
        if (response.data.data.role !== 'client') {
          navigate('/profile');
          return;
        }
        setUserInfo(response.data.data);
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        setError(null);
      } else {
        setError(response.data.message || 'Error fetching profile');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setError(err.response?.data?.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trainers
  const fetchTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/chat/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTrainers(response.data);
      const totalUnread = response.data.reduce((acc, trainer) => acc + (trainer.unreadCount || 0), 0);
      setUnreadMessages(totalUnread);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setError('Failed to load trainers');
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const tokenToUse = token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/bookings/client', {
        headers: { 'Authorization': `Bearer ${tokenToUse}` }
      });
      if (response.data) setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
    }
  };

  // Add function to fetch chat history
  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/chat/history/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data) {
        setChatHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to load chat history');
    }
  };

  // Add fetchOrders function
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const response = await api.get('/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Normalize the response data
      let ordersData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else {
          console.log('Unexpected response format:', response.data);
          throw new Error('Invalid response format');
        }
      }

      // Get unique product IDs
      const productIds = [...new Set(ordersData.map(order => order.productId))];

      // Fetch all products in a single request
      let productsMap = {};
      if (productIds.length > 0) {
        try {
          const productsResponse = await api.get('/products', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const products = Array.isArray(productsResponse.data) 
            ? productsResponse.data 
            : productsResponse.data.data || [];

          productsMap = products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {});
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      }

      // Group orders by createdAt timestamp
      const groupedOrders = ordersData.reduce((acc, order) => {
        const orderDate = new Date(order.createdAt);
        const groupKey = new Date(
          orderDate.getFullYear(),
          orderDate.getMonth(),
          orderDate.getDate(),
          orderDate.getHours(),
          orderDate.getMinutes()
        ).toISOString();

        if (!acc[groupKey]) {
          acc[groupKey] = {
            id: groupKey,
            createdAt: order.createdAt,
            status: order.status,
            items: []
          };
        }

        const productData = productsMap[order.productId] || order.product || {
          id: order.productId,
          name: 'Product Not Found',
          price: 0,
          photo: 'https://via.placeholder.com/100x100?text=Product+Not+Found'
        };

        acc[groupKey].items.push({
          id: order.id,
          quantity: parseInt(order.quantity || 1, 10),
          totalPrice: parseFloat(order.totalPrice || 0),
          product: {
            id: productData.id,
            name: productData.name,
            price: parseFloat(productData.price || 0),
            photo: productData.photo || productData.image || 'https://via.placeholder.com/100x100?text=Product+Image',
            description: productData.description || ''
          }
        });

        return acc;
      }, {});

      // Convert to array and sort by date
      const processedOrders = Object.values(groupedOrders).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(processedOrders);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers['retry-after'] || '30', 10);
        setOrdersError(`Too many requests. Please try again in ${retryAfter} seconds.`);
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchOrders();
          }, retryAfter * 1000);
        }
      } else {
        setOrdersError('Failed to fetch orders. Please try again later.');
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchOrders();
      setSuccessMessage('Order cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error cancelling order:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to cancel order. Please try again.');
      }
    }
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserProfile();
      await fetchTrainers();
      await fetchBookings();
      await fetchOrders();
    };
    initializeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: e.target.files[0]
    }));
  };

  const handleEditProfile = () => {
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      profilePhoto: null
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      const response = await axios.put('http://localhost:3000/api/v1/users/profile', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUserInfo(response.data.data);
        setSuccessMessage('Profile updated successfully!');
        setIsEditModalOpen(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  // Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F25454] border-b-4 border-gray-200"></div>
      </div>
    );
  }


  // Get the first letter of the user's name
  const userFirstLetter = (userInfo?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#10172A] flex flex-col items-center justify-center font-poppins">
      {/* Hero/Profile Section with background image and dark blue overlay */}
      <div className="w-full relative flex flex-col items-center justify-center">
        <div
          className="w-full h-64 flex items-end justify-center relative overflow-hidden"
          style={{
            backgroundImage: `url(${img5})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark blue overlay */}
          <div className="absolute inset-0 bg-[#1D2540]/80 z-0" />
        </div>
      </div>

      {/* User Credentials Card with avatar on the left and Edit Profile */}
      <div className="-mt-24 mb-10 w-full flex justify-center">
        <div className="relative bg-[#1D2540]/90 backdrop-blur-lg rounded-2xl shadow-2xl px-12 py-10 flex flex-row items-center max-w-2xl w-full border border-[#22305A] animate-fade-in" style={{ boxShadow: '0 8px 32px 0 rgba(29,37,64,0.25)' }}>
          {/* Avatar Circle */}
          <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 rounded-full bg-[#1D2540] shadow-lg border-4 border-white text-white text-4xl font-extrabold font-montserrat mr-8 animate-scale-up">
            {userFirstLetter}
          </div>
          {/* User Info */}
          <div className="flex-1 flex flex-col items-start">
            {/* Edit Profile Button */}
            <button
              className="absolute top-6 right-6 px-5 py-2 bg-white text-[#1D2540] rounded-full font-semibold shadow hover:bg-[#22305A] hover:text-white transition-all duration-200 text-sm md:text-base z-20 border border-[#22305A]"
              onClick={handleEditProfile}
            >
              <i className="fa-solid fa-pen mr-2"></i>Edit Profile
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white font-montserrat tracking-tight">{userInfo?.name}</h1>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-4 py-1 rounded-full text-base font-semibold bg-white/10 text-white border border-white">Client</span>
              <span className="text-base text-gray-200 font-poppins">{userInfo?.email}</span>
            </div>
            <div className="text-base text-gray-300 mb-2 font-poppins">Member since {new Date(userInfo?.createdAt).toLocaleDateString()}</div>
            <div className="flex gap-6 mt-2 text-sm md:text-base text-gray-200 font-poppins">
              {userInfo?.age && <span>Age: <span className="font-semibold text-white">{userInfo.age}</span></span>}
              {userInfo?.gender && <span>Gender: <span className="font-semibold text-white">{userInfo.gender}</span></span>}
              {userInfo?.phone && <span>Phone: <span className="font-semibold text-white">{userInfo.phone}</span></span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col items-center">
        {/* Tabs with icons and animated underline */}
        <div className="mb-10 flex gap-6 flex-wrap justify-center relative">
          {[
            { key: 'bundles', label: 'Booked Bundles', icon: '📦' },
            { key: 'chat', label: 'Chat', icon: '💬' },
            { key: 'orders', label: 'Orders', icon: '🛒' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-7 py-3 rounded-full font-semibold transition-all text-base md:text-lg shadow-sm flex items-center gap-2 font-montserrat ${activeTab === tab.key ? 'bg-[#1D2540] text-white scale-105 shadow-lg' : 'bg-white/80 text-[#1D2540] border border-[#1D2540] hover:bg-[#1D2540] hover:text-white'} animate-fade-in`}
              style={{ minWidth: 160 }}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-gradient-to-r from-[#1D2540] to-[#F25454] rounded-full animate-scale-up" />
              )}
              {tab.key === 'chat' && unreadMessages > 0 && (
                <span className="ml-2 bg-white text-[#1D2540] px-2 py-0.5 rounded-full text-xs font-bold">{unreadMessages}</span>
              )}
            </button>
          ))}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="w-full flex flex-col items-center">
        {activeTab === 'bundles' && (
          <div className="w-full animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-8 text-white text-center font-montserrat tracking-tight">My Booked Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#1D2540] flex flex-col justify-between hover:scale-105 transition-transform duration-300 animate-scale-up">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={booking.Bundle.Trainer.profilePhoto}
                        alt={booking.Bundle.Trainer.User.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#1D2540] shadow"
                      />
                      <div>
                        <div className="font-semibold text-[#1D2540] font-montserrat text-lg">{booking.Bundle.name}</div>
                        <div className="text-sm text-gray-500">with <span className="font-semibold text-gray-900">{booking.Bundle.Trainer.User.name}</span></div>
                      </div>
                      <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'active' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-700 text-base mb-2 font-poppins">{booking.Bundle.description}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div>Duration: <span className="text-gray-900 font-medium">{booking.Bundle.duration}</span></div>
                      <div>Price: <span className="text-gray-900 font-medium">${booking.Bundle.price}</span></div>
                      <div>Start: <span className="text-gray-900 font-medium">{new Date(booking.startDate).toLocaleDateString()}</span></div>
                      <div>End: <span className="text-gray-900 font-medium">{new Date(booking.endDate).toLocaleDateString()}</span></div>
                    </div>
                    <button
                      className="mt-auto px-4 py-2 bg-[#1D2540] text-white rounded-lg hover:bg-[#22305A] transition-colors font-semibold font-montserrat shadow"
                      onClick={() => {
                        const trainer = trainers.find(t => t.id === booking.Bundle.Trainer.id);
                        if (trainer) {
                          setSelectedTrainer(trainer);
                          setActiveTab('chat');
                        }
                      }}
                    >
                      Message Trainer
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-[#1D2540]/10 rounded-lg p-6 text-center font-poppins animate-fade-in">
                    <p className="text-[#1D2540]">No bundles booked yet</p>
                  </div>
                </div>
              )}
            </div>
            {/* Achievements */}
            <div className="mt-12 animate-fade-in">
              <h3 className="text-2xl font-bold mb-6 text-white text-center font-montserrat">Achievements</h3>
              <div className="flex gap-6 flex-wrap justify-center">
                {mockAchievements.map((ach) => (
                  <div key={ach.id} className="flex flex-col items-center bg-white/90 rounded-lg shadow p-6 border border-[#1D2540] w-36 hover:scale-105 transition-transform animate-scale-up">
                    <span className="text-5xl mb-2 animate-fade-in-delay">{ach.icon}</span>
                    <span className="font-semibold text-[#1D2540] text-base text-center font-montserrat">{ach.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Activity Feed */}
            <div className="mt-12 animate-fade-in">
              <h3 className="text-2xl font-bold mb-6 text-white text-center font-montserrat">Recent Activity</h3>
              <ul className="space-y-3 max-w-2xl mx-auto">
                {mockActivity.map((act) => (
                  <li key={act.id} className="bg-white/90 rounded-lg shadow p-4 border border-[#1D2540] flex items-center gap-3 animate-scale-up">
                    <span className="text-xs text-[#1D2540]/60 w-24 font-mono">{act.date}</span>
                    <span className="text-[#1D2540] text-base font-poppins">{act.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full animate-fade-in">
            {/* Trainers List */}
            <div className="bg-white/90 rounded-xl shadow p-6 border border-[#1D2540] md:col-span-1 animate-scale-up">
              <h3 className="text-xl font-bold mb-6 text-[#1D2540] text-center font-montserrat">Your Trainers</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {trainers.length > 0 ? trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      fetchChatHistory(trainer.id);
                    }}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedTrainer?.id === trainer.id ? 'bg-[#1D2540]/10' : 'hover:bg-[#1D2540]/5'} animate-fade-in`}
                  >
                    <img
                      src={trainer.profilePhoto || 'https://via.placeholder.com/40'}
                      alt={trainer.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#1D2540] shadow"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[#1D2540] font-montserrat text-lg">{trainer.name}</div>
                      {trainer.unreadCount > 0 && (
                        <span className="ml-2 bg-[#1D2540] text-white px-2 py-0.5 rounded-full text-xs font-bold animate-fade-in-delay">
                          {trainer.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-[#1D2540]/60 text-center font-poppins animate-fade-in">No trainers found</div>
                )}
              </div>
            </div>
            {/* Chat Area */}
            <div className="bg-white/90 rounded-xl shadow p-6 border border-[#1D2540] md:col-span-2 min-h-[400px] flex flex-col animate-scale-up">
              {selectedTrainer ? (
                <Chat 
                  userId={selectedTrainer.id} 
                  userName={selectedTrainer.name} 
                  chatHistory={chatHistory}
                  onNewMessage={(message) => {
                    setChatHistory(prev => [...prev, message]);
                  }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#1D2540]/60 font-poppins animate-fade-in">
                  Select a trainer to start chatting
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="w-full animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-8 text-white text-center font-montserrat tracking-tight">My Orders</h2>
            {ordersLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : ordersError ? (
              <div className="text-center p-8 bg-white/90 rounded-lg shadow-md">
                <p className="text-red-600 mb-4">{ordersError}</p>
                <button 
                  onClick={fetchOrders} 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white/90 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => navigate('/products')} 
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/90 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-4 flex items-center">
                            <img 
                              src={item.product.photo} 
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=Product+Image';
                              }}
                            />
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-800">
                                ${item.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Total</span>
                          <span className="text-xl font-bold text-gray-800">
                            ${calculateOrderTotal(order.items).toFixed(2)}
                          </span>
                        </div>
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelOrder(order.items[0].id)}
                            className="mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1D2540] font-montserrat">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-[#1D2540]"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D2540] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D2540] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-[#1D2540] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1D2540] text-white rounded-lg hover:bg-[#22305A] transition-colors font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 