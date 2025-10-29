// // components/DeliveryHistory.jsx
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getDeliveryHistoryThunk, getTodayDeliveriesThunk } from '../store/delivery/deliveryThunk';
// import { useNavigate } from 'react-router-dom';

// const DeliveryHistory = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector(state => state.auth);
//   const { 
//     deliveryHistory, 
//     historyLoading, 
//     historyError, 
//     historyPagination,
//     todayDeliveries 
//   } = useSelector(state => state.delivery);
  
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     dispatch(getDeliveryHistoryThunk({ page: currentPage, limit: 10 }));
//     dispatch(getTodayDeliveriesThunk());
//   }, [dispatch, currentPage]);

//   if (historyLoading && deliveryHistory.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg font-medium">Loading delivery history...</p>
//         </div>
//       </div>
//     );
//   }

//   if (historyError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading History</h3>
//           <p className="text-red-600 mb-4">{historyError}</p>
//           <button 
//             onClick={() => dispatch(getDeliveryHistoryThunk({ page: currentPage, limit: 10 }))}
//             className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Calculate total earnings
//   const totalEarnings = deliveryHistory.reduce((sum, order) => sum + order.amount, 0);
//   const todayEarnings = todayDeliveries?.totalEarnings || 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br mt-2 from-orange-50 via-white to-green-50 py-6">
//       <div className="w-[90%] lg:w-[75%] mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <button 
//             onClick={() => navigate('/')}
//             className="flex items-center cursor-pointer text-gray-600 hover:text-orange-600 transition mb-4 font-medium"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Dashboard
//           </button>
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
//                 Delivery History
//               </h1>
//               <p className="text-gray-600 mt-1">View all your completed deliveries</p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Today's Deliveries */}
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100 text-sm font-medium mb-1">Today's Deliveries</p>
//                 <p className="text-3xl font-bold">{todayDeliveries?.count || 0}</p>
//               </div>
//               <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Today's Earnings */}
//           <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100 text-sm font-medium mb-1">Today's Earnings</p>
//                 <p className="text-3xl font-bold">₹{todayEarnings}</p>
//               </div>
//               <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Total Earnings */}
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100 text-sm font-medium mb-1">Total Earnings</p>
//                 <p className="text-3xl font-bold">₹{totalEarnings}</p>
//               </div>
//               <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Delivery List */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
//           <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-4">
//             <h2 className="text-xl font-bold text-white flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               All Deliveries ({historyPagination?.total || 0})
//             </h2>
//           </div>

//           <div className="p-6">
//             {deliveryHistory.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                   </svg>
//                 </div>
//                 <p className="text-gray-700 text-lg font-semibold mb-2">No Deliveries Yet</p>
//                 <p className="text-gray-500 mb-6">Your completed deliveries will appear here</p>
//                 <button
//                   onClick={() => navigate('/')}
//                   className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
//                 >
//                   Start Delivering
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-4">
//                   {deliveryHistory.map((order, index) => (
//                     <div 
//                       key={order._id} 
//                       className="border-2 border-orange-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-orange-50 hover:scale-[1.01]"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex items-start gap-3">
//                           <div className="bg-green-100 p-2 rounded-lg">
//                             <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h3>
//                             <p className="text-sm text-gray-600 mt-1">
//                               <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               {new Date(order.deliveredAt).toLocaleDateString('en-US', { 
//                                 year: 'numeric', 
//                                 month: 'short', 
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold text-green-600">₹{order.amount}</p>
//                           <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
//                             ✓ DELIVERED
//                           </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-orange-100">
//                         <div className="space-y-2">
//                           <div className="flex items-start">
//                             <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                             <div>
//                               <p className="text-xs text-gray-500 font-semibold">CUSTOMER</p>
//                               <p className="text-sm font-semibold text-gray-800">{order.name}</p>
//                               <p className="text-sm text-gray-600">📞 {order.phone}</p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex items-start">
//                             <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                             </svg>
//                             <div>
//                               <p className="text-xs text-gray-500 font-semibold">ADDRESS</p>
//                               <p className="text-sm text-gray-700">{order.address?.location || 'N/A'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-100">
//                         <div className="flex items-center text-gray-600">
//                           <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                           </svg>
//                           <span className="font-medium">{order.items?.length || 0} item(s)</span>
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Delivery #{historyPagination?.total ? historyPagination.total - ((currentPage - 1) * 10 + index) : index + 1}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {historyPagination && historyPagination.pages > 1 && (
//                   <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                       className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center"
//                     >
//                       <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                       </svg>
//                       Previous
//                     </button>
                    
