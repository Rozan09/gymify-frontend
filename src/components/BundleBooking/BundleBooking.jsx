import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BundleBooking = () => {
  const { bundleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bundle = location.state?.bundle;

  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Calculate end date based on duration (assuming duration is in weeks)
      const durationInWeeks = parseInt(bundle?.duration) || 8;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (durationInWeeks * 7));

      const response = await axios.post(
        'http://localhost:3000/api/v1/bookings',
        {
          bundleId: parseInt(bundleId),
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile'); // Navigate to profile page after booking
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-30 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Bundle Summary */}
          <div
            className="px-6 py-8 text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(0, 31, 63), rgb(0, 8, 20))',
              boxShadow: 'rgba(0, 31, 63, 0.25) 0px 4px 15px'
            }}
          >
            <h1 className="text-3xl font-bold">{bundle?.name || 'Bundle Booking'}</h1>
            <p className="mt-2 text-white/80">{bundle?.description || 'Book your training session'}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <span>{bundle?.duration || 'Duration not specified'}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-dollar-sign mr-2"></i>
                <span>${bundle?.price || '0'}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Booking created successfully! Redirecting to your profile...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 focus:ring-[#ff4857] focus:border-[#ff4857]"
                    placeholderText="Select start date"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgb(0, 31, 63), rgb(0, 8, 20))',
                    boxShadow: 'rgba(0, 31, 63, 0.25) 0px 4px 15px'
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4857]"
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleBooking; 