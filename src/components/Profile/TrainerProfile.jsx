import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import img5 from '../../assets/images/img1.jpg';

const TrainerProfile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    profilePhoto: null
  });
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const tokenToUse = token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
        headers: { 'Authorization': `Bearer ${tokenToUse}` }
      });
      if (response.data.success) {
        if (response.data.data.role !== 'trainer') {
          navigate('/profile');
          return;
        }
        setProfile(response.data.data);
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

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/chat/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setClients(response.data);
      const totalUnread = response.data.reduce((acc, client) => acc + (client.unreadCount || 0), 0);
      setUnreadMessages(totalUnread);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients');
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const tokenToUse = token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/bookings/trainer', {
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

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserProfile();
      await fetchClients();
      await fetchBookings();
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
      name: profile?.name || '',
      email: profile?.email || '',
      specialization: profile?.Trainer?.specialization || '',
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
      formDataToSend.append('specialization', formData.specialization);
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      const response = await axios.put('http://localhost:3000/api/v1/users/profile', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setProfile(response.data.data);
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
      <div className="min-h-screen flex items-center justify-center bg-[#10172A]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F25454] border-b-4 border-gray-200"></div>
      </div>
    );
  }

  // Get the first letter of the user's name
  const userFirstLetter = (profile?.name || 'T').charAt(0).toUpperCase();

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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white font-montserrat tracking-tight">{profile?.name}</h1>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-4 py-1 rounded-full text-base font-semibold bg-white/10 text-white border border-white">Trainer</span>
              <span className="text-base text-gray-200 font-poppins">{profile?.email}</span>
            </div>
            <div className="text-base text-gray-300 mb-2 font-poppins">Member since {new Date(profile?.createdAt).toLocaleDateString()}</div>
            <div className="flex gap-6 mt-2 text-sm md:text-base text-gray-200 font-poppins">
              <span>Specialization: <span className="font-semibold text-white">{profile?.Trainer?.specialization}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col items-center">
        {/* Tabs with icons and animated underline */}
        <div className="mb-10 flex gap-6 flex-wrap justify-center relative">
          {[
            { key: 'clients', label: 'Active Clients', icon: '👥' },
            { key: 'chat', label: 'Chat', icon: '💬' },
            { key: 'bookings', label: 'Bookings', icon: '📅' },
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
          {activeTab === 'clients' && (
            <div className="w-full animate-fade-in">
              <h2 className="text-3xl font-extrabold mb-8 text-white text-center font-montserrat tracking-tight">Active Clients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <div key={client.id} className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#1D2540] flex flex-col justify-between hover:scale-105 transition-transform duration-300 animate-scale-up">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1D2540] to-[#F25454] flex items-center justify-center text-white text-2xl font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1D2540] font-montserrat text-lg">{client.name}</div>
                          <div className="text-sm text-gray-500">Client</div>
                        </div>
                      </div>
                      <button
                        className="mt-auto px-4 py-2 bg-[#1D2540] text-white rounded-lg hover:bg-[#22305A] transition-colors font-semibold font-montserrat shadow"
                        onClick={() => {
                          setSelectedClient(client);
                          setActiveTab('chat');
                        }}
                      >
                        Message Client
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-[#1D2540]/10 rounded-lg p-6 text-center font-poppins animate-fade-in">
                      <p className="text-[#1D2540]">No active clients</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full animate-fade-in">
              {/* Clients List */}
              <div className="bg-white/90 rounded-xl shadow p-6 border border-[#1D2540] md:col-span-1 animate-scale-up">
                <h3 className="text-xl font-bold mb-6 text-[#1D2540] text-center font-montserrat">Your Clients</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {clients.length > 0 ? clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        fetchChatHistory(client.id);
                      }}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-[#1D2540]/10' : 'hover:bg-[#1D2540]/5'} animate-fade-in`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1D2540] to-[#F25454] flex items-center justify-center text-white text-xl font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#1D2540] font-montserrat text-lg">{client.name}</div>
                        {client.unreadCount > 0 && (
                          <span className="ml-2 bg-[#1D2540] text-white px-2 py-0.5 rounded-full text-xs font-bold animate-fade-in-delay">
                            {client.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-[#1D2540]/60 text-center font-poppins animate-fade-in">No clients found</div>
                  )}
                </div>
              </div>
              {/* Chat Area */}
              <div className="bg-white/90 rounded-xl shadow p-6 border border-[#1D2540] md:col-span-2 min-h-[400px] flex flex-col animate-scale-up">
                {selectedClient ? (
                  <Chat 
                    userId={selectedClient.id} 
                    userName={selectedClient.name} 
                    chatHistory={chatHistory}
                    onNewMessage={(message) => {
                      setChatHistory(prev => [...prev, message]);
                    }}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[#1D2540]/60 font-poppins animate-fade-in">
                    Select a client to start chatting
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="w-full animate-fade-in">
              <h2 className="text-3xl font-extrabold mb-8 text-white text-center font-montserrat tracking-tight">Active Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#1D2540] flex flex-col justify-between hover:scale-105 transition-transform duration-300 animate-scale-up">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1D2540] to-[#F25454] flex items-center justify-center text-white text-2xl font-bold">
                          {booking.Client?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1D2540] font-montserrat text-lg">{booking.Bundle.name}</div>
                          <div className="text-sm text-gray-500">with <span className="font-semibold text-gray-900">{booking.Client?.name}</span></div>
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
                          const client = clients.find(c => c.id === booking.Client.id);
                          if (client) {
                            setSelectedClient(client);
                            setActiveTab('chat');
                          }
                        }}
                      >
                        Message Client
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-[#1D2540]/10 rounded-lg p-6 text-center font-poppins animate-fade-in">
                      <p className="text-[#1D2540]">No active bookings</p>
                    </div>
                  </div>
                )}
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D2540] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D2540] focus:border-transparent"
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
};

export default TrainerProfile;
