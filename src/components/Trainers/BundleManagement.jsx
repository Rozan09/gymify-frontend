import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContextProvider';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

// Helper function to convert duration string to weeks
const convertDurationToWeeks = (duration) => {
  const [amount, unit] = duration.toLowerCase().trim().split(/\s+/);
  const numAmount = parseInt(amount, 10);
  
  switch(unit.replace(/s$/, '')) { // Remove trailing 's' if present
    case 'week':
      return numAmount;
    case 'day':
      return Math.ceil(numAmount / 7);
    case 'month':
      return numAmount * 4; // Approximate
    case 'year':
      return numAmount * 52; // Approximate
    default:
      return numAmount;
  }
};

// Helper function to convert weeks to human readable duration
const convertWeeksToDuration = (weeks) => {
  if (!weeks) return '';
  
  if (weeks >= 52 && weeks % 52 === 0) {
    const years = weeks / 52;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else if (weeks >= 4 && weeks % 4 === 0) {
    const months = weeks / 4;
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }
};

const bundleValidationSchema = Yup.object({
  name: Yup.string()
    .required('Bundle name is required')
    .min(3, 'Name must be at least 3 characters'),
  duration: Yup.string()
    .required('Duration is required')
    .matches(/^[0-9]+\s+(day|week|month|year)s?$/i, 'Duration must be in format: "X days/weeks/months/years" (e.g., "3 months", "2 weeks")'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be positive')
    .max(10000, 'Price cannot exceed 10000'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
});

const BundleManagement = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBundle, setCurrentBundle] = useState(null);
  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  const fetchBundles = async () => {
    if (!user?.id || !token) {
      setError('Please log in to manage bundles');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching bundles for trainer:', user.id);

      const response = await axios.get(
        `http://localhost:3000/api/v1/trainers/${user.id}/bundles`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      let bundlesData = [];
      if (response.data?.success) {
        if (response.data.data?.bundles) {
          bundlesData = response.data.data.bundles;
        } else if (response.data.data) {
          bundlesData = response.data.data;
        }
      } else if (Array.isArray(response.data)) {
        bundlesData = response.data;
      } else if (response.data?.bundles) {
        bundlesData = response.data.bundles;
      } else if (response.data) {
        bundlesData = [response.data];
      }

      console.log('Processed bundles:', bundlesData);
      setBundles(bundlesData || []);
    } catch (err) {
      console.error('Bundle fetch error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });

      let errorMessage = 'Failed to load bundles';
      if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to manage bundles.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && token) {
      fetchBundles();
    } else {
      setLoading(false);
      setError('Please log in to manage bundles');
    }
  }, [user?.id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id || !token) {
      setError('Please log in to manage bundles');
      return;
    }

    try {
      setError(null);
      const endpoint = currentBundle
        ? `http://localhost:3000/api/v1/trainers/${user.id}/bundles/${currentBundle.id}`
        : `http://localhost:3000/api/v1/trainers/${user.id}/bundles`;

      const method = currentBundle ? 'put' : 'post';
      
      console.log(`${method.toUpperCase()} request to:`, endpoint);
      console.log('Request data:', formData);

      const response = await axios({
        method,
        url: endpoint,
        data: {
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);
      
      await fetchBundles();
      setIsModalOpen(false);
      setCurrentBundle(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
      });
    } catch (err) {
      console.error('Bundle save error:', err);
      setError(err.response?.data?.message || 'Failed to save bundle');
    }
  };

  const handleEdit = (bundle) => {
    setCurrentBundle(bundle);
    setFormData({
      name: bundle.name || '',
      description: bundle.description || '',
      price: bundle.price?.toString() || '',
      duration: bundle.duration?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bundleId) => {
    if (!user?.id || !token) {
      setError('Please log in to manage bundles');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this bundle?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/trainers/${user.id}/bundles/${bundleId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchBundles();
    } catch (err) {
      console.error('Bundle delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete bundle');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4857]"></div>
      </div>
    );
  }

  if (!user?.id || !token) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-4">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Please log in to manage bundles
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Training Programs</h1>
        <button
          onClick={() => {
            setCurrentBundle(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              duration: '',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Create New Program
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-lg bg-red-50 text-red-500">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.length > 0 ? (
          bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {bundle.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {bundle.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#ff4857]">
                      ${bundle.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      for {bundle.duration} weeks
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(bundle)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(bundle.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              No training programs available
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#ff4857] to-[#ffb404]">
              <h2 className="text-2xl font-bold text-white">
                {currentBundle ? 'Edit Training Program' : 'Create New Program'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentBundle(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Program Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff4857] focus:ring-[#ff4857]"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff4857] focus:ring-[#ff4857]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff4857] focus:ring-[#ff4857]"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff4857] focus:ring-[#ff4857]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentBundle(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {currentBundle ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleManagement; 