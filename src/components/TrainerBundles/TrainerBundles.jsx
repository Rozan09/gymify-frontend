// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../Context/AuthContextProvider';
// import { useParams, useNavigate } from 'react-router-dom';

// const TrainerBundles = ({ trainerId: propTrainerId, trainerName, onClose }) => {
//   const [bundles, setBundles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [trainerInfo, setTrainerInfo] = useState(null);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newBundle, setNewBundle] = useState({
//     name: '',
//     duration: '',
//     price: '',
//     description: ''
//   });
//   const [createError, setCreateError] = useState(null);
//   const { token } = useContext(AuthContext);
//   const { trainerId: urlTrainerId } = useParams();
//   const navigate = useNavigate();
  
//   // Use trainerId from props if provided (modal view), otherwise use from URL
//   const trainerId = propTrainerId || urlTrainerId;

//   useEffect(() => {
//     const fetchBundles = async () => {
//       try {
//         setError(null);
//         console.log('Fetching bundles for trainer:', trainerId);
        
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/trainers/${trainerId}/bundles`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         console.log('API Response:', {
//           status: response.status,
//           statusText: response.statusText,
//           data: response.data,
//           headers: response.headers
//         });
        
//         let bundlesData = [];
//         let trainerData = null;

//         // Handle the response data structure
//         if (response.data?.success) {
//           if (response.data.data?.bundles) {
//             bundlesData = response.data.data.bundles;
//           } else if (response.data.data) {
//             bundlesData = response.data.data;
//           }
//           if (response.data.data?.trainer) {
//             trainerData = response.data.data.trainer;
//           }
//         } else if (Array.isArray(response.data)) {
//           bundlesData = response.data;
//         } else if (response.data && typeof response.data === 'object') {
//           if (response.data.bundles) {
//             bundlesData = response.data.bundles;
//           } else {
//             bundlesData = [response.data];
//           }
//           if (response.data.trainer) {
//             trainerData = response.data.trainer;
//           }
//         }

//         console.log('Processed data:', {
//           bundles: bundlesData,
//           trainer: trainerData,
//           bundlesLength: bundlesData.length
//         });
        
//         setBundles(bundlesData || []);
//         if (trainerData) {
//           setTrainerInfo(trainerData);
//         }
//       } catch (err) {
//         console.error('Bundle fetch error:', {
//           message: err.message,
//           status: err.response?.status,
//           statusText: err.response?.statusText,
//           data: err.response?.data,
//           stack: err.stack,
//           url: err.config?.url
//         });

//         let errorMessage = 'Failed to load bundles';
        
//         if (err.response?.status === 401) {
//           errorMessage = 'Your session has expired. Please log in again.';
//         } else if (err.response?.status === 403) {
//           errorMessage = 'You do not have permission to view these bundles.';
//         } else if (err.response?.status === 404) {
//           errorMessage = 'No bundles found for this trainer.';
//           setBundles([]);
//         } else if (err.response?.data?.message) {
//           errorMessage = err.response.data.message;
//         }

//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (trainerId) {
//       fetchBundles();
//     } else {
//       console.warn('No trainerId provided');
//       setLoading(false);
//     }
//   }, [trainerId, token]);

//   const handleCreateBundle = async (e) => {
//     e.preventDefault();
//     setCreateError(null);
    
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/v1/bundles',
//         {
//           ...newBundle,
//           trainerId: trainerId,
//           price: parseFloat(newBundle.price)
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data?.success) {
//         // Add the new bundle to the list
//         setBundles(prevBundles => [...prevBundles, response.data.data]);
//         // Reset form
//         setNewBundle({
//           name: '',
//           duration: '',
//           price: '',
//           description: ''
//         });
//         setShowCreateForm(false);
//       }
//     } catch (err) {
//       console.error('Bundle creation error:', err);
//       setCreateError(err.response?.data?.message || 'Failed to create bundle');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewBundle(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           <div className="p-6 flex justify-center items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4857]"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const content = (
//     <div>
//       <div className="mb-6">
//         <button
//           onClick={() => setShowCreateForm(true)}
//           className="px-6 py-3 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           Create New Training Bundle
//         </button>
//       </div>

//       {showCreateForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#ff4857] to-[#ffb404]">
//               <h3 className="text-2xl font-bold text-white">Create New Training Bundle</h3>
//               <button
//                 onClick={() => setShowCreateForm(false)}
//                 className="text-white hover:text-gray-200 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//               <form onSubmit={handleCreateBundle} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newBundle.name}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Premium Fitness Package"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={newBundle.duration}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 12"
//                     min="1"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                     <input
//                       type="number"
//                       name="price"
//                       value={newBundle.price}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     name="description"
//                     value={newBundle.description}
//                     onChange={handleInputChange}
//                     placeholder="Describe what's included in this training bundle..."
//                     rows="4"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {createError && (
//                   <div className="p-4 bg-red-50 rounded-lg">
//                     <div className="flex items-center text-red-500">
//                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {createError}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateForm(false)}
//                     className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
//                   >
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                     </svg>
//                     Create Bundle
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {bundles && bundles.length > 0 ? (
//           bundles.map((bundle) => (
//             <div 
//               key={bundle.id || Math.random()} 
//               className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
//             >
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                   {bundle.name || 'Unnamed Bundle'}
//                 </h3>
//                 <p className="text-gray-600 mb-4 line-clamp-2">
//                   {bundle.description || 'No description available'}
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <span className="text-2xl font-bold text-[#ff4857]">
//                       ${bundle.price || 0}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       for {bundle.duration || 0} weeks
//                     </span>
//                   </div>
//                   <button 
//                     className="px-4 py-2 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white rounded-lg hover:opacity-90 transition-opacity"
//                     onClick={() => {
//                       console.log('Bundle selected:', bundle);
//                       // If in modal, close it first
//                       if (onClose) {
//                         onClose();
//                       }
//                       // Navigate to booking page with bundle data
//                       navigate(`/bundle/${bundle.id}/book`, {
//                         state: { bundle }
//                       });
//                     }}
//                   >
//                     Select Plan
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-2 text-center py-8">
//             <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-500">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//               No training programs available
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // If being used as a modal
//   if (onClose) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           {/* Modal Header */}
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#ff4857] to-[#ffb404]">
//             <h2 className="text-2xl font-bold text-white">
//               {trainerName}'s Training Programs
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-gray-200 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             {error ? (
//               <div className="text-center py-4">
//                 <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-500">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   {error}
//                 </div>
//               </div>
//             ) : (
//               content
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Standalone view
//   return (
//     <div>
//       {trainerInfo && (
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {trainerInfo.name}'s Training Programs
//               </h1>
//               <p className="text-gray-600">
//                 {trainerInfo.specialization}
//               </p>
//             </div>
//             <button
//               onClick={() => navigate('/trainers')}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Trainers
//             </button>
//           </div>
//         </div>
//       )}
      
//       {error ? (
//         <div className="text-center py-4">
//           <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-500">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             {error}
//           </div>
//         </div>
//       ) : (
//         content
//       )}
//     </div>
//   );
// };

// export default TrainerBundles;
