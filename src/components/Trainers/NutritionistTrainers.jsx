import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

const NutritionistTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/trainers');
        // Filter only nutritionist trainers
        const nutritionists = res.data.data.filter(trainer => 
          trainer.specialization.toLowerCase().includes('nutrition')
        );
        setTrainers(nutritionists);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch nutritionists');
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) return (
    <Loader/>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ffb404] to-[#ff4857] rounded-2xl blur opacity-25"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-yellow-50 rounded-full p-3">
              <svg className="h-8 w-8 text-[#ffb404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Error Loading Nutritionists</h3>
              <p className="mt-1 text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative text-center mb-16">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[1000px] h-[250px] bg-gradient-to-r from-[#ffb404]/10 via-[#ff4857]/10 to-[#ffb404]/10 blur-3xl rounded-full transform -rotate-3"></div>
          </div>
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#ffb404] to-[#ff4857] bg-clip-text text-transparent">
              Expert Nutritionists
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Transform your health with personalized nutrition guidance from our certified experts
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10"></div>
                <img
                  src={`${trainer.profilePhoto}`}
                  alt={`${trainer.name}'s profile`}
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Stats Section */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{trainer.User?.name || trainer.name || 'Trainer'}</h3>
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium"
                    style={{ backgroundColor: '#ffb40420', color: '#ffb404' }}
                  >
                    {trainer.specialization}
                  </span>
                </div>
              </div>

              {/* Action Section */}
              <div className="p-6">
                <Link 
                  to={`/trainers/${trainer.id}`}
                  className="group/button block w-full"
                >
                  <div 
                    className="relative overflow-hidden rounded-xl transition-all duration-300"
                    style={{ backgroundColor: '#ffb40408' }}
                  >
                    {/* Hover Effect Background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: '#ffb404' }}
                    />

                    {/* Button Content */}
                    <div className="relative px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300"
                          style={{ backgroundColor: '#ffb40415', color: '#ffb404' }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium transition-colors duration-300 group-hover/button:text-white"
                                style={{ color: '#ffb404' }}>
                            View Details
                          </span>
                          <span className="text-xs text-gray-500 group-hover/button:text-white/80 transition-colors duration-300">
                            See full profile & programs
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow Animation */}
                      <div className="flex items-center">
                        <div className="relative w-16 h-5 overflow-hidden">
                          <div className="transform transition-transform duration-300 group-hover/button:translate-x-16">
                            <svg 
                              className="w-5 h-5 absolute left-0"
                              style={{ color: '#ffb404' }}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                          </div>
                          <div className="transform -translate-x-16 transition-transform duration-300 group-hover/button:translate-x-0">
                            <svg 
                              className="w-5 h-5 absolute left-0 text-white"
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionistTrainers; 