import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const GetTIB = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { token, user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editingBundle, setEditingBundle] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching user data:', err.response?.data || err.message);
      return null;
    }
  };

  const fetchBundles = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      if (!token) {
        setError('Please log in to view your bundles');
        setLoading(false);
        return;
      }

      let currentUser = user;
      if (!currentUser) {
        currentUser = await fetchUserData();
      }

      if (!currentUser) {
        setError('Unable to fetch user data. Please try logging in again.');
        setLoading(false);
        return;
      }

      const trainerId = currentUser.Trainer?.id;
      if (!trainerId) {
        setError('Trainer profile not found. Please complete your trainer profile.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/v1/trainers/${trainerId}/bundles`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setBundles(response.data.data.bundles);
      } else {
        setError('Failed to load bundles');
      }
    } catch (err) {
      console.error('Error in fetchBundles:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load bundles');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, [token, user, isAuthenticated]);

  const handleEdit = (bundle) => {
    setEditingBundle(bundle);
    setEditForm({
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      duration: bundle.duration
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/api/v1/bundles/${editingBundle.id}`,
        {
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          duration: parseInt(editForm.duration)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating bundle:', err);
      setError(err.response?.data?.message || 'Failed to update bundle');
    } finally {
      setLoading(false);
      setEditingBundle(null);
    }
  };

  const handleDelete = async (bundleId) => {
    if (!window.confirm('Are you sure you want to delete this bundle?')) return;

    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3000/api/v1/bundles/${bundleId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error deleting bundle:', err);
      setError(err.response?.data?.message || 'Failed to delete bundle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10172A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Training Bundles</h1>
          <p className="mt-2 text-gray-300">View and manage your training programs</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 rounded-lg bg-green-50 p-4">
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
          <div className="mb-8 rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                {error.includes('Please log in') && (
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Go to Login
                  </button>
                )}
                {error.includes('Trainer profile not found') && (
                  <button
                    onClick={() => navigate('/trainer/profile')}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Complete your trainer profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.length > 0 ? (
            bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {bundle.name}
                    </h3>
                    <span className="px-3 py-1 text-sm font-medium text-[#1D2540] bg-[#1D2540]/10 rounded-full">
                      {bundle.duration} weeks
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {bundle.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-[#1D2540]">
                      ${parseFloat(bundle.price).toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(bundle)}
                        className="px-4 py-2 text-[#1D2540] hover:bg-[#1D2540] hover:text-white rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bundle.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                No training bundles available
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingBundle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Bundle</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Bundle Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    required
                    rows="4"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      id="edit-duration"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditChange}
                      required
                      min="1"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1D2540] focus:border-[#1D2540]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingBundle(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#1D2540] text-white rounded-lg hover:bg-[#22305A] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetTIB;
