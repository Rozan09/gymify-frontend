import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import GetTIB from './GetTIB';

const CreateBundle = () => {
  const [bundle, setBundle] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBundle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/bundles',
        {
          ...bundle,
          price: parseFloat(bundle.price),
          duration: parseInt(bundle.duration)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Reset form
        setBundle({
          name: '',
          description: '',
          price: '',
          duration: ''
        });
        // Show success message
        setSuccessMessage('Bundle created successfully!');
        // Clear success message after 3 seconds and refresh the page
        setTimeout(() => {
          setSuccessMessage(null);
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.error('Bundle creation error:', err);
      setError(err.response?.data?.message || 'Failed to create bundle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-30 bg-[#10172A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-[#1D2540] to-[#22305A]">
            <h2 className="text-3xl font-bold text-white text-center">
              Create New Training Bundle
            </h2>
            <p className="mt-2 text-center text-gray-300">
              Fill in the details below to create a new training program
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bundle Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Bundle Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bundle.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                  placeholder="e.g., Premium Fitness Package"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={bundle.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                  placeholder="Describe what's included in this training bundle..."
                />
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={bundle.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={bundle.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                    placeholder="e.g., 12"
                  />
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
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

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/trainer/bundles')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#1D2540] to-[#22305A] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Create Bundle
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div><GetTIB/>
    </div>
  );
};

export default CreateBundle; 