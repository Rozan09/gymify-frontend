import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextProvider';

export const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  loading: false,
  error: null,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  checkout: () => {},
  fetchCartItems: () => {}
});

const API_BASE_URL = 'http://localhost:3000/api/v1/cart';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { token, logout } = useContext(AuthContext);

  // Add request interceptor to add token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle common errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else if (error.response?.status === 401) {
        logout();
        setError('Session expired. Please login again.');
      } else {
        setError(error.response?.data?.message || error.message || 'An error occurred');
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
      setLoading(false);
    }
  }, [token]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching cart items with token:', token ? 'Present' : 'Missing');
      
      const response = await api.get('/');
      console.log('Cart API Response:', response.data);

      // Ensure we have a valid response
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      // Get the items array from the response
      let items = [];
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      }

      console.log('Extracted items:', items);

      // Process each item into a flat structure
      const processedItems = items
        .filter(item => {
          if (!item) {
            console.log('Filtering out null item');
            return false;
          }
          console.log('Processing item:', item);
          return true;
        })
        .map(item => {
          try {
            // Create a safe item with defaults
            const safeItem = {
              id: 0,
              quantity: 1,
              price: 0,
              name: 'Product Not Found',
              photo: '/placeholder.png',
              description: ''
            };

            // Update with actual values if they exist
            if (item) {
              safeItem.id = item.id || safeItem.id;
              safeItem.quantity = Number(item.quantity) || safeItem.quantity;
              
              // Handle both possible product structures
              const productData = item.Product || item.product;
              if (productData) {
                safeItem.price = Number(productData.price) || safeItem.price;
                safeItem.name = productData.name || safeItem.name;
                safeItem.photo = productData.photo || safeItem.photo;
                safeItem.description = productData.description || safeItem.description;
              } else {
                // If no product data, try to get values from the item itself
                safeItem.price = Number(item.price) || safeItem.price;
                safeItem.name = item.name || safeItem.name;
                safeItem.photo = item.photo || safeItem.photo;
                safeItem.description = item.description || safeItem.description;
              }
            }

            console.log('Processed item:', safeItem);
            return safeItem;
          } catch (err) {
            console.error('Error processing item:', err);
            return null;
          }
        })
        .filter(Boolean); // Remove any null items

      console.log('Final processed items:', processedItems);

      setCartItems(processedItems);
      setCartCount(processedItems.reduce((total, item) => total + item.quantity, 0));
      setError(null);
    } catch (err) {
      console.error('Cart fetch error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      setLoading(true);

      const cartData = {
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      };

      console.log('Adding to cart:', cartData);

      const response = await api.post('/add', cartData);
      console.log('Add to cart response:', response.data);
      
      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Add to cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return false;
    try {
      setError(null);
      setLoading(true);

      console.log('Updating quantity:', { cartItemId, newQuantity });

      await api.put(`/item/${cartItemId}`, {
        quantity: parseInt(newQuantity)
      });

      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Update quantity error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Removing from cart:', cartItemId);

      await api.delete(`/item/${cartItemId}`);
      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Remove from cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('Clearing cart');

      await api.delete('/clear');
      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (err) {
      console.error('Clear cart error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('Starting checkout');

      await api.post('/checkout');
      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (err) {
      console.error('Checkout error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    cartItems,
    cartCount,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
} 