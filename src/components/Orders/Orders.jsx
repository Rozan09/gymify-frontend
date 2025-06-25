// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../Context/AuthContextProvider';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
//   timeout: 10000
// });

// // Add retry logic for rate limiting
// api.interceptors.response.use(null, async (error) => {
//   if (error.response?.status === 429) {
//     const retryAfter = error.response.headers['retry-after'] || 30;
//     await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//     return api.request(error.config);
//   }
//   return Promise.reject(error);
// });

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const navigate = useNavigate();
//   const { token, logout } = useContext(AuthContext);

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     fetchOrders();
//   }, [token, navigate]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await api.get('/orders/user', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       // Normalize the response data
//       let ordersData = [];
//       if (response.data) {
//         if (Array.isArray(response.data)) {
//           ordersData = response.data;
//         } else if (response.data.orders && Array.isArray(response.data.orders)) {
//           ordersData = response.data.orders;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           ordersData = response.data.data;
//         } else {
//           console.log('Unexpected response format:', response.data);
//           throw new Error('Invalid response format');
//         }
//       }

//       // Get unique product IDs
//       const productIds = [...new Set(ordersData.map(order => order.productId))];

//       // Fetch all products in a single request
//       let productsMap = {};
//       if (productIds.length > 0) {
//         try {
//           const productsResponse = await api.get('/products', {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           const products = Array.isArray(productsResponse.data) 
//             ? productsResponse.data 
//             : productsResponse.data.data || [];

//           productsMap = products.reduce((acc, product) => {
//             acc[product.id] = product;
//             return acc;
//           }, {});
//         } catch (err) {
//           console.error('Error fetching products:', err);
//         }
//       }

//       // Group orders by createdAt timestamp (rounded to the nearest minute)
//       const groupedOrders = ordersData.reduce((acc, order) => {
//         const orderDate = new Date(order.createdAt);
//         // Round to nearest minute to group orders placed together
//         const groupKey = new Date(
//           orderDate.getFullYear(),
//           orderDate.getMonth(),
//           orderDate.getDate(),
//           orderDate.getHours(),
//           orderDate.getMinutes()
//         ).toISOString();

//         if (!acc[groupKey]) {
//           acc[groupKey] = {
//             id: groupKey,
//             createdAt: order.createdAt,
//             status: order.status,
//             items: []
//           };
//         }

//         const productData = productsMap[order.productId] || order.product || {
//           id: order.productId,
//           name: 'Product Not Found',
//           price: 0,
//           photo: 'https://via.placeholder.com/100x100?text=Product+Not+Found'
//         };

//         acc[groupKey].items.push({
//           id: order.id,
//           quantity: parseInt(order.quantity || 1, 10),
//           totalPrice: parseFloat(order.totalPrice || 0),
//           product: {
//             id: productData.id,
//             name: productData.name,
//             price: parseFloat(productData.price || 0),
//             photo: productData.photo || productData.image || 'https://via.placeholder.com/100x100?text=Product+Image',
//             description: productData.description || ''
//           }
//         });

//         return acc;
//       }, {});

//       // Convert to array and sort by date
//       const processedOrders = Object.values(groupedOrders).sort((a, b) => 
//         new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setOrders(processedOrders);
//       setRetryCount(0);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       if (err.response?.status === 401) {
//         logout();
//         navigate('/login');
//       } else if (err.response?.status === 429) {
//         const retryAfter = parseInt(err.response.headers['retry-after'] || '30', 10);
//         setError(`Too many requests. Please try again in ${retryAfter} seconds.`);
//         if (retryCount < 3) {
//           setTimeout(() => {
//             setRetryCount(prev => prev + 1);
//             fetchOrders();
//           }, retryAfter * 1000);
//         }
//       } else {
//         setError('Failed to fetch orders. Please try again later.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelOrder = async (orderId) => {
//     try {
//       await api.put(`/orders/${orderId}/cancel`, {}, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       fetchOrders();
//       alert('Order cancelled successfully');
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       if (err.response?.status === 401) {
//         logout();
//         navigate('/login');
//       } else {
//         alert('Failed to cancel order. Please try again.');
//       }
//     }
//   };

//   const calculateOrderTotal = (items) => {
//     return items.reduce((total, item) => total + item.totalPrice, 0);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'status-completed';
//       case 'cancelled':
//         return 'status-cancelled';
//       default:
//         return 'status-pending';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (!token) {
//     navigate('/login');
//     return null;
//   }

//   if (loading) {
//     return <div className="orders-loading">Loading your orders...</div>;
//   }

//   if (error) {
//     return (
//       <div className="orders-error">
//         <p>{error}</p>
//         <button onClick={fetchOrders} className="retry-button">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <h1>My Orders</h1>
//         <p className="orders-subtitle">
//           View and manage your order history
//         </p>
//       </div>

//       {orders.length === 0 ? (
//         <div className="no-orders">
//           <p>You haven't placed any orders yet.</p>
//           <button 
//             onClick={() => navigate('/products')} 
//             className="shop-now-btn"
//           >
//             Shop Now
//           </button>
//         </div>
//       ) : (
//         <div className="orders-list">
//           {orders.map((order) => (
//             <div key={order.id} className="order-card">
//               <div className="order-header">
//                 <div className="order-info">
//                   <span className="order-date">{formatDate(order.createdAt)}</span>
//                   <span className={`order-status ${getStatusColor(order.status)}`}>
//                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                   </span>
//                 </div>
//                 <span className="order-total">
//                   Total: ${calculateOrderTotal(order.items).toFixed(2)}
//                 </span>
//               </div>
              
//               <div className="order-items">
//                 {order.items.map((item) => (
//                   <div key={item.id} className="order-item">
//                     <div className="product-info">
//                       <img 
//                         src={item.product.photo}
//                         alt={item.product.name}
//                         className="product-image"
//                         onError={(e) => {
//                           e.target.src = 'https://via.placeholder.com/100x100?text=Product+Image';
//                         }}
//                       />
//                       <div className="product-details">
//                         <h3>{item.product.name}</h3>
//                         <p className="product-description">{item.product.description}</p>
//                         <p className="quantity">Quantity: {item.quantity}</p>
//                         <p className="unit-price">Unit Price: ${item.product.price.toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="item-total">
//                       ${item.totalPrice.toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {order.status === 'pending' && (
//                 <div className="order-actions">
//                   <button
//                     onClick={() => handleCancelOrder(order.id)}
//                     className="cancel-order-btn"
//                   >
//                     Cancel Order
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContextProvider';
import Loader from '../Loader/Loader';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000
});

