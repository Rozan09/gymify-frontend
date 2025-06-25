import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../Profile/Chat';
import TrainerBundles from './TrainerBundles';
import { AuthContext } from '../Context/AuthContextProvider';
import { format } from 'date-fns';
import Loader from '../Loader/Loader';

const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [hasBookedBundle, setHasBookedBundle] = useState(false);
  const [transformations, setTransformations] = useState([]);

  const handleSectionClick = (section) => {
    if (section === 'transformation') {
      navigate(`/transformation/${id}`);
      return;
    }
    setActiveSection(section);
  };

  const handleMessageClick = () => {
    setShowChat(true);
  };

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/trainers/${id}`);
        const trainerData = res.data.data.find(t => t.id === parseInt(id));
        if (trainerData) {
          setTrainer(trainerData);
        } else {
          setError('Trainer not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch trainer details');
        setLoading(false);
      }
    };

    const checkBookingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/bookings/client`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        // Check if any of the client's bundles are from this trainer
        const hasActiveBundle = response.data.some(booking => 
          booking.Bundle.Trainer.id === parseInt(id) && 
          (booking.status === 'active' || booking.status === 'pending')
        );
        setHasBookedBundle(hasActiveBundle || false);
      } catch (err) {
        console.error('Error checking booking status:', err);
        setHasBookedBundle(false);
      }
    };

    const fetchTransformations = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/transformations/trainer/${id}`);
        setTransformations(response.data.data);
      } catch (err) {
        console.error('Error fetching transformations:', err);
      }
    };

    fetchTrainer();
    if (token) {
      checkBookingStatus();
    }
    fetchTransformations();
  }, [id, token]);

  if (loading) return (
    <Loader/>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4857] to-[#ffb404] rounded-2xl blur opacity-25"></div>
          <div className="relative bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-red-50 rounded-full p-3">
                <svg className="h-8 w-8 text-[#ff4857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Error Loading Trainer</h3>
                <p className="mt-1 text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!trainer) return null;

  // Determine trainer type and color scheme
  const specialization = trainer.specialization || '';
  const isNutritionist = specialization.toLowerCase().includes('nutrition');
  const primaryColor = isNutritionist ? '#ffb404' : '#ff4857';
  const secondaryColor = isNutritionist ? '#ffd27d' : '#ff8b95';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Floating Profile Card */}
      <div className="relative h-screen pt-20 pb-40 bg-gradient-to-br from-[#001f3f] to-[#000814]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Floating Profile Card */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
              <div className="relative h-[500px] flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={trainer.profilePhoto || 'https://via.placeholder.com/800x1000'}
                    alt={`${trainer.User?.name || 'Trainer'}'s profile`}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
                </div>

                {/* Info Section */}
              <div className="p-12 flex flex-col justify-center text-white">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span 
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {specialization || 'Personal Trainer'}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-600 ml-2">
                          {trainer.rating || '4.9'} ({trainer.reviewCount || '150'})
                        </span>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{trainer.User?.name || 'Trainer'}</h1>
                    <p className="text-gray-600 mb-8">
                      {trainer.bio || `Expert ${specialization.toLowerCase()} trainer dedicated to helping clients achieve their fitness and wellness goals through personalized training programs and continuous support.`}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Book Session
                    </button>
                    <button
                      onClick={handleMessageClick}
                      className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border-2 ${
                        !hasBookedBundle ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ 
                        color: primaryColor,
                        borderColor: primaryColor
                      }}
                      disabled={!hasBookedBundle}
                      title={!hasBookedBundle ? "Book a bundle to chat with the trainer" : ""}
                    >
                      {hasBookedBundle ? "Message" : "Book Bundle to Message"}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'bundles', 'transformation', 'reviews'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === section
                    ? `border-[${primaryColor}] text-[${primaryColor}]`
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

   <div className='container m-auto'>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeSection === 'overview' && (
              <div className="space-y-8">
                {/* Specializations */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Specializations</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "Weight Training",
                      "Cardio Fitness",
                      "Nutrition",
                      "HIIT",
                      "Yoga",
                      "CrossFit"
                    ].map((spec) => (
                      <div 
                        key={spec}
                        className="p-4 rounded-xl text-center transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: `${primaryColor}08` }}
                      >
                        <div className="text-lg font-medium" style={{ color: primaryColor }}>
                          {spec}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Certifications</h2>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Certified Personal Trainer",
                        org: "National Academy of Sports Medicine",
                        year: "2021"
                      },
                      {
                        name: "Nutrition Specialist",
                        org: "Precision Nutrition",
                        year: "2020"
                      },
                      {
                        name: "First Aid & CPR",
                        org: "Red Cross",
                        year: "2023"
                      }
                    ].map((cert) => (
                      <div 
                        key={cert.name}
                        className="p-4 rounded-xl transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: `${primaryColor}08` }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${primaryColor}15` }}
                          >
                            <i 
                              className="fas fa-certificate"
                              style={{ color: primaryColor }}
                            ></i>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{cert.name}</div>
                            <div className="text-sm text-gray-500">{cert.org}</div>
                            <div className="text-sm text-gray-400">{cert.year}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'bundles' && (
              <TrainerBundles trainerId={id} />
            )}

            {activeSection === 'reviews' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Client Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-yellow-400 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-medium">{trainer.rating || '4.9'}</span>
                    <span className="text-gray-500">({trainer.reviewCount || '150'} reviews)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      date: "2 weeks ago",
                      rating: 5,
                      comment: "Amazing trainer! Really helped me achieve my fitness goals with personalized workouts and great motivation."
                    },
                    {
                      name: "Mike Thompson",
                      date: "1 month ago",
                      rating: 5,
                      comment: "Very knowledgeable and professional. The sessions are challenging but fun, and I've seen great results."
                    }
                  ].map((review, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-xl"
                      style={{ backgroundColor: `${primaryColor}08` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{review.name}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Availability Calendar */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Availability</h2>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: `${primaryColor}08` }}
                >
                  <span className="font-medium">Monday - Thursday, Saturday - Sunday</span>
                  <span className="text-gray-600">24 Hours</span>
                </div>
                <div 
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-100"
                >
                  <span className="font-medium text-gray-500">Friday</span>
                  <span className="text-gray-400">Off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <Chat
          trainerId={id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
   </div>
 
  );
};

export default TrainerDetails; 