//                     <div className="flex items-center gap-2">
//                       {[...Array(historyPagination.pages)].map((_, idx) => (
//                         <button
//                           key={idx + 1}
//                           onClick={() => setCurrentPage(idx + 1)}
//                           className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
//                             currentPage === idx + 1
//                               ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           {idx + 1}
//                         </button>
//                       ))}
//                     </div>

//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(historyPagination.pages, prev + 1))}
//                       disabled={currentPage === historyPagination.pages}
//                       className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center"
//                     >
//                       Next
//                       <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryHistory;


// deliveryPartner/src/components/DeliveryHistory.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryHistoryThunk, getTodayDeliveriesThunk } from '../store/delivery/deliveryThunk';
import { useNavigate } from 'react-router-dom';

const DeliveryHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { 
    deliveryHistory, 
    historyLoading, 
    historyError, 
    historyPagination,
    todayDeliveries 
  } = useSelector(state => state.delivery);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getDeliveryHistoryThunk({ page: currentPage, limit: 10 }));
    dispatch(getTodayDeliveriesThunk());
  }, [dispatch, currentPage]);

  if (historyLoading && deliveryHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading delivery history...</p>
        </div>
      </div>
    );
  }

  if (historyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading History</h3>
          <p className="text-red-600 mb-4">{historyError}</p>
          <button 
            onClick={() => dispatch(getDeliveryHistoryThunk({ page: currentPage, limit: 10 }))}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate total earnings
  const totalEarnings = deliveryHistory?.reduce((sum, order) => sum + order.amount, 0);
  const todayEarnings = todayDeliveries?.totalEarnings || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-2 from-purple-50 via-white to-blue-50 py-6">
      <div className="w-[90%] lg:w-[80%] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer text-gray-600 hover:text-purple-600 transition mb-4 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Delivery History
              </h1>
              <p className="text-gray-600 mt-1">View all your completed deliveries</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Today's Deliveries */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Today's Deliveries</p>
                <p className="text-3xl font-bold">{todayDeliveries?.count || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Today's Earnings */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Today's Earnings</p>
                <p className="text-3xl font-bold">₹{todayEarnings}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">₹{totalEarnings}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Deliveries ({historyPagination?.total || 0})
            </h2>
          </div>

          <div className="p-6">
            {deliveryHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg font-semibold mb-2">No Deliveries Yet</p>
                <p className="text-gray-500 mb-6">Your completed deliveries will appear here</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
                >
                  Start Delivering
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {deliveryHistory.map((order, index) => (
                    <div 
                      key={order._id} 
                      className="border-2 border-purple-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-purple-50 hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(order.deliveredAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{order.amount}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            ✓ DELIVERED
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-100">
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">CUSTOMER</p>
                              <p className="text-sm font-semibold text-gray-800">{order.name}</p>
                              <p className="text-sm text-gray-600">📞 {order.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">ADDRESS</p>
                              <p className="text-sm text-gray-700">{order.address?.location || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-100">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span className="font-medium">{order.items?.length || 0} item(s)</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Delivery #{historyPagination?.total ? historyPagination.total - ((currentPage - 1) * 10 + index) : index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {historyPagination && historyPagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(historyPagination.pages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === idx + 1
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-110'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(historyPagination.pages, prev + 1))}
                      disabled={currentPage === historyPagination.pages}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center"
                    >
                      Next
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
