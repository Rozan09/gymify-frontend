import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContextProvider';
import { CartContext } from '../Context/CartContextProvider';
import Loader from '../Loader/Loader';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000
});

const DEFAULT_PLACEHOLDER = '/placeholder.png';

api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || 30;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return api.request(error.config);
  }
  return Promise.reject(error);
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterInStock, setFilterInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const { addToCart, cartCount } = useContext(CartContext);
  const [notification, setNotification] = useState({ show: false, productName: '' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchInitialData();
  }, [token, navigate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsResponse, ordersResponse] = await Promise.all([
        api.get('/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        api.get('/orders/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let productsData = [];
      if (productsResponse.data) {
        if (Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        } else if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
          productsData = productsResponse.data.data;
        }
      }

      let ordersData = [];
      if (ordersResponse.data) {
        if (Array.isArray(ordersResponse.data)) {
          ordersData = ordersResponse.data;
        } else if (ordersResponse.data.orders && Array.isArray(ordersResponse.data.orders)) {
          ordersData = ordersResponse.data.orders;
        } else if (ordersResponse.data.data && Array.isArray(ordersResponse.data.data)) {
          ordersData = ordersResponse.data.data;
        }
      }

      const recentOrders = ordersData.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
        return hoursDiff <= 24;
      });

      setProducts(productsData);
      setRecentOrders(recentOrders);
      setRetryCount(0);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers['retry-after'] || '30', 10);
        setError(`Too many requests. Please try again in ${retryAfter} seconds.`);
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchInitialData();
          }, retryAfter * 1000);
        }
      } else {
        setError('Failed to fetch data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    let productId;
    try {
      productId = product.id || product._id;
      if (!productId) {
        throw new Error('Invalid product ID');
      }

      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      const success = await addToCart(productId, 1);

      if (success) {
        setNotification({ show: true, productName: product.name });
        setTimeout(() => {
          setNotification({ show: false, productName: '' });
        }, 5000);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.message || 'Failed to add product to cart. Please try again.');
    } finally {
      if (productId) {
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
      }
    }
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const filteredAndSortedProducts = () => {
    return products
      .filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = !filterInStock || product.stock > 0;
        return matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name-desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'price-low':
            return (Number(a.price) || 0) - (Number(b.price) || 0);
          case 'price-high':
            return (Number(b.price) || 0) - (Number(a.price) || 0);
          case 'stock':
            return (Number(b.stock) || 0) - (Number(a.stock) || 0);
          default:
            return (a.name || '').localeCompare(b.name || '');
        }
      });
  };

  const paginatedProducts = () => {
    const filtered = filteredAndSortedProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredAndSortedProducts().length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!token) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchInitialData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl pt-40 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 border border-gray-100">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Added to Cart!</p>
              <p className="text-gray-600 text-sm">{notification.productName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/cart')}
                className="px-3 py-1 bg-[#ff4857] text-white text-sm rounded-lg hover:bg-[#e63e4c] transition-colors"
              >
                View Cart
              </button>
              <button
                onClick={() => setNotification({ show: false, productName: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="bg-gradient-to-r text-5xl font-bold pb-5 from-[#ff4857] to-[#ffb404] bg-clip-text text-transparent">
          Fitness Products
        </h1>
        <p className="text-lg text-gray-600">
          High-quality equipment and supplements for your fitness journey
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button 
            onClick={handleViewOrders} 
            className="bg-[#ff4857] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium group"
          >
            <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            View My Orders
          </button>
          <button 
            onClick={() => navigate('/cart')} 
            className="bg-[#ffb404] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium group"
          >
            <FaShoppingCart className="text-xl transform transition-transform duration-300 group-hover:rotate-12" />
            Cart ({cartCount})
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <optgroup label="Sort by Name">
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </optgroup>
              <optgroup label="Sort by Price">
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </optgroup>
              <optgroup label="Sort by Stock">
                <option value="stock">Stock Level</option>
              </optgroup>
            </select>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={filterInStock}
                onChange={(e) => setFilterInStock(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2">In Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts().map((product) => {
          const productId = product.id || product._id;
          const isAddingToCart = addingToCart[productId] || false;
          const isOutOfStock = product.stock <= 0;
          const hasRecentOrder = recentOrders.some(order => 
            order.items?.some(item => item.productId === productId)
          );

          return (
            <div
              key={productId}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Product Image Container */}
              <div className="relative w-full h-64 bg-white">
                <img
                  src={product.photo || DEFAULT_PLACEHOLDER}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = DEFAULT_PLACEHOLDER;
                  }}
                />
                {hasRecentOrder && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm">
                    Recently Ordered
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 h-10">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-full text-sm ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 10 
                        ? 'In Stock' 
                        : product.stock > 0 
                          ? `Only ${product.stock} left`
                          : 'Out of Stock'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock || isAddingToCart}
                  className={`group w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#ff4857] text-white hover:bg-[#e63e4c] hover:shadow-lg active:shadow-md relative overflow-hidden'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="h-5 w-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-white/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-[#ff4857] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 