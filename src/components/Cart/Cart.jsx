import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../Context/CartContextProvider';
import { AuthContext } from '../Context/AuthContextProvider';
import { FaShoppingBag, FaTrash, FaArrowLeft } from 'react-icons/fa';

// Default placeholder image URL
const DEFAULT_PLACEHOLDER = '/placeholder.png';

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { 
    cartItems, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartCount,
    checkout 
  } = useContext(CartContext);

  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const [removingItem, setRemovingItem] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const calculateTotal = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      if (!item) return total;
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);
      return total + (price * quantity);
    }, 0);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setUpdatingQuantity(prev => ({ ...prev, [itemId]: true }));
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingQuantity(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setRemovingItem(prev => ({ ...prev, [itemId]: true }));
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    } finally {
      setRemovingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessingCheckout(true);
      setCheckoutError(null);
      const success = await checkout();
      if (success) {
        setNotification({
          show: true,
          message: 'Order placed successfully! Redirecting to orders page...',
          type: 'success'
        });
        // Auto hide after 3 seconds and redirect
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
          navigate('/orders');
        }, 3000);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Failed to place order. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleContinueShopping} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaArrowLeft />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <FaShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart and they will appear here.</p>
          <button 
            onClick={handleContinueShopping}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl pt-30 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {notification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-slide-up">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 26l8 8L38 14"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been successfully placed. You will be redirected to your orders page shortly.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#ff4857] hover:bg-[#e63e4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4857] transition-colors duration-200"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4857] transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <div className="relative flex justify-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-green-500 h-2 rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Redirecting in 3 seconds...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        <div className="flex gap-4">
          <button 
            onClick={clearCart}
            disabled={processingCheckout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaTrash />
            Clear Cart
          </button>
          <button 
            onClick={handleViewOrders}
            disabled={processingCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Orders
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => {
              if (!item) return null;

              const itemId = item?.id || 0;
              const quantity = Number(item?.quantity || 1);
              const price = Number(item?.price || 0);
              const name = item?.name || 'Product Not Found';
              const photo = item?.photo || DEFAULT_PLACEHOLDER;
              const total = price * quantity;
              const isUpdating = updatingQuantity[itemId];
              const isRemoving = removingItem[itemId];

              return (
                <div key={itemId} className="p-6 flex items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={photo}
                      alt={name}
                      className="h-full w-full object-contain object-center p-2"
                      onError={(e) => {
                        e.target.src = DEFAULT_PLACEHOLDER;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                    <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(itemId, quantity - 1)}
                        disabled={quantity <= 1 || isUpdating || processingCheckout}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-gray-900">
                        {isUpdating ? '...' : quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(itemId, quantity + 1)}
                        disabled={isUpdating || processingCheckout}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-medium text-gray-900 w-24 text-right">
                      ${total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(itemId)}
                      disabled={isRemoving || processingCheckout}
                      className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRemoving ? 'animate-pulse' : ''
                      }`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-medium text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
          </div>
          {checkoutError && (
            <p className="text-red-600 mb-4 text-center">{checkoutError}</p>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleContinueShopping}
              disabled={processingCheckout}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={processingCheckout}
              className={`flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                processingCheckout ? 'animate-pulse' : ''
              }`}
            >
              {processingCheckout ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Checkout ({cartCount} items)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