// Add retry logic for rate limiting
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || 30;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return api.request(error.config);
  }
  return Promise.reject(error);
});


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Normalize the response data
      let ordersData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else {
          console.log('Unexpected response format:', response.data);
          throw new Error('Invalid response format');
        }
      }

      // Get unique product IDs
      const productIds = [...new Set(ordersData.map(order => order.productId))];

      // Fetch all products in a single request
      let productsMap = {};
      if (productIds.length > 0) {
        try {
          const productsResponse = await api.get('/products', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const products = Array.isArray(productsResponse.data) 
            ? productsResponse.data 
            : productsResponse.data.data || [];

          productsMap = products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {});
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      }

      // Group orders by createdAt timestamp (rounded to the nearest minute)
      const groupedOrders = ordersData.reduce((acc, order) => {
        const orderDate = new Date(order.createdAt);
        // Round to nearest minute to group orders placed together
        const groupKey = new Date(
          orderDate.getFullYear(),
          orderDate.getMonth(),
          orderDate.getDate(),
          orderDate.getHours(),
          orderDate.getMinutes()
        ).toISOString();

        if (!acc[groupKey]) {
          acc[groupKey] = {
            id: groupKey,
            createdAt: order.createdAt,
            status: order.status,
            items: []
          };
        }

        const productData = productsMap[order.productId] || order.product || {
          id: order.productId,
          name: 'Product Not Found',
          price: 0,
          photo: 'https://via.placeholder.com/100x100?text=Product+Not+Found'
        };

        acc[groupKey].items.push({
          id: order.id,
          quantity: parseInt(order.quantity || 1, 10),
          totalPrice: parseFloat(order.totalPrice || 0),
          product: {
            id: productData.id,
            name: productData.name,
            price: parseFloat(productData.price || 0),
            photo: productData.photo || productData.image || 'https://via.placeholder.com/100x100?text=Product+Image',
            description: productData.description || ''
          }
        });

        return acc;
      }, {});

      // Convert to array and sort by date
      const processedOrders = Object.values(groupedOrders).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(processedOrders);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers['retry-after'] || '30', 10);
        setError(`Too many requests. Please try again in ${retryAfter} seconds.`);
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchOrders();
          }, retryAfter * 1000);
        }
      } else {
        setError('Failed to fetch orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchOrders} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = (order) => {
  navigate('/payment', {
    state: {
      orderData: {
        id: order.id,
        total: calculateOrderTotal(order.items),
        items: order.items
      }
    }
  });
};

  return (
    <div className="container pt-30 mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r text-5xl font-bold pb-5 from-[#ff4857] to-[#ffb404] bg-clip-text text-transparent">My Orders</h1>
        <p className="text-gray-600">
          View and manage your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center">
                      <img 
                        src={item.product.photo} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">
                      ${calculateOrderTotal(order.items).toFixed(2)}
                    </span>
                  </div>
                 
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
  <div className="flex flex-col gap-2 mt-4">
    <button
      onClick={() => handleCancelOrder(order.items[0].id)}
      className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Cancel Order
    </button>
    <button
      onClick={() => handlePayment(order)}
      className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Pay Now
    </button>
  </div>
)}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const handlePayment = (order) => {
  navigate('/payment', {
    state: {
      orderData: {
        id: order.id,
        total: calculateOrderTotal(order.items),
        items: order.items
      }
    }
  });
};
