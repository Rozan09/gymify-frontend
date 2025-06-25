import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContextProvider';

const BundleManagement = () => {
  const { token } = useContext(AuthContext);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: ''
  });

  // Fetch trainer's bundles
  const fetchBundles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/bundles/trainer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBundles(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bundles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      price: '',
      description: ''
    });
    setEditingBundle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingBundle) {
        // Update existing bundle
        await axios.put(
          `http://localhost:3000/api/v1/bundles/${editingBundle.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new bundle
        await axios.post(
          'http://localhost:3000/api/v1/bundles',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      await fetchBundles();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bundle');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bundle) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      duration: bundle.duration,
      price: bundle.price,
      description: bundle.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bundleId) => {
    if (!window.confirm('Are you sure you want to delete this bundle?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/bundles/${bundleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchBundles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete bundle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Training Bundles</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Create New Bundle
          </button>
        </div>

        {/* Error Message */}
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

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{bundle.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{bundle.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#ff4857]">${bundle.price}</span>
                    <span className="text-sm text-gray-500">for {bundle.duration}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(bundle)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bundle Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                    placeholder="e.g., Weight Loss Program"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                    placeholder="e.g., 99.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                    placeholder="Describe what's included in this bundle..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-2 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Saving...' : editingBundle ? 'Update Bundle' : 'Create Bundle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
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

export default BundleManagement; 