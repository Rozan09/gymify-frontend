import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Loader from '../Loader/Loader';

const Transformation = () => {
  const { id: trainerId } = useParams();
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please login to view transformations');
          setLoading(false);
          return;
        }

        // Set up axios config with authorization header
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Make API call to get trainer's transformations
        console.log('Fetching transformations for trainer ID:', trainerId);
        const response = await axios.get(
          `http://localhost:3000/api/v1/transformations/trainer/${trainerId}`,
          config
        );

        console.log('API Response:', response.data);

        if (!response.data) {
          setError('No transformations found');
          setLoading(false);
          return;
        }

        setTransformations(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transformations:', err);
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
          config: err.config
        });

        let errorMessage = 'Failed to fetch transformations. Please try again later.';

        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = 'Please login to view transformations';
              break;
            case 403:
              errorMessage = 'You do not have permission to view these transformations';
              break;
            case 404:
              errorMessage = 'No transformations found for this trainer';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = err.response.data?.message || errorMessage;
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    if (trainerId) {
      fetchTransformations();
    } else {
      setError('Trainer ID is required');
      setLoading(false);
    }
  }, [trainerId]);

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4857] to-[#ffb404] rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-red-50 rounded-full p-3">
                  <svg className="h-8 w-8 text-[#ff4857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Error Loading Transformations</h3>
                  <p className="mt-1 text-gray-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-30 bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="bg-gradient-to-r text-4xl font-bold pb-5 from-[#ff4857] to-[#ffb404] bg-clip-text text-transparent">Transformation Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real results from dedicated training and commitment. Be inspired by these amazing transformations.
          </p>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((transformation) => (
            <div
              key={transformation.id}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={transformation.photo}
                  alt={transformation.caption}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Date Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                  {format(new Date(transformation.createdAt), 'MMM d, yyyy')}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {transformation.caption}
                </h3>

                {/* Stats/Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-[#ff4857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {format(new Date(transformation.createdAt), 'MMM yyyy')}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-[#ff4857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Client #{transformation.trainerId}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {transformations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transformations Yet</h3>
            <p className="text-gray-600">Check back soon for amazing transformation stories!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transformation; 